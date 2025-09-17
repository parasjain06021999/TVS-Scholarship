// MANDATORY: Testing utilities
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// MANDATORY: Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// MANDATORY: Mock API responses
export const mockAPIResponses = {
  // Authentication
  login: {
    success: {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['student'],
      },
      token: 'mock-jwt-token',
    },
    error: {
      message: 'Invalid credentials',
    },
  },

  // Students
  students: {
    list: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        status: 'active',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543211',
        status: 'pending',
      },
    ],
    single: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      status: 'active',
      profile: {
        dateOfBirth: '1995-01-01',
        address: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400001',
      },
    },
  },

  // Scholarships
  scholarships: {
    list: [
      {
        id: '1',
        name: 'Merit Scholarship',
        description: 'For students with high academic performance',
        amount: 50000,
        deadline: '2024-12-31',
        status: 'active',
      },
      {
        id: '2',
        name: 'Need-based Scholarship',
        description: 'For students with financial need',
        amount: 75000,
        deadline: '2024-11-30',
        status: 'active',
      },
    ],
    single: {
      id: '1',
      name: 'Merit Scholarship',
      description: 'For students with high academic performance',
      amount: 50000,
      deadline: '2024-12-31',
      status: 'active',
      eligibility: {
        minPercentage: 80,
        maxIncome: 500000,
        categories: ['General', 'OBC'],
      },
    },
  },

  // Applications
  applications: {
    list: [
      {
        id: '1',
        studentId: '1',
        scholarshipId: '1',
        status: 'pending',
        appliedDate: '2024-01-15',
        documents: ['aadhaar', 'marksheet'],
      },
      {
        id: '2',
        studentId: '2',
        scholarshipId: '2',
        status: 'approved',
        appliedDate: '2024-01-10',
        documents: ['aadhaar', 'marksheet', 'income_certificate'],
      },
    ],
    single: {
      id: '1',
      studentId: '1',
      scholarshipId: '1',
      status: 'pending',
      appliedDate: '2024-01-15',
      documents: ['aadhaar', 'marksheet'],
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '9876543210',
      },
      academicInfo: {
        percentage: 85,
        course: 'Engineering',
        year: '2nd',
      },
    },
  },

  // Documents
  documents: {
    list: [
      {
        id: '1',
        name: 'Aadhaar Card',
        type: 'identity',
        status: 'verified',
        uploadedAt: '2024-01-15',
      },
      {
        id: '2',
        name: 'Marksheet',
        type: 'academic',
        status: 'pending',
        uploadedAt: '2024-01-15',
      },
    ],
  },

  // Analytics
  analytics: {
    dashboard: {
      totalApplications: 150,
      approvedApplications: 45,
      pendingApplications: 80,
      rejectedApplications: 25,
      totalAmountDisbursed: 2250000,
      averageProcessingTime: 7,
    },
    trends: {
      monthly: [
        { month: 'Jan', applications: 20, approved: 15 },
        { month: 'Feb', applications: 25, approved: 18 },
        { month: 'Mar', applications: 30, approved: 22 },
      ],
    },
  },
};

// MANDATORY: Mock functions
export const mockFunctions = {
  // API calls
  apiCall: jest.fn(),
  uploadFile: jest.fn(),
  
  // Navigation
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  
  // Form handlers
  onSubmit: jest.fn(),
  onChange: jest.fn(),
  onBlur: jest.fn(),
  
  // UI handlers
  onClick: jest.fn(),
  onClose: jest.fn(),
  onRetry: jest.fn(),
  
  // File handlers
  onFileSelect: jest.fn(),
  onFileUpload: jest.fn(),
  onFileRemove: jest.fn(),
};

// MANDATORY: Test data generators
export const generateTestData = {
  // Generate random user
  user: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    name: 'Test User',
    email: 'test@example.com',
    roles: ['student'],
    ...overrides,
  }),

  // Generate random application
  application: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    studentId: '1',
    scholarshipId: '1',
    status: 'pending',
    appliedDate: new Date().toISOString(),
    documents: [],
    ...overrides,
  }),

  // Generate random scholarship
  scholarship: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    name: 'Test Scholarship',
    description: 'Test description',
    amount: 50000,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    ...overrides,
  }),

  // Generate form data
  formData: (overrides = {}) => ({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '9876543210',
    ...overrides,
  }),
};

