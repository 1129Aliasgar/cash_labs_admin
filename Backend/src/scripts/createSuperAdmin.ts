import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { getDbConnection } from '../database/connectionManager';
import { registerModelsOnConnection } from '../models';
import { UserRole, MerchantStatus } from '../constants/user.constants';

async function createSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const dbName = process.env.SEED_DB_NAME || 'auth';

  if (!email || !password) {
    console.error('Error: SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  try {
    const conn = await getDbConnection(dbName);
    console.log('Connected to database');
    const models = await registerModelsOnConnection(conn);
    const User = models.user;

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(`[Seed] Super Admin with email ${email} already exists. Skipping.`);
      process.exit(0);
    }

    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await User.create({
      email,
      password: passwordHash,
      fullName: 'System Super Admin',
      companyName: 'CashLabs Internal',
      role: UserRole.SUPER_ADMIN,
      merchantStatus: MerchantStatus.NONE,
      isVerified: true,
    });

    console.log(`[Seed] Super Admin created successfully: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error creating Super Admin:', error);
    process.exit(1);
  }
}

createSuperAdmin();
