import { defineStore } from 'pinia'
import { obtenerAsignacion, obtenerAsignacionesPorEspecialista, obtenerAsignacionesPorEstudio } from '@/services/apiAsignaciones'
import { useUsuarioStore } from './usuarioStore'

/**
 * @typedef {Object} AsignacionEstudio
 * @property {String} id
 * @property {String} estudio
 * @property {String} especialista
 * @property {String} rol
 */

export const useAsignacionEstudioStore = defineStore('asignacionEstudios', {
  state: () => ({
    /** @type {AsignacionEstudio[]} */
    asignacionEstudios: [],
  }),
  actions: {
    addAsignacionEstudio(asignacion) {
      const index = this.asignacionEstudios.findIndex(e => e.id == asignacion.id)
      if (index === -1) {
        this.asignacionEstudios.push(asignacion)
      } else {
        this.asignacionEstudios[index] = { ...this.asignacionEstudios[index], ...asignacion }
      }
    },
    async getAsignacionEstudio(id) {
      let asignacion = this.asignacionEstudios.find(e => e.id == id)
      if (!asignacion) {
        try {
          const response = await obtenerAsignacion(id)
          this.addAsignacion(response.data)
          asignacion = response.data
        } catch (error) {
          console.error('Error obteniendo asignacion:', error)
          throw error
        }
      }
      return asignacion
    },
    setAsignacionEstudio(id, asignacion) {
      const index = this.asignacionEstudios.findIndex(e => e.id == id)
      if (index !== -1) {
        this.asignacionEstudios[index] = { ...this.asignacionEstudios[index], ...asignacion, id }
      }
    },
    deleteAsignacionEstudio(id) {
      this.asignacionEstudios = this.asignacionEstudios.filter(e => e.id != id)
    },
    async loadAsignacionesEspecialista(force = false) {
      if (this.asignacionEstudios.length > 0 && !force) return
      const usuarioStore = useUsuarioStore()
      const usuario = await usuarioStore.getUsuario()
      try {
        let response = await obtenerAsignacionesPorEspecialista(usuario.id)
        for (let asignacion of response.data) {
          this.addAsignacionEstudio(asignacion)
        }
      } catch (error) {
        console.error('Error cargando asignaciones: ', error)
        throw error
      }
    },
    async loadAsignacionesEstudio(force = false) {
      if (this.asignacionEstudios.length > 0 && !force) return
      const usuarioStore = useUsuarioStore()
      const usuario = await usuarioStore.getUsuario()
      try {
        let response = await obtenerAsignacionesPorEstudio(usuario.id)
        for (let asignacion of response.data) {
          this.addAsignacionEstudio(asignacion)
        }
      } catch (error) {
        console.error('Error cargando asignaciones: ', error)
        throw error
      }
    },
    clearAsignaciones() {
      this.asignacionEstudios = []
    },
    getAsignacionesPorEspecialista(especialistaId) {
      return this.asignacionEstudios.filter(a => a.especialista == especialistaId)
    },
    getAsignacionesPorEstudio(estudioId) {
      return this.asignacionEstudios.filter(a => a.estudio == estudioId)
    }
  }
})
