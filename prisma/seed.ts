import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'Junco@example.com',
      name: 'Junco H-Bah',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'Bengt@example.com',
      name: 'Bengt Young',
    },
  })

  // Create some tasks
  await prisma.task.create({
    data: {
      title: 'Byta batteri på Seiko klocka',
      description: 'Gå till urmakaren och lämna in klockan för att byta batteri innan du flippar den.',
      status: 'TODO',
      priority: 'MEDIUM',
      assigneeId: user1.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Regga timmar på Th',
      description: 'Regga ghosttimmar på Th trotts jag inte gjort något alls.',
      status: 'TODO',
      priority: 'LOW',
      assigneeId: user2.id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })