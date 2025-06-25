import { defineStore } from 'pinia'
import { obtenerPlantilla } from '@/services/apiPlantillas'
import { useUsuarioStore } from './usuarioStore'

/**
 * @typedef {Object} Plantilla
 * @property {String} id
 * @property {String} nombre
 * @property {String} descripcion
 * @property {Boolean} publico
 * @property {Array} preguntas
 */

export const usePlantillaStore = defineStore('plantillas', {
  state: () => ({
    /** @type {Plantilla[]} */
    plantillas: [],
  }),
  actions: {
    addPlantilla(plantilla) {
      const index = this.plantillas.findIndex(p => p.id == plantilla.id)
      if (index === -1) {
        this.plantillas.push(plantilla)
      } else {
        this.plantillas[index] = { ...this.plantillas[index], ...plantilla }
      }
    },
    async getPlantilla(id) {
      let plantilla = this.plantillas.find(p => p.id == id)
      if (!plantilla) {
        try {
          let response = await obtenerPlantilla(id)
          this.addPlantilla(response.data)
          plantilla = response.data
        } catch (error) {
          console.error('Error obteniendo plantilla:', error)
          throw error
        }
      }
      return plantilla
    },
    setPlantilla(id, plantilla) {
      const index = this.plantillas.findIndex(p => p.id == id)
      if (index !== -1) {
        this.plantillas[index] = { ...this.plantillas[index], ...plantilla, id }
      }
    },
    deletePlantilla(id) {
      this.plantillas = this.plantillas.filter(p => p.id != id)
    },
    async loadPlantillas(force = false) {
      if (this.plantillas.length > 0 && !force) return
      this.clearPlantillas()
      const usuarioStore = useUsuarioStore()
      let usuario = await usuarioStore.getUsuario()
      try {
        for (let idPlantilla of usuario.plantillas) {
          let response = await obtenerPlantilla(idPlantilla)
          this.addPlantilla(response.data)
        }
      } catch (error) {
        console.error('Error cargando plantillas: ', error)
        throw error
      }
    },
    clearPlantillas() {
      this.plantillas = []
    }
  }
})
