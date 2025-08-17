// Example Integration Test for student creation

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentsPage from '@/app/(app)/students/page';
import { StudentProvider } from '@/hooks/use-students';
import { AuthProvider } from '@/hooks/use-auth';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Student Creation Integration Test', () => {
  it('allows an admin to create a student and see them in the list', async () => {
    render(
      <AuthProvider>
        <StudentProvider>
          <StudentsPage />
        </StudentProvider>
      </AuthProvider>
    );

    // Click the "Create Student" button
    fireEvent.click(screen.getByText(/Create Student/i));

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Student' } });
    fireEvent.change(screen.getByLabelText(/Grade/i), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText(/Section/i), { target: { value: 'D' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Save Changes/i));
    
    // The new student should now be in the table
    await waitFor(() => {
        expect(screen.getByText('Test Student')).toBeInTheDocument();
        expect(screen.getByText('8')).toBeInTheDocument();
        expect(screen.getByText('D')).toBeInTheDocument();
    });
  });
});
