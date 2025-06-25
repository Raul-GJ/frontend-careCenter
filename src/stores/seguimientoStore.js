import { defineStore } from 'pinia'
import { obtenerSeguimiento } from '@/services/apiSeguimientos'
import { useUsuarioStore } from './usuarioStore'

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
  }),
  actions: {
    addSeguimiento(seguimiento) {
      const index = this.seguimientos.findIndex(s => s.id == seguimiento.id)
      if (index === -1) {
        this.seguimientos.push(seguimiento)
      } else {
        this.seguimientos[index] = { ...this.seguimientos[index], ...seguimiento }
      }
    },
    async getSeguimiento(id) {
      let seguimiento = this.seguimientos.find(s => s.id == id)
      if (!seguimiento) {
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
    setSeguimiento(id, seguimiento) {
      const index = this.seguimientos.findIndex(s => s.id == id)
      if (index !== -1) {
        this.seguimientos[index] = { ...this.seguimientos[index], ...seguimiento, id }
      }
    },
    deleteSeguimiento(id) {
      this.seguimientos = this.seguimientos.filter(s => s.id != id)
    },
    async loadSeguimientos(force = false) {
      if (this.seguimientos.length > 0 && !force) return
      this.clearSeguimientos()
      const usuarioStore = useUsuarioStore()
      let usuario = await usuarioStore.getUsuario()
      try {
        for (let idSeguimiento of usuario.seguimientos) {
          let response = await obtenerSeguimiento(idSeguimiento)
          this.addSeguimiento(response.data)
        }
      } catch (error) {
        console.error('Error cargando seguimientos: ', error)
        throw error
      }
    },
    clearSeguimientos() {
      this.seguimientos = []
    }
  }
})
