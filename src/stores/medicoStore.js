import { defineStore } from 'pinia'

export const useMedicoStore = defineStore('medicos', {
  state: () => ({
    /** @type {{ id: String, nombre: String, apellido1: String, apellido2: String, email: String, telefono: String, nCol: String, pacientes: Array, atributoTemporal: String}[]} */
    medicos: []
  }),
  actions: {
    addMedico(m) {
      this.medicos.push(m)
    },
    getMedico(id) {
      return this.medicos.find(m => m.id == id)
    },
    setMedico(id, medico) {
      let m = this.getMedico(id)
      m.nombre = medico.nombre
      m.apellido1 = medico.apellido1
      m.apellido2 = medico.apellido2
      m.email = medico.email
      m.telefono = medico.telefono
      m.nCol = medico.nCol
      m.atributoTemporal = medico.atributoTemporal
    },
    deleteMedico(id) {
      this.medicos = this.medicos.filter(m => m.id != id)
    },
  },
})
