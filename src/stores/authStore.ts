import { create } from "zustand";

type Role = "customer" | "event_organizer";

type Account = {
  id: string;
  role: Role;
  token: string;
};

type User = {
  id: string;
  username: string;
  email: string;
  role: Role; // role aktif saat ini
};

interface AuthState {
  user: User | null;
  accounts: Account[];
  activeAccount: Account | null;
  signIn: (user: User, accounts: Account[]) => void;
  switchRole: (role: Role) => void;
  signOut: () => void;
  initUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accounts: [],
  activeAccount: null,

  // Saat login
  signIn: (user, accounts) => {
    const activeAccount = accounts.find((acc) => acc.role === user.role) || null;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accounts", JSON.stringify(accounts));
    localStorage.setItem("activeAccount", JSON.stringify(activeAccount));

    set({ user, accounts, activeAccount });
  },

  // Ganti role
  switchRole: (role) => {
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]") as Account[];
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}") as User;
    const targetAcc = accounts.find((acc) => acc.role === role) || null;

    if (targetAcc) {
      const newUser: User = { ...storedUser, role: targetAcc.role };

      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("activeAccount", JSON.stringify(targetAcc));
      localStorage.setItem("role", targetAcc.role);

      set({
        user: newUser,
        accounts,
        activeAccount: targetAcc,
      });
    }
  },

  // Logout
  signOut: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accounts");
    localStorage.removeItem("activeAccount");
    localStorage.clear();  
    set({ user: null, accounts: [], activeAccount: null });
  },

  // Inisialisasi dari localStorage (dipanggil di _app atau Navbar useEffect)
  initUser: () => {
    const storedUser = localStorage.getItem("user");
    const storedAccounts = localStorage.getItem("accounts");
    const storedActive = localStorage.getItem("activeAccount");

    if (storedUser && storedAccounts) {
      set({
        user: JSON.parse(storedUser),
        accounts: JSON.parse(storedAccounts),
        activeAccount: storedActive ? JSON.parse(storedActive) : null,
      });
    }
  },
}));
