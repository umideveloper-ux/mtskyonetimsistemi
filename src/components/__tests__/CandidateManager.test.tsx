import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CandidateManager from '../dashboard/CandidateManager';
import { toast } from 'react-toastify';

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('CandidateManager', () => {
  const mockSchool = {
    id: '1',
    name: 'Test School',
    candidates: {
      'A1': 5,
      'B': 3,
    },
  };

  const mockUpdateCandidates = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, queryByText } = render(
      <CandidateManager
        school={mockSchool}
        updateCandidates={mockUpdateCandidates}
      />
    );

    expect(getByText('Aday Sayıları')).toBeInTheDocument();
    expect(getByText('Göster')).toBeInTheDocument();
    expect(queryByText('A1')).not.toBeInTheDocument(); // Initially hidden
  });

  it('shows candidates when toggle button is clicked', () => {
    const { getByText } = render(
      <CandidateManager
        school={mockSchool}
        updateCandidates={mockUpdateCandidates}
      />
    );

    fireEvent.click(getByText('Göster'));
    expect(getByText('A1')).toBeInTheDocument();
    expect(getByText('B')).toBeInTheDocument();
  });

  it('updates candidate count correctly', async () => {
    const { getByText, getAllByText } = render(
      <CandidateManager
        school={mockSchool}
        updateCandidates={mockUpdateCandidates}
      />
    );

    // Show candidates
    fireEvent.click(getByText('Göster'));

    // Click + button for A1
    const plusButtons = getAllByText('+');
    fireEvent.click(plusButtons[0]);

    // Click save
    fireEvent.click(getByText('Kaydet'));

    await waitFor(() => {
      expect(mockUpdateCandidates).toHaveBeenCalledWith('1', {
        'A1': 6,
        'B': 3,
      });
      expect(toast.success).toHaveBeenCalledWith('Aday sayıları güncellendi');
    });
  });

  it('handles error case', async () => {
    mockUpdateCandidates.mockRejectedValueOnce(new Error('Update failed'));

    const { getByText } = render(
      <CandidateManager
        school={mockSchool}
        updateCandidates={mockUpdateCandidates}
      />
    );

    fireEvent.click(getByText('Göster'));
    fireEvent.click(getByText('Kaydet'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Aday sayıları güncellenirken bir hata oluştu');
    });
  });
});
