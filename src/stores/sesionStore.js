// stores/userStore.js
import { defineStore } from 'pinia'
import { obtenerUsuario } from '@/services/apiUsuarios'
import { logout } from '@/services/apiAuth'

/**
 * @typedef {Object} Usuario
 * @property {String} id
 * @property {String} nombre
 * @property {String} apellidos
 * @property {String} email
 * @property {String} telefono
 * @property {Date} fechaNacimiento
 * @property {String} sexo
 * @property {String} direccion
 * @property {String} dni
 * // Campos adicionales según el tipo de usuario
 */

export const useSesionStore = defineStore('sesion', {
  state: () => ({
    /** @type {Usuario} */
    usuario: null,
    id: ''
  }),
  getters: {
    isLoggedIn: (state) => !!state.usuario,
  },
  actions: {
    getId() {
      return this.id
    },
    setId(id) {
      this.id = id
    },
    async getUsuario(force = false) {
      if (!this.usuario || force) {
        try {
          const response = await obtenerUsuario(this.id)
          this.usuario = response.data
        } catch (error) {
          this.usuario = null
          throw error
        }
      }
      return this.usuario
    },
    async logout() {
      await logout()
      this.usuario = null
      localStorage.removeItem('token')
      localStorage.removeItem('token_expiry')
    }
  },
  persist: true
})