// MANDATORY: Test helpers
export const testHelpers = {
  // Wait for async operations
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock file for upload tests
  createMockFile: (name: string, type: string, size: number) => {
    const file = new File(['test content'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  },

  // Mock form event
  createMockFormEvent: (target: any) => ({
    preventDefault: jest.fn(),
    target,
  }),

  // Mock change event
  createMockChangeEvent: (name: string, value: any) => ({
    target: { name, value },
  }),

  // Mock file change event
  createMockFileChangeEvent: (files: File[]) => ({
    target: { files },
  }),

  // Mock drag event
  createMockDragEvent: (files: File[]) => ({
    preventDefault: jest.fn(),
    dataTransfer: { files },
  }),
};

// MANDATORY: Accessibility test helpers
export const accessibilityHelpers = {
  // Check for required ARIA attributes
  checkAriaAttributes: (element: HTMLElement) => {
    const hasRole = element.hasAttribute('role');
    const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
    const hasAriaDescribedBy = element.hasAttribute('aria-describedby');
    
    return {
      hasRole,
      hasAriaLabel,
      hasAriaDescribedBy,
      isAccessible: hasRole && hasAriaLabel,
    };
  },

  // Check keyboard navigation
  checkKeyboardNavigation: (element: HTMLElement) => {
    const isFocusable = element.tabIndex >= 0 || element.tagName === 'BUTTON' || element.tagName === 'A';
    const hasTabIndex = element.hasAttribute('tabindex');
    
    return {
      isFocusable,
      hasTabIndex,
      canNavigate: isFocusable || hasTabIndex,
    };
  },

  // Check color contrast (simplified)
  checkColorContrast: (foreground: string, background: string) => {
    // This is a simplified check - in real tests, use a proper contrast checker
    const contrast = Math.abs(parseInt(foreground) - parseInt(background));
    return contrast > 100; // Simplified threshold
  },
};

// MANDATORY: Performance test helpers
export const performanceHelpers = {
  // Measure render time
  measureRenderTime: (component: ReactElement) => {
    const start = performance.now();
    render(component);
    const end = performance.now();
    return end - start;
  },

  // Check for memory leaks
  checkMemoryLeaks: () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    return {
      initialMemory,
      checkLeak: (currentMemory: number) => currentMemory > initialMemory * 1.5,
    };
  },

  // Mock large datasets
  generateLargeDataset: (size: number) => {
    return Array.from({ length: size }, (_, index) => ({
      id: index,
      name: `Item ${index}`,
      value: Math.random() * 100,
    }));
  },
};

// MANDATORY: Integration test helpers
export const integrationHelpers = {
  // Mock complete user flow
  mockUserFlow: {
    login: () => mockFunctions.apiCall.mockResolvedValue(mockAPIResponses.login.success),
    getProfile: () => mockFunctions.apiCall.mockResolvedValue(mockAPIResponses.students.single),
    getApplications: () => mockFunctions.apiCall.mockResolvedValue(mockAPIResponses.applications.list),
    submitApplication: () => mockFunctions.apiCall.mockResolvedValue({ success: true }),
  },

  // Mock error scenarios
  mockErrorScenarios: {
    networkError: () => mockFunctions.apiCall.mockRejectedValue(new Error('Network Error')),
    serverError: () => mockFunctions.apiCall.mockRejectedValue(new Error('500 Internal Server Error')),
    validationError: () => mockFunctions.apiCall.mockRejectedValue(new Error('Validation Error')),
  },

  // Mock file upload flow
  mockFileUpload: {
    selectFile: () => mockFunctions.onFileSelect.mockImplementation(() => {}),
    uploadFile: () => mockFunctions.uploadFile.mockResolvedValue({ url: '/uploads/test.pdf' }),
    removeFile: () => mockFunctions.onFileRemove.mockImplementation(() => {}),
  },
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { default as userEvent } from '@testing-library/user-event';
