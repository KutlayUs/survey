import { User } from '../types';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const authService = {
  register(email: string, password: string) {
    const users = loadUsers();
    if (users.some(u => u.email === email)) {
      throw new Error('User already exists');
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      password,
    };
    users.push(newUser);
    saveUsers(users);
  },

  login(email: string, password: string) {
    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },
};

