import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UpdateConfirmationModal from '../UpdateConfirmationModal';

describe('UpdateConfirmationModal', () => {
  const mockHandleClose = jest.fn();
  const mockHandleConfirm = jest.fn();

  const renderModal = (show = true) => {
    render(
      <UpdateConfirmationModal
        show={show}
        handleClose={mockHandleClose}
        handleConfirm={mockHandleConfirm}
      />
    );
  };

  beforeEach(() => {
    mockHandleClose.mockClear();
    mockHandleConfirm.mockClear();
  });

  test('renders modal when show is true', () => {
    renderModal();
    expect(screen.getByText('Confirm Update')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to update this item?')
    ).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    renderModal(false);
    expect(screen.queryByText('Confirm Update')).not.toBeInTheDocument();
  });

  test('calls handleClose when Cancel button is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  test('calls handleConfirm when Update button is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByText('Update'));
    expect(mockHandleConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls handleClose when close button in header is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});
