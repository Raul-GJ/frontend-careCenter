import { defineStore } from 'pinia'
import { obtenerNota } from '@/services/apiNotas'
import { useUsuarioStore } from './usuarioStore'

export const useNotaStore = defineStore('notas', {
  state: () => ({
    /** @type {{ id: String, sanitario: String, asunto: String, contenido: String, privado: Boolean}[]} */
    notas: [],
    isLoaded: false
  }),
  actions: {
    addNota(n) {
      this.notas.push(n)
    },
    async getNota(id) {
      const nota = this.notas.find(n => n.id == id)
      if (!nota) {
        try {
          let response = await obtenerNota(id)
          this.addNota(response.data)
          return response.data
        } catch (error) {
          console.error('Error obteniendo nota:', error)
          throw error
        }
      }
      return nota
    },
    setNota(id, nota) {
      let n = this.getNota(id)
      n.sanitario = nota.asunto
      n.asunto = nota.asunto
      n.contenido = nota.contenido
      n.privado = nota.privado
    },
    deleteNota(id) {
      this.notas = this.notas.filter(n => n.id != id)
    },
    async loadNotas() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let usuario = await usuarioStore.getUsuario()
      console.log(JSON.stringify(usuario))
      try {
        for (let idNota of usuario.notas) {
          let response = await obtenerNota(idNota)
          console.log(JSON.stringify(response.data))
          this.addNota(response.data)
        }
        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando notas: ', error)
      }
    },
    clearNotas() {
      this.notas = []
      this.isLoaded = false
    }
  },
})
