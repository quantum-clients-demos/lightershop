import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import Base
import app.models  # Ensures all models (Order, Payment, Audit, etc.) are registered on Base.metadata
from app.core.security import get_password_hash
from app.models.user import User
from app.models.product import Category, Product, WholesaleTier
from app.models.wholesale import WholesaleApplication

logger = logging.getLogger(__name__)


async def seed_initial_data(db: AsyncSession):
    # Check if products already exist
    existing = await db.execute(select(Product))
    if existing.scalars().first():
        logger.info("Database already seeded. Skipping initial seed.")
        return

    logger.info("Seeding initial database with Ember & Co. catalog...")

    # 1. Create Categories
    categories = [
        Category(name="Classic", slug="classic", description="Timeless minimalist pocket lighters"),
        Category(name="Premium Finish", slug="premium-finish", description="Luxury metallic and textured editions"),
        Category(name="Gift Picks", slug="gift-picks", description="Distinctive handcrafted collectible lighters"),
        Category(name="Everyday Carry", slug="everyday-carry", description="Durable lightweight pocket companions"),
    ]
    for cat in categories:
        db.add(cat)
    await db.flush()

    # 2. Create Products
    products_data = [
        {
            "name": "Classic Steel",
            "slug": "classic-steel",
            "tagline": "Everyday objects. Considered design.",
            "description": "Crafted from aerospace-grade brushed stainless steel with precision flint wheel ignition. A balanced, tactile weight designed for longevity.",
            "finish": "Brushed finish · Everyday carry",
            "color_hex": "#b0b3b8",
            "badge": "BESTSELLER",
            "image_url": "/images/classic-steel.png",
            "retail_price": 699.0,
            "wholesale_price": 420.0,
            "min_wholesale_qty": 20,
            "stock_quantity": 420,
            "category_id": categories[0].id,
            "tiers": [
                (20, 420.0, "Tier 1: Starter Pack (20+)"),
                (50, 380.0, "Tier 2: Master Carton (50+)"),
                (100, 340.0, "Tier 3: Distributor Pallet (100+)"),
            ]
        },
        {
            "name": "Midnight Black",
            "slug": "midnight-black",
            "tagline": "Stealth aesthetics. Modern tactile grip.",
            "description": "A deep matte black PVD coating offers unmatched fingerprint resistance and a velvety tactile handfeel. Designed for discreet carry.",
            "finish": "Matte finish · Minimal profile",
            "color_hex": "#1b1b1b",
            "badge": "POPULAR",
            "image_url": "/images/midnight-black.png",
            "retail_price": 899.0,
            "wholesale_price": 540.0,
            "min_wholesale_qty": 20,
            "stock_quantity": 380,
            "category_id": categories[1].id,
            "tiers": [
                (20, 540.0, "Tier 1: Starter Pack (20+)"),
                (50, 490.0, "Tier 2: Master Carton (50+)"),
                (100, 440.0, "Tier 3: Distributor Pallet (100+)"),
            ]
        },
        {
            "name": "Heritage Gold",
            "slug": "heritage-gold",
            "tagline": "Warm metallic finish. Collectible style.",
            "description": "A refined tribute to mid-century heirloom craftsmanship. Brushed champagne gold finish with custom-engineered wind-resistant wick.",
            "finish": "Warm metallic finish · Gift pick",
            "color_hex": "#c5a059",
            "badge": "GIFT PICK",
            "image_url": "/images/heritage-gold.png",
            "retail_price": 1299.0,
            "wholesale_price": 780.0,
            "min_wholesale_qty": 15,
            "stock_quantity": 240,
            "category_id": categories[2].id,
            "tiers": [
                (15, 780.0, "Tier 1: Boutique Display (15+)"),
                (50, 710.0, "Tier 2: Wholesale Carton (50+)"),
                (100, 650.0, "Tier 3: Partner Distributor (100+)"),
            ]
        },
        {
            "name": "Crimson Edition",
            "slug": "crimson-edition",
            "tagline": "Bold colour. Compact architectural design.",
            "description": "Anodized deep ruby crimson body with contrasting brushed rim. Brings an unmistakable character and vibrant accent to your pocket accessories.",
            "finish": "Bold colour · Compact design",
            "color_hex": "#9e2a2b",
            "badge": "NEW",
            "image_url": "/images/crimson-edition.png",
            "retail_price": 999.0,
            "wholesale_price": 600.0,
            "min_wholesale_qty": 20,
            "stock_quantity": 310,
            "category_id": categories[1].id,
            "tiers": [
                (20, 600.0, "Tier 1: Starter Pack (20+)"),
                (50, 540.0, "Tier 2: Master Carton (50+)"),
                (100, 490.0, "Tier 3: Distributor Pallet (100+)"),
            ]
        },
        {
            "name": "Pocket Essential",
            "slug": "pocket-essential",
            "tagline": "Ultra-lightweight. Clean lines.",
            "description": "Featherweight aerospace alloy built for everyday wear and tear. Slim cylinder profile slides seamlessly into any coin pocket or organizer pouch.",
            "finish": "Clean lines · Lightweight style",
            "color_hex": "#8a8d91",
            "badge": "EVERYDAY",
            "image_url": "/images/pocket-essential.png",
            "retail_price": 549.0,
            "wholesale_price": 330.0,
            "min_wholesale_qty": 25,
            "stock_quantity": 560,
            "category_id": categories[3].id,
            "tiers": [
                (25, 330.0, "Tier 1: Retail Tray (25+)"),
                (50, 290.0, "Tier 2: Carton Bulk (50+)"),
                (100, 260.0, "Tier 3: Wholesale Case (100+)"),
            ]
        },
        {
            "name": "Signature Black",
            "slug": "signature-black",
            "tagline": "Dark finish. Statement piece.",
            "description": "Our flagship dual-action flame igniter. Diamond-knurled striker with double fuel capacity for discerning collectors and cigar lounges.",
            "finish": "Dark finish · Statement piece",
            "color_hex": "#0d0d0d",
            "badge": "PREMIUM",
            "image_url": "/images/midnight-black.png",
            "retail_price": 1499.0,
            "wholesale_price": 900.0,
            "min_wholesale_qty": 10,
            "stock_quantity": 190,
            "category_id": categories[1].id,
            "tiers": [
                (10, 900.0, "Tier 1: Club Pack (10+)"),
                (30, 820.0, "Tier 2: Executive Carton (30+)"),
                (75, 750.0, "Tier 3: Master Dealer (75+)"),
            ]
        },
    ]

    for item in products_data:
        tiers_info = item.pop("tiers")
        prod = Product(**item)
        db.add(prod)
        await db.flush()

        for min_q, unit_p, label in tiers_info:
            tier = WholesaleTier(
                product_id=prod.id,
                min_qty=min_q,
                unit_price=unit_p,
                tier_label=label
            )
            db.add(tier)

    # 3. Create Admin & Wholesale Demo Users
    admin_user = User(
        email="admin@ember.co",
        hashed_password=get_password_hash("admin123"),
        full_name="Ember Admin",
        phone="+91 9876543210",
        role="admin",
        is_active=True
    )
    db.add(admin_user)

    wholesale_user = User(
        email="partner@luxe-retail.in",
        hashed_password=get_password_hash("partner123"),
        full_name="Rohit Verma",
        company_name="Luxe Retail & Lifestyle LLP",
        gstin="27AABCU9603R1ZM",
        phone="+91 9988776655",
        role="wholesale_approved",
        is_active=True
    )
    db.add(wholesale_user)
    await db.flush()

    # Create demo wholesale application
    demo_app = WholesaleApplication(
        user_id=wholesale_user.id,
        business_name="Luxe Retail & Lifestyle LLP",
        gstin="27AABCU9603R1ZM",
        contact_name="Rohit Verma",
        contact_email="partner@luxe-retail.in",
        contact_phone="+91 9988776655",
        business_type="Retailer chain",
        estimated_monthly_volume="250-500 units",
        notes="High-street lifestyle boutiques in Mumbai and Bengaluru.",
        status="approved"
    )
    db.add(demo_app)

    await db.commit()
    logger.info("Database seeding complete!")


async def init_db():
    from app.core.database import ensure_working_engine
    await ensure_working_engine()
    from app.core.database import engine, AsyncSessionLocal
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as session:
        await seed_initial_data(session)
