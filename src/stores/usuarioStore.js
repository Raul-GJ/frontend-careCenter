// stores/userStore.js
import { defineStore } from 'pinia'
import { obtenerUsuario } from '@/services/apiUsuarios'
import { logout } from '@/services/apiAuth'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    id: null,
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
      let response = await obtenerUsuario(this.id)
      if (response.status != 200) {
        console.log("Error al cargar el usuario")
        return
      }
      this.usuario = response.data
    },
    logout() {
      try {
        logout()
        this.usuario = null
        this.id = null
        localStorage.removeItem('token')
        localStorage.removeItem('token_expiry')
      } catch (error) {
        console.error('Error during logout:', error)
      }
    }
  },
  persist: true
})
