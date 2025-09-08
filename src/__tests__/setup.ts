import { jest } from '@jest/globals';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Zustand stores
jest.mock('@/store', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
  useUIStore: () => ({
    activeView: 'dashboard',
    screen: 'app',
    selectedCourseId: null,
    isAiLoading: false,
    setActiveView: jest.fn(),
    setScreen: jest.fn(),
    setSelectedCourseId: jest.fn(),
    setIsAiLoading: jest.fn(),
  }),
  useCourseStore: () => ({
    selectedCourseForModal: null,
    aiRecommendation: '',
    setSelectedCourseForModal: jest.fn(),
    setAiRecommendation: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

export {};