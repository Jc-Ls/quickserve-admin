import { pgTable, serial, text, decimal, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name'),
  walletBalance: decimal('wallet_balance', { precision: 10, scale: 2 }).default('0.00'),
  isStudent: boolean('is_student').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const vendors = pgTable('vendors', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  brandName: text('brand_name').notNull(),
  kycStatus: text('kyc_status').default('Pending'),
  walletBalance: decimal('wallet_balance', { precision: 10, scale: 2 }).default('0.00'),
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
  vendorId: integer('vendor_id').references(() => vendors.id).notNull(),
  riderId: integer('rider_id').references(() => riders.id),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  adminFee: decimal('admin_fee', { precision: 10, scale: 2 }).default('150.00'),
  status: text('status').default('Placed'),
  consumerQrToken: text('consumer_qr_token'),
  riderQrToken: text('rider_qr_token'),
  createdAt: timestamp('created_at').defaultNow(),
});
