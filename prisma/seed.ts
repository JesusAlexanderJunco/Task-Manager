import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('user123', 12)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.com' },
    update: {},
    create: {
      email: 'admin@taskflow.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@taskflow.com' },
    update: {},
    create: {
      email: 'user@taskflow.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })

  // Create additional test users
  const testUser1 = await prisma.user.upsert({
    where: { email: 'john@taskflow.com' },
    update: {},
    create: {
      email: 'john@taskflow.com',
      name: 'John Doe',
      password: userPassword,
      role: 'USER',
    },
  })

  const testUser2 = await prisma.user.upsert({
    where: { email: 'jane@taskflow.com' },
    update: {},
    create: {
      email: 'jane@taskflow.com',
      name: 'Jane Smith',
      password: userPassword,
      role: 'USER',
    },
  })

  // Create sample tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Setup Authentication System',
      description: 'Implement NextAuth.js with role-based access control',
      status: 'DONE',
      priority: 'HIGH',
      assigneeId: admin.id,
      dueDate: new Date('2024-01-15'),
    },
  })

  const task2 = await prisma.task.create({
    data: {
      title: 'Design User Interface',
      description: 'Create responsive layouts for the task management dashboard',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      assigneeId: testUser1.id,
      dueDate: new Date('2024-01-20'),
    },
  })

  const task3 = await prisma.task.create({
    data: {
      title: 'Implement Real-time Updates',
      description: 'Add WebSocket support for live task updates',
      status: 'TODO',
      priority: 'LOW',
      assigneeId: testUser2.id,
      dueDate: new Date('2024-01-25'),
    },
  })

  const task4 = await prisma.task.create({
    data: {
      title: 'Database Optimization',
      description: 'Optimize queries and add proper indexing',
      status: 'TODO',
      priority: 'URGENT',
      assigneeId: user.id,
    },
  })

  const task5 = await prisma.task.create({
    data: {
      title: 'Write Documentation',
      description: 'Create comprehensive API and user documentation',
      status: 'TODO',
      priority: 'MEDIUM',
      assigneeId: testUser1.id,
    },
  })

  // Create sample comments (only admin can comment)
  await prisma.comment.create({
    data: {
      content: 'Great work on implementing the authentication! The role-based permissions are working perfectly.',
      taskId: task1.id,
      authorId: admin.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'The UI looks good so far. Make sure to test it on mobile devices as well.',
      taskId: task2.id,
      authorId: admin.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'This is a complex task. Consider using Socket.io for the WebSocket implementation.',
      taskId: task3.id,
      authorId: admin.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'Priority changed to URGENT due to performance issues in production.',
      taskId: task4.id,
      authorId: admin.id,
    },
  })

  console.log('🌱 Database seeded successfully!')
  console.log('👤 Admin account: admin@taskflow.com / admin123')
  console.log('👤 User account: user@taskflow.com / user123')
  console.log('👤 Test users: john@taskflow.com, jane@taskflow.com / user123')
  console.log('📋 Created 5 sample tasks with comments')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })