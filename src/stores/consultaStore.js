import { defineStore } from 'pinia'

export const consultaStore = defineStore('consultas', {
  state: () => ({
    /** @type {{ id: String, emisor: String, receptor: String, asunto: String, mensaje: String, fecha: Date, respuesta: String, fechaRespuesta: Date}[]} */
    consultas: []
  }),
  actions: {
    addConsulta(c) {
      this.consultas.push(c)
    },
    getConsulta(id) {
      return this.consultas.find(c => c.id == id)
    },
    responderConsulta(id, consulta) {
      let c = this.getConsulta(id)
      c.respuesta = consulta.respuesta
      c.fechaRespuesta = consulta.fechaRespuesta
    },
    deleteConsulta(id) {
      this.consultas = this.consultas.filter(c => c.id != id)
    },
  },
})
