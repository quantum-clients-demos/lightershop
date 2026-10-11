import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import Base, engine, AsyncSessionLocal
from app.core.seed import seed_initial_data


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_db():
    from app.core.seed import init_db
    await init_db()
    yield
    from app.core.database import engine
    await engine.dispose()


@pytest.mark.asyncio(loop_scope="session")
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"


@pytest.mark.asyncio(loop_scope="session")
async def test_products_list():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/products")
        assert response.status_code == 200
        products = response.json()
        assert len(products) >= 6
        assert any(p["slug"] == "classic-steel" for p in products)


@pytest.mark.asyncio(loop_scope="session")
async def test_pricing_quote_retail_vs_wholesale():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Retail quote for 1 unit of Classic Steel (₹699)
        retail_quote = await ac.post("/api/v1/pricing/quote", json={
            "items": [{"product_id": 1, "quantity": 1, "mode": "retail"}]
        })
        assert retail_quote.status_code == 200
        retail_data = retail_quote.json()
        assert retail_data["subtotal"] == 699.0
        assert retail_data["shipping_amount"] == 149.0  # < ₹1,999 threshold

        # 2. Wholesale quote for 20 units of Classic Steel (Wholesale price ₹420/unit = ₹8,400)
        wholesale_quote = await ac.post("/api/v1/pricing/quote", json={
            "items": [{"product_id": 1, "quantity": 20, "mode": "wholesale"}]
        })
        assert wholesale_quote.status_code == 200
        wholesale_data = wholesale_quote.json()
        assert wholesale_data["subtotal"] == 8400.0  # 20 * 420
        assert wholesale_data["retail_subtotal"] == 13980.0  # 20 * 699
        assert wholesale_data["wholesale_savings"] == 5580.0  # saved ₹5,580!
        assert wholesale_data["shipping_amount"] == 0.0  # Free shipping > ₹1,999 threshold


@pytest.mark.asyncio(loop_scope="session")
async def test_order_creation_and_razorpay_checkout():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Create order
        order_payload = {
            "items": [{"product_id": 1, "quantity": 2, "mode": "retail"}],
            "customer_name": "Antigravity Tester",
            "customer_email": "tester@example.com",
            "customer_phone": "+91 9876543210",
            "shipping_address": "42 Connaught Place, New Delhi",
            "order_type": "retail"
        }
        res = await ac.post("/api/v1/orders", json=order_payload)
        assert res.status_code == 201
        order = res.json()
        assert order["order_number"].startswith("EMB-")
        order_id = order["id"]

        # Create Razorpay Order
        rzp_res = await ac.post("/api/v1/payments/razorpay/order", json={"order_id": order_id})
        assert rzp_res.status_code == 200
        rzp_order = rzp_res.json()
        assert "razorpay_order_id" in rzp_order

        # Verify Razorpay signature
        verify_res = await ac.post("/api/v1/payments/razorpay/verify", json={
            "order_id": order_id,
            "razorpay_order_id": rzp_order["razorpay_order_id"],
            "razorpay_payment_id": "pay_demo_success_12345",
            "razorpay_signature": "mock_signature_test"
        })
        assert verify_res.status_code == 200
        assert verify_res.json()["payment_status"] == "paid"
