import { defineStore } from 'pinia';
import { UsersApiService } from "../services/users.service.js";

export const useUserStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    role: null,
    hasCompany: false,
    token: null,
  }),
  actions: {
    login(data) {
      if (!data.user) {
        return;
      }

      this.isAuthenticated = true;
      this.user = data.user;
      this.role = data.user.role;
      this.token = data.token;

      if (data.user.company) {
        this.hasCompany = true;
      }

      localStorage.setItem('auth', JSON.stringify(data));
    },
    updateUser() {
      if (this.user.id === null || !this.user.id) {
        this.logout();
        return;
      }
      const usersApi = new UsersApiService();

      usersApi.getById(this.user.id)
          .then((response) => {
            this.user = response.data;
            this.role = response.data.role;
            this.hasCompany = !!response.data.company;

            // Persist updated user info to localStorage
            localStorage.setItem('auth', JSON.stringify({
              isAuthenticated: this.isAuthenticated,
              user: this.user,
              role: this.role,
              hasCompany: this.hasCompany,
              token: this.token
            }));
          }).catch((error) => {
        console.error(error);
      });
    },
    logout() {
      localStorage.removeItem("auth");
      this.isAuthenticated = false;
      this.user = null;
      this.role = null;
      this.hasCompany = false;
      this.token = null;
    },
  }
});
