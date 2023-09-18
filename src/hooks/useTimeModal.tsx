import { create } from 'zustand';

interface TimeModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useTimeModal = create<TimeModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));

export default useTimeModal;