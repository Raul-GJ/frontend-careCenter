import { defineStore } from 'pinia'

export const useSeguimientoStore = defineStore('seguimientos', {
  state: () => ({
    /** @type {{ id: String, fecha: Date, plazo: Date, formulario: Object}[]} */
    seguimientos: []
  }),
  actions: {
    addSeguimiento(s) {
      this.seguimientos.push(s)
    },
    getSeguimiento(id) {
      return this.seguimientos.find(s => s.id == id)
    },
    setSeguimiento(id, seguimiento) {
      let s = this.getSeguimiento(id)
      s.fecha = seguimiento.fecha
      s.plazo = seguimiento.plazo
      s.formulario = seguimiento.formulario
    },
    deleteSeguimiento(id) {
      this.seguimientos = this.seguimientos.filter(s => s.id != id)
    },
  },
})
