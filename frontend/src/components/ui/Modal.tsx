'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

// MANDATORY: Accessible Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // MANDATORY: Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  // MANDATORY: Keyboard navigation and escape handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabTrap);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabTrap);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // MANDATORY: Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl'
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* MANDATORY: Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={handleOverlayClick}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* MANDATORY: Modal content */}
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${sizeClasses[size]} ${className}`}
        >
          {/* MANDATORY: Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 id="modal-title" className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* MANDATORY: Content */}
          <div className="modal-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// MANDATORY: Accessible Data Table
interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: DataTableColumn[];
  onSort?: (column: string) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  onSort,
  sortColumn,
  sortDirection,
  className = "",
}) => {
  const handleSort = (column: string) => {
    if (onSort) {
      onSort(column);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, column: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(column);
    }
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table 
        className="min-w-full divide-y divide-gray-200" 
        role="table" 
        aria-label="Data table"
      >
        <thead className="bg-gray-50">
          <tr role="row">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
                onKeyDown={(e) => column.sortable && handleKeyDown(e, column.key)}
                tabIndex={column.sortable ? 0 : -1}
                aria-sort={
                  sortColumn === column.key 
                    ? sortDirection === 'asc' ? 'ascending' : 'descending'
                    : 'none'
                }
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable && sortColumn === column.key && (
                    <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d={sortDirection === 'asc' 
                          ? "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          : "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        }
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} role="row" className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// MANDATORY: Accessible Progress Bar
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  className = "",
}) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={`progress-bar ${className}`}>
      {label && (
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
          <span>{label}</span>
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      <div 
        className="w-full bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${percentage}%`}
      >
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// MANDATORY: Accessible Tabs
interface TabProps {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const Tab: React.FC<TabProps> = ({
  id,
  label,
  selected,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={selected}
      aria-controls={`${id}-panel`}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        selected
          ? 'border-primary-500 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {label}
    </button>
  );
};

interface TabPanelProps {
  id: string;
  selected: boolean;
  children: ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  selected,
  children,
  className = "",
}) => {
  return (
    <div
      id={`${id}-panel`}
      role="tabpanel"
      aria-labelledby={id}
      hidden={!selected}
      className={className}
    >
      {children}
    </div>
  );
};

interface TabsProps {
  tabs: Array<{ id: string; label: string; content: ReactNode; disabled?: boolean }>;
  defaultTab?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  className = "",
}) => {
  const [selectedTab, setSelectedTab] = React.useState(defaultTab || tabs[0]?.id);

  return (
    <div className={`tabs ${className}`}>
      <div className="border-b border-gray-200" role="tablist">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            selected={selectedTab === tab.id}
            onClick={() => setSelectedTab(tab.id)}
            disabled={tab.disabled}
          />
        ))}
      </div>
      
      {tabs.map((tab) => (
        <TabPanel
          key={tab.id}
          id={tab.id}
          selected={selectedTab === tab.id}
        >
          {tab.content}
        </TabPanel>
      ))}
    </div>
  );
};
