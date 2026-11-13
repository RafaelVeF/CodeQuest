import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { isStrongPassword, PASSWORD_POLICY_MESSAGE } from '@codequest/shared';

const prisma = new PrismaClient();
const demoPassword = 'CodeQuestDemo2026!';

async function main(): Promise<void> {
  if (!isStrongPassword(demoPassword)) {
    throw new Error(PASSWORD_POLICY_MESSAGE);
  }

  const roles = await Promise.all(
    ['PLAYER', 'MODERATOR', 'ADMIN'].map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
  const playerRole = roles.find((role) => role.name === 'PLAYER');

  if (!playerRole) {
    throw new Error('Le rôle PLAYER est introuvable après son initialisation.');
  }

  const existingDemoUser = await prisma.user.findUnique({
    where: { email: 'demo@codequest.gg' },
    select: { id: true },
  });

  if (!existingDemoUser) {
    const passwordHash = await argon2.hash(demoPassword, {
      type: argon2.argon2id,
    });

    await prisma.user.create({
      data: {
        email: 'demo@codequest.gg',
        pseudo: 'demo_runner',
        pseudoNormalized: 'demo_runner',
        passwordHash,
        roles: {
          create: {
            roleId: playerRole.id,
          },
        },
      },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
