import { defineStore } from 'pinia'
import { crearNota, modificarNota, obtenerNota } from '@/services/apiNotas'
import { useSesionStore } from './sesionStore'

/**
 * @typedef {Object} Nota
 * @property {String} id
 * @property {String} sanitario
 * @property {String} asunto
 * @property {String} contenido
 * @property {Boolean} privado
 */

export const useNotaStore = defineStore('notas', {
  state: () => ({
    /** @type {Nota[]} */
    notas: [],
    isLoaded: false
  }),
  actions: {
    async addNota(nota) {
      const index = this.notas.findIndex(n => n.id == nota.id)
      if (index === -1) {
        this.notas.push(nota)
      } else {
        await this.setNota(nota.id, nota)
      }
    },
    async getNota(id, force = false) {
      let nota = this.notas.find(n => n.id == id)
      if (!nota || force) {
        try {
          let response = await obtenerNota(id)
          this.addNota(response.data)
          nota = response.data
        } catch (error) {
          console.error('Error obteniendo nota:', error)
          throw error
        }
      }
      return nota
    },
    async setNota(id, nota) {
      try {
        await modificarNota(id, nota)
      } catch (error) {
        console.error('Error modificando nota:', error)
        throw error
      }
      const index = this.notas.findIndex(n => n.id == id)
      if (index !== -1) {
        this.notas[index] = { ...this.notas[index], ...nota, id }
      }
    },
    deleteNota(id) {
      this.notas = this.notas.filter(n => n.id != id)
    },
    async loadNotas(force = false) {
      if (this.isLoaded && !force) return
      this.clearNotas()
      const sesionStore = useSesionStore()
      let usuario = await sesionStore.getUsuario()
      try {
        for (let idNota of usuario.notas) {
          let response = await obtenerNota(idNota)
          this.addNota(response.data)
        }
      } catch (error) {
        console.error('Error cargando notas: ', error)
        throw error
      }
      this.isLoaded = true
    },
    clearNotas() {
      this.notas = []
      this.isLoaded = false
    },
    async crearNota(nota) {
      try {
        const response = await crearNota(nota)
        if (response.status !== 201) {
          throw new Error('Error al crear la nota')
        }
        let location = response.headers.get("location")
        let id = location.split("/").at(-1)
        await this.getNota(id)
        return id
      } catch (error) {
        console.error('Error creando nota:', error)
        throw error
      }
    }
  }
})
