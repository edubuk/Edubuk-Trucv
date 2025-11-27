// authStore.ts
import { create } from "zustand";

interface AuthStore {
  showInvalidTokenModal: boolean;
  setShowInvalidTokenModal: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  showInvalidTokenModal: false,
  setShowInvalidTokenModal: (value) => set({ showInvalidTokenModal: value }),
}));
