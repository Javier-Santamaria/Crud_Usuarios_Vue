import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users')) || [],
    loading: false
  }),
  actions: {
    async fetchUsers() {
      if (this.users.length > 0) return;
      
      this.loading = true;
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        this.users = data;
        this.save();
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },
    addUser(user) {
      const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
      this.users.push({ ...user, id: newId });
      this.save();
    },
    updateUser(updatedUser) {
      const index = this.users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
        this.save();
      }
    },
    deleteUser(id) {
      this.users = this.users.filter(u => u.id !== id);
      this.save();
    },
    save() {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }
});