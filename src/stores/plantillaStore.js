import { defineStore } from 'pinia'

export const plantillaStore = defineStore('plantillas', {
  state: () => ({
    /** @type {{ id: String, nombre: String, descripcion: String, publico: Boolean, preguntas: Array}[]} */
    plantillas: []
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
  },
})
