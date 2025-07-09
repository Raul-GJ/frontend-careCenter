import { defineStore } from 'pinia'
import { agregarPregunta, eliminarPregunta, modificarPlantilla, obtenerPlantilla, crearPlantilla } from '@/services/apiPlantillas'
import { useSesionStore } from './sesionStore'

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
    isLoaded: false
  }),
  actions: {
    async addPlantilla(plantilla) {
      const index = this.plantillas.findIndex(p => p.id == plantilla.id)
      if (index === -1) {
        this.plantillas.push(plantilla)
      } else {
        await this.setPlantilla(plantilla.id, plantilla)
      }
    },
    async getPlantilla(id, force = false) {
      let plantilla = this.plantillas.find(p => p.id == id)
      if (!plantilla || force) {
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
    async setPlantilla(id, plantilla) {
      try {
        await modificarPlantilla(id, plantilla)
      } catch (error) {
        console.error('Error modificando plantilla:', error)
        throw error
      }
      const index = this.plantillas.findIndex(p => p.id == id)
      if (index !== -1) {
        this.plantillas[index] = { ...this.plantillas[index], ...plantilla, id }
      }
    },
    deletePlantilla(id) {
      this.plantillas = this.plantillas.filter(p => p.id != id)
    },
    async loadPlantillas(force = false) {
      if (this.isLoaded && !force) return
      this.clearPlantillas()
      const sesionStore = useSesionStore()
      let usuario = await sesionStore.getUsuario()
      try {
        for (let idPlantilla of usuario.plantillas) {
          let response = await obtenerPlantilla(idPlantilla)
          this.addPlantilla(response.data)
        }
      } catch (error) {
        console.error('Error cargando plantillas: ', error)
        throw error
      }
      this.isLoaded = true
    },
    clearPlantillas() {
      this.plantillas = []
      this.isLoaded = false
    },
    async agregarPregunta(idPlantilla, tipo, pregunta) {
      try {
        console.log('Enviando pregunta:', { idPlantilla, tipo, pregunta })
        let response = await agregarPregunta(idPlantilla, tipo, pregunta)
        console.log('Respuesta recibida:', response)
        
        if (!response) {
          console.error('Response es null o undefined')
          throw new Error('No se recibió respuesta del servidor')
        }
        
        if (response.status !== 201) {
          console.error('Status incorrecto:', response.status)
          throw new Error(`Error al agregar pregunta a plantilla. Status: ${response.status}`)
        }
        
        console.log('Pregunta agregada exitosamente')
        const index = this.plantillas.findIndex(p => p.id == idPlantilla)
        if (index !== -1 && this.plantillas[index].preguntas) {
          this.plantillas[index].preguntas.push(pregunta)
        }
        return response
      }
      catch (error) {
        console.error('Error en agregarPregunta store:', error)
        console.error('Stack trace:', error.stack)
        throw error
      }
    },
    async eliminarPregunta(idPlantilla, preguntaId) {
      try {
        let response = await eliminarPregunta(idPlantilla, preguntaId)
        if (response.status !== 204) {
          throw new Error('Error al eliminar pregunta de plantilla')
        }
      } catch (error) {
        console.error('Error eliminando pregunta de plantilla:', error)
        throw error
      }
      const index = this.plantillas.findIndex(p => p.id == idPlantilla)
      if (index !== -1) {
        this.plantillas[index].preguntas = this.plantillas[index].preguntas.filter(p => p.id != preguntaId)
      }
    },
    async crearPlantilla(plantilla) {
      try {
        const response = await crearPlantilla(plantilla)
        if (response.status !== 201) {
          throw new Error('Error al crear plantilla')
        }
        let location = response.headers.get("location")
        let id = location.split("/").at(-1)
        await this.getPlantilla(id)
        return response
      } catch (error) {
        console.error('Error creando plantilla:', error)
        throw error
      }
    }
  }
})
