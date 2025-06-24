// stores/userStore.js
import { defineStore } from 'pinia'
import { obtenerUsuario } from '@/services/apiUsuarios'
import { logout } from '@/services/apiAuth'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    id: null,
    tipo: null, // 'paciente', 'sanitario', 'especialista', 'administrador'
    usuario: null,
  }),
  actions: {
    getId() {
      return this.id
    },
    setId(id) {
      this.id = id
    },
    getTipo() {
      return this.tipo
    },
    setTipo(tipo) {
      this.tipo = tipo
    },
    async getUsuario() {
      console.log(`Cargando usuario con ID: ${this.id} y tipo: ${this.tipo}`)
      if (!this.usuario) {
        await this.loadUsuario()
      }
      return this.usuario
    },
    setUsuario(usuario) {
      this.usuario = usuario
    },
    async loadUsuario() {
      if (!this.id || !this.tipo) {
        console.warn("ID o tipo de usuario no definidos, no se puede cargar el usuario")
        return
      }
      let response = await obtenerUsuario(this.id, this.tipo)
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
