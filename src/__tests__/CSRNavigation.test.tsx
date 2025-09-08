/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { CSRNavigation } from '@/components/csr/Navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('CSRNavigation', () => {
  it('renders all navigation items', () => {
    render(<CSRNavigation />);
    
    expect(screen.getByText('대시보드')).toBeInTheDocument();
    expect(screen.getByText('로드맵')).toBeInTheDocument();
    expect(screen.getByText('이수현황')).toBeInTheDocument();
    expect(screen.getByText('시간표')).toBeInTheDocument();
    expect(screen.getByText('통계')).toBeInTheDocument();
    expect(screen.getByText('졸업요건')).toBeInTheDocument();
    expect(screen.getByText('설정')).toBeInTheDocument();
  });

  it('highlights the active navigation item', () => {
    render(<CSRNavigation />);
    
    const dashboardLink = screen.getByText('대시보드').closest('a');
    expect(dashboardLink).toHaveClass('text-blue-700', 'bg-blue-50');
  });

  it('renders navigation links with correct hrefs', () => {
    render(<CSRNavigation />);
    
    expect(screen.getByText('대시보드').closest('a')).toHaveAttribute('href', '/dashboard');
    expect(screen.getByText('로드맵').closest('a')).toHaveAttribute('href', '/roadmap');
    expect(screen.getByText('이수현황').closest('a')).toHaveAttribute('href', '/completion');
  });
});