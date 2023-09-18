import { create } from "zustand";

interface OutputModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}


const useOutputModal = create<OutputModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))

export default useOutputModal
