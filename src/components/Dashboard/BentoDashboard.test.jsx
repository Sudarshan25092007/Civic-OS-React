import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import BentoDashboard from './BentoDashboard';

// Mock the Context logic directly
vi.mock('../../context/ReportContext', () => ({
  useReportContext: () => ({
    issues: [
      { id: '1', status: 'Pending' },
      { id: '2', status: 'Resolved' },
      { id: '3', status: 'Pending' }
    ],
    loadingDb: false
  })
}));

describe('BentoDashboard', () => {
  it('calculates and renders the correct dashboard statistics based on the issues array length', () => {
    render(<BentoDashboard />);
    
    // Assert 3 Total
    expect(screen.getByText('Total Reports')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Assert 1 Resolved
    expect(screen.getByText('Resolved Issues')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    // Assert 2 Pending
    expect(screen.getByText('Pending Action')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
