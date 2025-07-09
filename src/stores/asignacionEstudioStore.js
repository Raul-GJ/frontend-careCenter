import { defineStore } from 'pinia'
import { crearAsignacion, modificarAsignacion, obtenerAsignacion, obtenerAsignacionesPorEspecialista, obtenerAsignacionesPorEstudio } from '@/services/apiAsignaciones'
import { useSesionStore } from './sesionStore'

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
    isLoaded: false
  }),
  actions: {
    async addAsignacionEstudio(asignacion) {
      const index = this.asignacionEstudios.findIndex(e => e.id == asignacion.id)
      if (index === -1) {
        this.asignacionEstudios.push(asignacion)
      } else {
        await this.setAsignacionEstudio(asignacion.id, asignacion)
      }
    },
    async getAsignacionEstudio(id, force = false) {
      let asignacion = this.asignacionEstudios.find(e => e.id == id)
      if (!asignacion || force) {
        try {
          const response = await obtenerAsignacion(id)
          this.addAsignacionEstudio(response.data)
          asignacion = response.data
        } catch (error) {
          console.error('Error obteniendo asignacion:', error)
          throw error
        }
      }
      return asignacion
    },
    async setAsignacionEstudio(id, asignacion) {
      try {
        await modificarAsignacion(id, asignacion)
      } catch (error) {
        console.error('Error modificando asignacion:', error)
        throw error
      }
      const index = this.asignacionEstudios.findIndex(e => e.id == id)
      if (index !== -1) {
        this.asignacionEstudios[index] = { ...this.asignacionEstudios[index], ...asignacion, id }
      }
    },
    deleteAsignacionEstudio(id) {
      this.asignacionEstudios = this.asignacionEstudios.filter(e => e.id != id)
    },
    async loadAsignacionesEspecialista(force = false) {
      if (this.isLoaded && !force) return
      const sesionStore = useSesionStore()
      const usuario = await sesionStore.getUsuario()
      try {
        let response = await obtenerAsignacionesPorEspecialista(usuario.id)
        for (let asignacion of response.data) {
          this.addAsignacionEstudio(asignacion)
        }
      } catch (error) {
        console.error('Error cargando asignaciones: ', error)
        throw error
      }
      this.isLoaded = true
    },
    async loadAsignacionesEstudio(force = false) {
      if (this.asignacionEstudios.length > 0 && !force) return
      const sesionStore = useSesionStore()
      const usuario = await sesionStore.getUsuario()
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
      this.isLoaded = false
    },
    getAsignacionesPorEspecialista(especialistaId) {
      return this.asignacionEstudios.filter(a => a.especialista == especialistaId)
    },
    getAsignacionesPorEstudio(estudioId) {
      return this.asignacionEstudios.filter(a => a.estudio == estudioId)
    },
    async crearAsignacion(asignacion) {
      try {
        console.log("Store - Creando asignación:", asignacion)
        const response = await crearAsignacion(asignacion)
        console.log("Store - Respuesta asignación:", response)
        
        if (!response) {
          console.error("Store - No se recibió respuesta para asignación")
          throw new Error('No se recibió respuesta del servidor')
        }
        
        if (response.status !== 201) {
          console.error("Store - Status incorrecto asignación:", response.status)
          throw new Error(`Error al crear la asignación. Status: ${response.status}`)
        }
        
        console.log("Store - Asignación creada exitosamente")
        return response
      }
      catch (error) {
        console.error('Error creando asignacion:', error)
        console.error('Stack trace:', error.stack)
        throw error
      }
    }
  }
})
