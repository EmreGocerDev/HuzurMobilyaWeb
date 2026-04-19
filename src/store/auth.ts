import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customer } from '@/types';

interface AuthStore {
  customer: Customer | null;
  isAuthenticated: boolean;
  login: (customer: Customer) => void;
  logout: () => void;
  updateCustomer: (data: Partial<Customer>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      customer: null,
      isAuthenticated: false,

      login: (customer) => set({ customer, isAuthenticated: true }),

      logout: () => set({ customer: null, isAuthenticated: false }),

      updateCustomer: (data) =>
        set((state) => ({
          customer: state.customer ? { ...state.customer, ...data } : null,
        })),
    }),
    { name: 'huzur-auth' }
  )
);
