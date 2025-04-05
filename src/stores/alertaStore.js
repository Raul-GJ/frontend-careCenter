import { defineStore } from 'pinia'

export const alertaStore = defineStore('alertas', {
  state: () => ({
    /** @type {{ id: String, asunto: String, mensaje: String, fecha: Date}[]} */
    alertas: []
  }),
  actions: {
    addAlerta(a) {
      this.alertas.push(a)
    },
    getAlerta(id) {
      return this.alertas.find(a => a.id == id)
    },
    setAlerta(id, alerta) {
      let a = this.getAlerta(id)
      a.nombre = alerta.nombre
      a.apellido1 = alerta.apellido1
      a.apellido2 = alerta.apellido2
      a.email = alerta.email
      a.telefono = alerta.telefono
    },
    deleteAlerta(id) {
      this.alertas = this.alertas.filter(a => a.id != id)
    },
  },
})
