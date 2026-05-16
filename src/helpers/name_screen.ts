import { create } from 'zustand'

interface ScreenNameFunctions {
  nameScreen: String;
  changeNameScreen: (name: String) => void;
}
export const name_Screen = create<ScreenNameFunctions>((set) => ({
  nameScreen: "Home",
  changeNameScreen: (name) => set(() => ({ nameScreen: name }))
}))
