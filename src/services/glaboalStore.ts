// src/store/userStore.ts

import create from "zustand";

// Define the type of your state
interface UserState {
  username: string;
  age: number;
  loggedIn: boolean;
  valid: boolean;
}

// Define the type of your actions (functions that modify state)
interface UserActions {
  login: () => void;
  logout: () => void;
  setUsername: (username: string) => void;
  setAge: (age: number) => void;
  setValid: (valid: boolean) => void;
}

// Create your Zustand store
const useGlobalStore = create<UserState & UserActions>((set) => ({
  username: "",
  age: 0,
  loggedIn: false,
  valid: false,
  login: () => set({ loggedIn: true }),
  logout: () => set({ loggedIn: false }),
  setUsername: (username: string) => set({ username }),
  setAge: (age: number) => set({ age }),
  setValid: (valid: boolean) => set({ valid }),
}));

export default useGlobalStore;
