import { defineStore } from 'pinia'
import { crearSeguimiento, modificarSeguimiento, obtenerSeguimiento, rellenarFormulario } from '@/services/apiSeguimientos'
import { useSesionStore } from './sesionStore'

/**
 * @typedef {Object} Seguimiento
 * @property {String} id
 * @property {Date} fecha
 * @property {Date} plazo
 * @property {Object} formulario
 */

export const useSeguimientoStore = defineStore('seguimientos', {
  state: () => ({
    /** @type {Seguimiento[]} */
    seguimientos: [],
    isLoaded: false
  }),
  actions: {
    async addSeguimiento(seguimiento) {
      const index = this.seguimientos.findIndex(s => s.id == seguimiento.id)
      if (index === -1) {
        this.seguimientos.push(seguimiento)
      } else {
        await this.setSeguimiento(seguimiento.id, seguimiento)
      }
    },
    async getSeguimiento(id, force = false) {
      let seguimiento = this.seguimientos.find(s => s.id == id)
      if (!seguimiento || force) {
        try {
          let response = await obtenerSeguimiento(id)
          this.addSeguimiento(response.data)
          seguimiento = response.data
        } catch (error) {
          console.error('Error obteniendo seguimiento:', error)
          throw error
        }
      }
      return seguimiento
    },
    async setSeguimiento(id, seguimiento) {
      try {
        await modificarSeguimiento(id, seguimiento)
      } catch (error) {
        console.error('Error modificando seguimiento:', error)
        throw error
      }
      const index = this.seguimientos.findIndex(s => s.id == id)
      if (index !== -1) {
        this.seguimientos[index] = { ...this.seguimientos[index], ...seguimiento, id }
      }
    },
    deleteSeguimiento(id) {
      this.seguimientos = this.seguimientos.filter(s => s.id != id)
    },
    async loadSeguimientos(force = false) {
      if (this.isLoaded && !force) return
      this.clearSeguimientos()
      const sesionStore = useSesionStore()
      let usuario = await sesionStore.getUsuario()
      try {
        console.log(usuario.seguimientos)
        for (let idSeguimiento of usuario.seguimientos) {
          let response = await obtenerSeguimiento(idSeguimiento)
          this.addSeguimiento(response.data)
        }
      } catch (error) {
        console.error('Error cargando seguimientos: ', error)
        throw error
      }
      this.isLoaded = true
    },
    clearSeguimientos() {
      this.seguimientos = []
      this.isLoaded = false
    },
    async rellenarFormulario(idSeguimiento, datos) {
      try {
        const response = await rellenarFormulario(idSeguimiento, datos)
        if (response.status !== 204) {
          throw new Error('Error al rellenar el formulario')
        }
        const seguimiento = this.seguimientos.find(s => s.id == idSeguimiento)
        console.log('Rellenando formulario:', seguimiento)
        seguimiento.formulario.respuestas = datos
        seguimiento.formulario.rellenado = true
        console.log('Formulario rellenado:', seguimiento.formulario)
      } catch (error) {
        console.error('Error rellenando formulario:', error)
        throw error
      }
    },
    async crearSeguimiento(seguimiento) {
      try {
        const response = await crearSeguimiento(seguimiento)
        if (response.status !== 201) {
          throw new Error('Error al crear seguimiento')
        }
        let location = response.headers.get("location")
        let id = location.split("/").at(-1)
        await this.getSeguimiento(id)
        return id
      } catch (error) {
        console.error('Error creando seguimiento:', error)
        throw error
      }
    }
  }
})
