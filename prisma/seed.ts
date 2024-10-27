import { PrismaClient, PLAN, MembershipStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: 'John Doe', phone: '+12345678901', membershipPlan: PLAN.MONTHLY, membershipEnd: new Date('2024-11-10'), status: MembershipStatus.ACTIVE },
    { name: 'Jane Smith', phone: '+19876543210', membershipPlan: PLAN.YEARLY, membershipEnd: new Date('2025-11-10'), status: MembershipStatus.ACTIVE },
    { name: 'Samuel Green', phone: '+13579864201', membershipPlan: PLAN.QUATERLY, membershipEnd: new Date('2024-12-05'), status: MembershipStatus.EXPIRED },
    { name: 'Emily Brown', phone: '+12345678912', membershipPlan: PLAN.MONTHLY, membershipEnd: new Date('2024-11-20'), status: MembershipStatus.ACTIVE },
    { name: 'Michael White', phone: '+12345678903', membershipPlan: PLAN.HALFYEARLY, membershipEnd: new Date('2025-02-10'), status: MembershipStatus.EXPIRED },
    { name: 'Sophia Davis', phone: '+12987654321', membershipPlan: PLAN.YEARLY, membershipEnd: new Date('2024-10-30'), status: MembershipStatus.ACTIVE },
    { name: 'William Martinez', phone: '+12345678914', membershipPlan: PLAN.QUATERLY, membershipEnd: new Date('2025-01-25'), status: MembershipStatus.EXPIRED },
    { name: 'Olivia Lopez', phone: '+12345678915', membershipPlan: PLAN.MONTHLY, membershipEnd: new Date('2024-11-15'), status: MembershipStatus.ACTIVE },
    { name: 'James Wilson', phone: '+13216549870', membershipPlan: PLAN.HALFYEARLY, membershipEnd: new Date('2024-12-15'), status: MembershipStatus.EXPIRED },
    { name: 'Isabella Hernandez', phone: '+12345678916', membershipPlan: PLAN.YEARLY, membershipEnd: new Date('2025-03-10'), status: MembershipStatus.ACTIVE },
    { name: 'Liam Clark', phone: '+12345678917', membershipPlan: PLAN.MONTHLY, membershipEnd: new Date('2024-10-18'), status: MembershipStatus.ACTIVE },
    { name: 'Emma Walker', phone: '+12345678918', membershipPlan: PLAN.YEARLY, membershipEnd: new Date('2024-12-25'), status: MembershipStatus.EXPIRED },
    { name: 'Mason Hall', phone: '+12345678919', membershipPlan: PLAN.QUATERLY, membershipEnd: new Date('2025-01-05'), status: MembershipStatus.EXPIRED },
    { name: 'Ava Young', phone: '+12345678920', membershipPlan: PLAN.HALFYEARLY, membershipEnd: new Date('2025-03-20'), status: MembershipStatus.ACTIVE },
    { name: 'Ethan King', phone: '+12345678921', membershipPlan: PLAN.MONTHLY, membershipEnd: new Date('2024-11-25'), status: MembershipStatus.ACTIVE },
    { name: 'Sophia Wright', phone: '+12345678922', membershipPlan: PLAN.YEARLY, membershipEnd: new Date('2024-12-10'), status: MembershipStatus.EXPIRED },
    { name: 'Alexander Scott', phone: '+12345678923', membershipPlan: PLAN.HALFYEARLY, membershipEnd: new Date('2025-02-28'), status: MembershipStatus.ACTIVE },
    { name: 'Mia Adams', phone: '+12345678924', membershipPlan: PLAN.QUATERLY, membershipEnd: new Date('2024-12-05'), status: MembershipStatus.EXPIRED },
    { name: 'Lucas Baker', phone: '+12345678925', membershipPlan: PLAN.YEARLY, membershipEnd: new Date('2024-11-30'), status: MembershipStatus.ACTIVE },
    { name: 'Charlotte Rivera', phone: '+12345678926', membershipPlan: PLAN.HALFYEARLY, membershipEnd: new Date('2025-04-10'), status: MembershipStatus.ACTIVE },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
