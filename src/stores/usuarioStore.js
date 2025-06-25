// stores/userStore.js
import { defineStore } from 'pinia'
import { obtenerUsuario, modificarUsuario } from '@/services/apiUsuarios'

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

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    /** @type {Usuario[]} */
    usuarios: [],
  }),
  actions: {
    addUsuario(usuario) {
      const index = this.usuarios.findIndex(u => u.id == usuario.id)
      if (index === -1) {
        this.usuarios.push(usuario)
      } else {
        // Actualiza el usuario si ya existe
        this.usuarios[index] = { ...this.usuarios[index], ...usuario }
      }
    },
    async getUsuario(id) {
      let usuario = this.usuarios.find(u => u.id == id)
      if (!usuario) {
        try {
          const response = await obtenerUsuario(id)
          this.addUsuario(response.data)
          usuario = response.data
        } catch (error) {
          console.error('Error obteniendo usuario:', error)
          throw error
        }
      }
      return usuario
    },
    async setUsuario(id, usuario) {
      try {
        await modificarUsuario(id, usuario)
      } catch (error) {
        console.error('Error modificando usuario:', error)
        throw error
      }
      this.addUsuario({ ...usuario, id }) // Asegura que el usuario esté actualizado
    },
    deleteUsuario(id) {
      this.usuarios = this.usuarios.filter(u => u.id != id)
    },
    clearUsuarios() {
      this.usuarios = []
    }
  }
})