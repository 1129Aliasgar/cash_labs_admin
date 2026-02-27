import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { User, UserRole, MerchantStatus } from '../src/models/User';

async function createSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const dbUri = process.env.MONGO_URI;

  if (!email || !password || !dbUri) {
    console.error('Error: SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, and MONGODB_URI must be set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUri);
    console.log('[Seed] Connected to MongoDB.');

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
