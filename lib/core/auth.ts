import { bp_hooks } from './hooks';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'agent';
}

class AuthManager {
  private currentUser: User | null = null;

  async login(email: string) {
    // Simulated login logic
    const user: User = {
      id: Math.random().toString(36).substring(7),
      email,
      role: email.includes('admin') ? 'admin' : 'editor',
    };
    this.currentUser = user;
    // Brainpress 2.0: doAction expects [args] array
    await bp_hooks.doAction('user_logged_in', [user]);
    return user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async checkPermission(action: string) {
    if (!this.currentUser) return false;
    // Brainpress 2.0: applyFilters expects [args] array
    return await bp_hooks.applyFilters('check_user_permission', this.currentUser.role === 'admin', [{ action, user: this.currentUser }]);
  }
}

export const bp_auth = new AuthManager();
