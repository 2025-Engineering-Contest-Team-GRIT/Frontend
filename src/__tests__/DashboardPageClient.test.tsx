/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { DashboardPageClient } from '@/components/csr/DashboardPageClient';
import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

// Mock the useQuery hook
jest.mock('@tanstack/react-query');
const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

// Mock the hooks
jest.mock('@/hooks/useStore', () => ({
  useNavigation: () => ({
    navigateToView: jest.fn(),
  }),
}));

describe('DashboardPageClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    } as any);

    render(<DashboardPageClient />);
    
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('renders dashboard view when data is loaded', async () => {
    const mockStudent = mockStudents[StudentStatus.SOPHOMORE];
    
    mockUseQuery.mockReturnValue({
      data: mockStudent,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    render(<DashboardPageClient />);
    
    await waitFor(() => {
      expect(screen.getByText(mockStudent.name)).toBeInTheDocument();
    });
  });

  it('handles error state properly', () => {
    const mockError = new Error('Failed to fetch student data');
    
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      refetch: jest.fn(),
    } as any);

    // Since we're throwing the error in the component, we need to catch it
    expect(() => render(<DashboardPageClient />)).toThrow('Failed to fetch student data');
  });
});