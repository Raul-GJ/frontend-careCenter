import { defineStore } from 'pinia'

export const especialistaStore = defineStore('especialistas', {
  state: () => ({
    /** @type {{ id: String, nombre: String, apellido1: String, apellido2: String, email: String, telefono: String, nCol: String, pacientes: Array, espceialidad: String, infoEstudios: Array, plantillas: Array, consultas: Array}[]} */
    especialistas: []
  }),
  actions: {
    addEspecialista(e) {
      this.especialistas.push(e)
    },
    getEspecialista(id) {
      return this.especialistas.find(e => e.id == id)
    },
    setEspecialista(id, especialista) {
      let e = this.getEspecialista(id)
      e.nombre = especialista.nombre
      e.apellido1 = especialista.apellido1
      e.apellido2 = especialista.apellido2
      e.email = especialista.email
      e.telefono = especialista.telefono
      e.nCol = especialista.nCol
      e.espceialidad = especialista.espceialidad
      e.infoEstudios = especialista.infoEstudios
      e.plantillas = especialista.plantillas
      e.consultas = especialista.consultas
    },
    deleteEspecialista(id) {
      this.especialistas = this.especialistas.filter(e => e.id != id)
    },
  },
})
