import { defineStore } from 'pinia'
import { crearSeguimiento, obtenerSeguimiento, modificarSeguimiento, rellenarFormulario } from '@/services/apiSeguimientos'
import { useSesionStore } from './sesionStore'

/**
 * @typedef {Object} Seguimiento
 * @property {String} id
 * @property {String} fecha
 * @property {String} plazo
 * @property {String} motivo
 * @property {String} plantilla
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
        this.seguimientos[index] = { ...this.seguimientos[index], ...seguimiento }
      }
    },
    async getSeguimiento(id, force = false) {
      let seguimiento = this.seguimientos.find(s => s.id == id)
      if (!seguimiento || force) {
        try {
          const response = await obtenerSeguimiento(id)
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
        const index = this.seguimientos.findIndex(s => s.id == id)
        if (index !== -1) {
          this.seguimientos[index] = { ...this.seguimientos[index], ...seguimiento, id }
        }
      } catch (error) {
        console.error('Error modificando seguimiento:', error)
        throw error
      }
    },
    deleteSeguimiento(id) {
      this.seguimientos = this.seguimientos.filter(s => s.id != id)
    },
    async loadSeguimientos(force = false) {
      if (this.isLoaded && !force) return
      this.clearSeguimientos()
      const sesionStore = useSesionStore()
      try {
        const usuario = await sesionStore.getUsuario()
        if (usuario.seguimientos && usuario.seguimientos.length > 0) {
          for (let idSeguimiento of usuario.seguimientos) {
            const seguimiento = await this.getSeguimiento(idSeguimiento)
            this.addSeguimiento(seguimiento)
          }
        }
      } catch (error) {
        console.error('Error cargando seguimientos:', error)
        throw error
      }
      this.isLoaded = true
    },
    clearSeguimientos() {
      this.seguimientos = []
      this.isLoaded = false
    },
    async crearSeguimiento(nuevoSeguimiento) {
      try {
        console.log("Store - Creando seguimiento:", nuevoSeguimiento)
        const response = await crearSeguimiento(nuevoSeguimiento)
        console.log("Store - Respuesta seguimiento:", response)
        
        if (!response) {
          console.error("Store - No se recibió respuesta para seguimiento")
          throw new Error('No se recibió respuesta del servidor')
        }
        
        if (response.status !== 201) {
          console.error("Store - Status incorrecto seguimiento:", response.status)
          throw new Error(`Error al crear el seguimiento. Status: ${response.status}`)
        }
        
        console.log("Store - Seguimiento creado exitosamente")
        return response
      } catch (error) {
        console.error('Store - Error creando seguimiento:', error)
        console.error('Store - Stack trace:', error.stack)
        throw error
      }
    },
    async rellenarFormulario(idSeguimiento, respuestas) {
      try {
        console.log("Store - Rellenando formulario:", { idSeguimiento, respuestas })
        const response = await rellenarFormulario(idSeguimiento, respuestas)
        console.log("Store - Respuesta rellenar formulario:", response)
        
        if (!response) {
          console.error("Store - No se recibió respuesta para rellenar formulario")
          throw new Error('No se recibió respuesta del servidor')
        }
        
        if (response.status !== 204) {
          console.error("Store - Status incorrecto rellenar formulario:", response.status)
          throw new Error(`Error al rellenar el formulario. Status: ${response.status}`)
        }
        
        // Actualizar el seguimiento en el store
        const index = this.seguimientos.findIndex(s => s.id == idSeguimiento)
        if (index !== -1) {
          // Marcar como rellenado
          this.seguimientos[index] = { 
            ...this.seguimientos[index], 
            formulario: { 
              ...this.seguimientos[index].formulario, 
              respuestas: respuestas.respuestas 
            }
          }
        }
        
        console.log("Store - Formulario rellenado exitosamente")
        return response
      } catch (error) {
        console.error('Error rellenando formulario:', error)
        console.error('Stack trace:', error.stack)
        throw error
      }
    }
  }
})