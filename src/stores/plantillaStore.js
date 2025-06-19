import { defineStore } from 'pinia'
import { obtenerPlantilla } from '@/services/apiPlantillas'
import { useUsuarioStore } from './usuarioStore'

export const usePlantillaStore = defineStore('plantillas', {
  state: () => ({
    /** @type {{ id: String, nombre: String, descripcion: String, publico: Boolean, preguntas: Array}[]} */
    plantillas: [],
    isLoaded: false
  }),
  actions: {
    addPlantilla(p) {
      this.plantillas.push(p)
    },
    getPlantilla(id) {
      return this.plantillas.find(p => p.id == id)
    },
    setPlantilla(id, plantilla) {
      let p = this.getPlantilla(id)
      p.nombre = plantilla.nombre
      p.descripcion = plantilla.descripcion
      p.publico = plantilla.publico
      p.preguntas = plantilla.preguntas
    },
    deletePlantilla(id) {
      this.plantillas = this.plantillas.filter(p => p.id != id)
    },
    async loadPlantillas() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let usuario = usuarioStore.getUsuario()
      try {
        for (let idPlantilla of usuario.plantillas) {
          let response = await obtenerPlantilla(idPlantilla)
          console.log(JSON.stringify(response.data))
          this.addPlantilla(response.data)
        }
        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando plantillas: ', error)
      }
    },
    clearPlantillas() {
      this.plantillas = []
      this.isLoaded = false
    }
  },
})
