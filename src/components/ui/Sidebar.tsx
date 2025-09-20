'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Overview', href: '/', icon: HomeIcon },
  { name: 'Kanban', href: '/kanban', icon: Squares2X2Icon },
  { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      {/* Header */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
        <h1 className="text-xl font-bold text-white">TaskFlow</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col pl-2 overflow-y-auto">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        isActive
                          ? 'bg-gray-700 text-white border-r-2 border-blue-500'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700',
                        'group flex gap-x-3 p-2 text-sm leading-6 font-semibold transition-colors duration-200'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      {session?.user && (
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session.user.email}
              </p>
              <p className="text-xs text-blue-400 font-medium">
                {session.user.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="mt-3 w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center">
          Collaborative Task Management
        </p>
      </div>
    </div>
  )
}