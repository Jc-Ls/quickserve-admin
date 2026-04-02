import { pgTable, text, integer, doublePrecision, boolean, timestamp, serial, varchar, numeric, decimal, json, jsonb } from "drizzle-orm/pg-core";


// --- 1. THE BIG CATEGORIES (e.g., Food, Local Market, Pharmacy) ---
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), 
  slug: text('slug').notNull().unique(), 
});

// --- 2. SUB-CATEGORIES (e.g., Raw Peppers, Fast Food, Grains, Skincare) ---
export const subCategories = pgTable('sub_categories', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

// --- 3. VENDORS (From Supermarkets to Community Pepper Sellers) ---
export const vendors = pgTable('vendors', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  brandName: text('brand_name').notNull(),
  categoryId: integer('category_id').references(() => categories.id), // Their main grid card
  storeBannerUrl: text('store_banner_url'), // Let them upload a header image
  kycStatus: text('kyc_status').default('Pending'),
  walletBalance: decimal('wallet_balance', { precision: 10, scale: 2 }).default('0.00'),
  isPromoted: boolean('is_promoted').default(false), // Admin can toggle this to give them a "Promotion Badge"
  createdAt: timestamp('created_at').defaultNow(),
});

// --- 4. VENDOR PRODUCTS (Vendors control this completely) ---
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').references(() => vendors.id).notNull(),
  subCategoryId: integer('sub_category_id').references(() => subCategories.id), // e.g., categorized as "Raw Peppers"
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal('discount_price', { precision: 10, scale: 2 }), // Vendors can set their own sales!
  imageUrl: text('image_url'),
  isAvailable: boolean('is_available').default(true), // Vendor can toggle this if out of stock
  promoBadge: text('promo_badge'), // e.g., "Hot Deal", "Bestseller" (The product promotion bandage)
  createdAt: timestamp('created_at').defaultNow(),
});

// --- 5. ADMIN SPECIAL MEALS (Strictly for the ticking clock banner, managed by YOU) ---
export const specialMeals = pgTable('special_meals', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g., "Wednesday Jollof Fiesta"
  description: text('description'),
  imageUrl: text('image_url'),
  promoBadge: text('promo_badge').default('Special Plan'), // The promotion bandage for the Special Meal
  isAvailableToday: boolean('is_available_today').default(false), // Admin toggles what is served today
  createdAt: timestamp('created_at').defaultNow(),
});

// --- EXISTING TABLES (Users, Riders, Subs, Orders) ---
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name'),
  walletBalance: decimal('wallet_balance', { precision: 10, scale: 2 }).default('0.00'),
  isStudent: boolean('is_student').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const riders = pgTable('riders', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  vehicleType: text('vehicle_type'),
  walletBalance: decimal('wallet_balance', { precision: 10, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subscriptionPlans = pgTable('subscription_plans', {
  id: serial('id').primaryKey(),
  planName: text('plan_name').notNull(),
  category: text('category').notNull(),
  priceWeekly: decimal('price_weekly', { precision: 10, scale: 2 }).notNull(),
  priceMonthly: decimal('price_monthly', { precision: 10, scale: 2 }).notNull(),
  mealsPerDay: integer('meals_per_day').notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  consumerId: integer('consumer_id').references(() => users.id).notNull(),
  vendorId: integer('vendor_id').references(() => vendors.id), // Nullable for Special Meals
  riderId: integer('rider_id').references(() => riders.id),
  isSpecialMeal: boolean('is_special_meal').default(false), // Tells the system if this is a sub order or a normal order
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  adminFee: decimal('admin_fee', { precision: 10, scale: 2 }).default('150.00'),
  status: text('status').default('Placed'),
  consumerQrToken: text('consumer_qr_token'),
  riderQrToken: text('rider_qr_token'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ==========================================
// QUICKSERVE SPECIAL MEAL ENGINE (DRIZZLE)
// ==========================================

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(), // Links to Consumer
  planType: text("plan_type").notNull(), // "corporate" or "student"
  tier: text("tier").notNull(), // "basic", "standard", "premium"
  cycle: text("cycle").notNull(), // "weekly" or "monthly"
  totalDays: integer("total_days").notNull(), // 7 or 30
  amountPaid: doublePrecision("amount_paid").notNull(), // e.g., 15000
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mealSchedules = pgTable("meal_schedules", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  subscriptionId: text("subscription_id").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
  deliveryDate: text("delivery_date").notNull(), // e.g., "2026-04-05"
  timeSlot: text("time_slot").notNull(), // "morning", "afternoon", "evening"
  meal: text("meal").notNull(), // e.g., "Amala"
  protein: text("protein").notNull(), // e.g., "Fish"
  status: text("status").default("PENDING").notNull(), // PENDING, COOKING, DISPATCHED, DELIVERED
  riderId: text("rider_id"), // Blank until assigned!
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// WALLET & CASHBACK ENGINE (DRIZZLE)
// ==========================================

export const walletTransactions = pgTable("wallet_transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  amount: doublePrecision("amount").notNull(), // e.g., 2000
  type: text("type").notNull(), // "CREDIT" or "DEBIT"
  description: text("description").notNull(), // e.g., "Cashback"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
