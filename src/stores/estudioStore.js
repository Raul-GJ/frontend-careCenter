import { defineStore } from 'pinia'

export const estudioStore = defineStore('estudios', {
  state: () => ({
    /** @type {{ id: String, nombre: String, descripcion: String, fechaAlta: Date, fechaFin: Date, pacientes: Array, seguimientos: Array, alertas: Array, rol: String}[]} */
    estudios: []
  }),
  actions: {
    addEstudio(e) {
      this.estudios.push(e)
    },
    getEstudio(id) {
      return this.estudios.find(e => e.id == id)
    },
    setEstudio(id, estudio) {
      let e = this.getEstudio(id)
      e.nombre = estudio.nombre
      e.descripcion = estudio.descripcion
      e.fechaFin = estudio.fechaFin
    },
    deleteEstudio(id) {
      this.estudios = this.estudios.filter(e => e.id != id)
    },
  },
})
