import { create } from "zustand";

interface DefaultModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}


const useDefaultModal = create<DefaultModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))

export default useDefaultModal
