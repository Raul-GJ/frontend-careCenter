import { defineStore } from 'pinia'
import axios from 'axios'
import { useUsuarioStore } from './usuarioStore'

export const usePacienteStore = defineStore('pacientes', {
  state: () => ({
    /** @type {{ id: String, nombre: String, apellido1: String, apellido2: String, email: String, telefono: String, medico: String, alertas: Array, consultas: Array, especialistas: Array, seguimientos: Array}[]} */
    pacientes: [],
    isLoaded: false
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
    },
    async loadPacientes() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let usuario = usuarioStore.getUsuario()
      let urlApi = usuarioStore.getUrlApi()
      console.log(JSON.stringify(usuario))
      try {
        for (let idPaciente of usuario.pacientes) {
          let response = await axios.get(urlApi + "usuarios/pacientes/" + idPaciente)
          console.log(JSON.stringify(response.data))
          this.addPaciente(response.data)
        }
        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando pacientes: ', error)
      }
    },
    clearPacientes() {
      this.pacientes = []
      this.isLoaded = false
    }
  },
})
