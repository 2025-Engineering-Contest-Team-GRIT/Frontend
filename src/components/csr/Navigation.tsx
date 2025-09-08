'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  IconDashboard, 
  IconMap, 
  IconTarget, 
  IconCalendar, 
  IconBarChart2, 
  IconMortarBoard, 
  IconSettings 
} from '@/components/common';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { href: '/dashboard', label: '대시보드', icon: <IconDashboard /> },
  { href: '/roadmap', label: '로드맵', icon: <IconMap /> },
  { href: '/completion', label: '이수현황', icon: <IconTarget /> },
  { href: '/timetable', label: '시간표', icon: <IconCalendar /> },
  { href: '/statistics', label: '통계', icon: <IconBarChart2 /> },
  { href: '/graduation', label: '졸업요건', icon: <IconMortarBoard /> },
  { href: '/settings', label: '설정', icon: <IconSettings /> },
];

export const CSRNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      <div className="text-sm font-medium text-slate-500 mb-4">메뉴</div>
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors
                ${isActive 
                  ? 'text-blue-700 bg-blue-50 border border-blue-100 font-medium' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

// Enhanced header with CSR features
export const CSRHeader = () => {
  const pathname = usePathname();
  
  // Get page title based on current route
  const getPageTitle = (path: string) => {
    const item = navigationItems.find(item => item.href === path);
    return item ? `한성 길라잡이 - ${item.label}` : '한성 길라잡이';
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-slate-800">
        {getPageTitle(pathname)}
      </h1>
      
      {/* Additional CSR features can be added here */}
      <div className="flex items-center gap-2">
        {/* Theme toggle, notifications, etc. */}
      </div>
    </div>
  );
};