import { defineStore } from 'pinia'
import { obtenerNota } from '@/services/apiNotas'
import { useUsuarioStore } from './usuarioStore'

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
  }),
  actions: {
    addNota(nota) {
      const index = this.notas.findIndex(n => n.id == nota.id)
      if (index === -1) {
        this.notas.push(nota)
      } else {
        this.notas[index] = { ...this.notas[index], ...nota }
      }
    },
    async getNota(id) {
      let nota = this.notas.find(n => n.id == id)
      if (!nota) {
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
    setNota(id, nota) {
      const index = this.notas.findIndex(n => n.id == id)
      if (index !== -1) {
        this.notas[index] = { ...this.notas[index], ...nota, id }
      }
    },
    deleteNota(id) {
      this.notas = this.notas.filter(n => n.id != id)
    },
    async loadNotas(force = false) {
      if (this.notas.length > 0 && !force) return
      this.clearNotas()
      const usuarioStore = useUsuarioStore()
      let usuario = await usuarioStore.getUsuario()
      try {
        for (let idNota of usuario.notas) {
          let response = await obtenerNota(idNota)
          this.addNota(response.data)
        }
      } catch (error) {
        console.error('Error cargando notas: ', error)
        throw error
      }
    },
    clearNotas() {
      this.notas = []
    }
  }
})
