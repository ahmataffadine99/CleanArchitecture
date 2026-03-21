import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
  id: string;
  label: string;
  rue: string;
  ville: string;
  codePostal: string;
  telephone: string;
  type: 'home' | 'work' | 'other';
}

interface AddressState {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [
        { id: 'default-1', label: 'Ma Maison', rue: '27 Rue Cambronne', ville: 'Paris', codePostal: '75015', telephone: '0612345678', type: 'home' }
      ],
      addAddress: (address) => set((state) => ({
        addresses: [...state.addresses, { ...address, id: Math.random().toString(36).substr(2, 9) }]
      })),
      removeAddress: (id) => set((state) => ({
        addresses: state.addresses.filter(a => a.id !== id)
      })),
      updateAddress: (id, updated) => set((state) => ({
        addresses: state.addresses.map(a => a.id === id ? { ...a, ...updated } : a)
      })),
    }),
    {
      name: 'ecoeats-addresses-client',
    }
  )
);
