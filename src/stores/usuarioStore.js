// stores/userStore.js
import { defineStore } from 'pinia'
import { obtenerUsuario, modificarUsuario, agregarSeguimientosPaciente, agregarPlantillasEspecialista } from '@/services/apiUsuarios'

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
    async addUsuario(usuario) {
      const index = this.usuarios.findIndex(u => u.id == usuario.id)
      if (index === -1) {
        this.usuarios.push(usuario)
      } else {
        // Actualiza el usuario si ya existe
        await this.setUsuario(usuario.id, usuario)
      }
    },
    async getUsuario(id, force = false) {
      let usuario = this.usuarios.find(u => u.id == id)
      if (!usuario || force) {
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
      const index = this.usuarios.findIndex(s => s.id == id)
      if (index !== -1) {
        this.usuarios[index] = { ...this.usuarios[index], ...usuario, id }
      }
    },
    deleteUsuario(id) {
      this.usuarios = this.usuarios.filter(u => u.id != id)
    },
    clearUsuarios() {
      this.usuarios = []
    },
    async agregarSeguimientosPaciente(pacienteId, seguimientos) {
      try {
        const response = await agregarSeguimientosPaciente(pacienteId, seguimientos)
        for (let seguimiento of response.data) {
          this.addSeguimiento(seguimiento)
        }
      } catch (error) {
        console.error('Error agregando seguimientos al paciente:', error)
        throw error
      }
    },
    async agregarPlantillasEspecialista(especialistaId, plantillas) {
      try {
        const response = await agregarPlantillasEspecialista(especialistaId, plantillas)
        if (response.status !== 204) {
          throw new Error('Error al agregar plantillas al especialista')
        }
        for (let plantilla of plantillas) {
          this.addPlantilla(plantilla)
        }
      } catch (error) {
        console.error('Error agregando plantillas al especialista:', error)
        throw error
      }
    },
  }
})