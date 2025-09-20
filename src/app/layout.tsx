import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TrpcProvider } from '@/components/providers/trpc-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { AppLayout } from '@/components/ui/AppLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaskFlow - Collaborative Task Management',
  description: 'A modern task management app with team collaboration features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <TrpcProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </TrpcProvider>
        </AuthProvider>
      </body>
    </html>
  )
}