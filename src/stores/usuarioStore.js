// stores/userStore.js
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    id: "6806775acd30891a73f1e1c6",
    usuario: null,
  }),
  actions: {
    getId() {
      return this.id
    },
    setId(id) {
      this.id = id
    },
    getUsuario() {
      return this.usuario
    },
    setUsuario(usuario) {
      this.usuario = usuario
    },
    async loadUsuario() {
      let response = await api.get('usuarios/' + this.id)
      if (response.status != 200) {
        console.log("Error al cargar el usuario")
        return
      }
      this.usuario = response.data
    }
  },
  persist: true
})
