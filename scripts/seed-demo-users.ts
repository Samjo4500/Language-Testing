/**
 * Seed 10 Demo Users into TestCEFR Database
 * 
 * Credentials format:
 *   Email:    demo01@testcefr.com  ... demo10@testcefr.com
 *   Password: Demo@2026!
 * 
 * Each user gets:
 *   - isDemo: true
 *   - emailVerified: true
 *   - Various plans, account types, and test credits for diversity
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('ERROR: DATABASE_URL environment variable is not set.'); process.exit(1); }

const prisma = new PrismaClient({
  datasourceUrl: DATABASE_URL,
});

const PASSWORD = 'Demo@2026!';
const SALT_ROUNDS = 12;

const DEMO_USERS = [
  {
    email: 'demo01@testcefr.com',
    name: 'Demo User 01',
    plan: 'free',
    accountType: 'individual',
    testCredits: 1,
  },
  {
    email: 'demo02@testcefr.com',
    name: 'Demo User 02',
    plan: 'free',
    accountType: 'individual',
    testCredits: 1,
  },
  {
    email: 'demo03@testcefr.com',
    name: 'Demo User 03',
    plan: 'premium',
    accountType: 'individual',
    testCredits: 3,
  },
  {
    email: 'demo04@testcefr.com',
    name: 'Demo User 04',
    plan: 'premium',
    accountType: 'individual',
    testCredits: 3,
  },
  {
    email: 'demo05@testcefr.com',
    name: 'Demo User 05',
    plan: 'pro',
    accountType: 'individual',
    testCredits: 10,
  },
  {
    email: 'demo06@testcefr.com',
    name: 'Prof. Sarah Mitchell',
    plan: 'premium',
    accountType: 'university',
    organizationName: 'Cambridge Language Institute',
    testCredits: 5,
  },
  {
    email: 'demo07@testcefr.com',
    name: 'Dr. James Crawford',
    plan: 'pro',
    accountType: 'university',
    organizationName: 'Oxford English Academy',
    testCredits: 10,
  },
  {
    email: 'demo08@testcefr.com',
    name: 'Lisa Chen',
    plan: 'premium',
    accountType: 'business',
    organizationName: 'GlobalTech Solutions',
    testCredits: 5,
  },
  {
    email: 'demo09@testcefr.com',
    name: 'Marcus Rivera',
    plan: 'pro',
    accountType: 'business',
    organizationName: 'Accenture Language Services',
    testCredits: 10,
  },
  {
    email: 'demo10@testcefr.com',
    name: 'Anna Müller',
    plan: 'free',
    accountType: 'individual',
    testCredits: 1,
  },
];

async function main() {
  console.log('🔐 Hashing password...');
  const passwordHash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

  console.log('👥 Creating 10 demo users...\n');

  let created = 0;
  let skipped = 0;

  for (const userData of DEMO_USERS) {
    try {
      const existing = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existing) {
        console.log(`⏭️  SKIP: ${userData.email} already exists (id: ${existing.id})`);
        skipped++;
        continue;
      }

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          passwordHash,
          plan: userData.plan,
          role: 'user',
          accountType: userData.accountType,
          organizationName: userData.organizationName || null,
          isDemo: true,
          emailVerified: true,
          testCredits: userData.testCredits,
        },
      });

      console.log(`✅ CREATED: ${userData.email} | ${userData.name} | Plan: ${userData.plan} | Type: ${userData.accountType}${userData.organizationName ? ` | Org: ${userData.organizationName}` : ''} | Credits: ${userData.testCredits}`);
      created++;
    } catch (err: any) {
      console.error(`❌ ERROR creating ${userData.email}: ${err.message}`);
    }
  }

  console.log(`\n📊 Summary: ${created} created, ${skipped} skipped, ${DEMO_USERS.length} total`);
  console.log('\n🔑 Login Credentials:');
  console.log('   Email:    demo01@testcefr.com  through  demo10@testcefr.com');
  console.log('   Password: Demo@2026!');
  console.log('\n📋 Full User List:');
  console.log('─'.repeat(100));
  console.log('  #  | Email                    | Name                 | Plan     | Type        | Organization');
  console.log('─'.repeat(100));
  for (const u of DEMO_USERS) {
    const idx = DEMO_USERS.indexOf(u) + 1;
    console.log(`  ${String(idx).padStart(2)} | ${u.email.padEnd(24)} | ${u.name.padEnd(20)} | ${u.plan.padEnd(8)} | ${u.accountType.padEnd(11)} | ${u.organizationName || '—'}`);
  }
  console.log('─'.repeat(100));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Fatal error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
