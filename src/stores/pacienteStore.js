import { defineStore } from 'pinia'

export const usePacienteStore = defineStore('pacientes', {
  state: () => ({
    /** @type {{ id: String, nombre: String, apellido1: String, apellido2: String, email: String, telefono: String, medico: String, alertas: Array, consultas: Array, especialistas: Array, seguimientos: Array}[]} */
    pacientes: []
  }),
  actions: {
    addPaciente(p) {
      this.pacientes.push(p)
    },
    getPaciente(id) {
      return this.pacientes.find(p => p.id == id)
    },
    setPaciente(id, paciente) {
      let p = this.getPaciente(id)
      p.nombre = paciente.nombre
      p.apellido1 = paciente.apellido1
      p.apellido2 = paciente.apellido2
      p.email = paciente.email
      p.telefono = paciente.telefono
    },
    deletePaciente(id) {
      this.pacientes = this.pacientes.filter(p => p.id != id)
    }
  },
})
