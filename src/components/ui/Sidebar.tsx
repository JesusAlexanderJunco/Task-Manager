'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  Squares2X2Icon 
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

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      {/* Header */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
        <h1 className="text-xl font-bold text-white">TaskFlow</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col overflow-y-auto">
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
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200'
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

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center">
          Collaborative Task Management
        </p>
      </div>
    </div>
  )
}