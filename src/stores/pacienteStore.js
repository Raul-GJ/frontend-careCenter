import { defineStore } from 'pinia'
import { obtenerUsuario } from '@/services/apiUsuarios'
import { useUsuarioStore } from './usuarioStore'

export const usePacienteStore = defineStore('pacientes', {
  state: () => ({
    /** @type {{ id: String, nombre: String, apellidos: String, email: String, telefono: String, fechaNacimiento: Date, sexo: String, direccion: String, dni: String, medico: String, especialistas: Array, seguimientos: Array, nss: String, alergias: Array, tratamientos: Array, notas: Array}[]} */
    pacientes: [],
    isLoaded: false
  }),
  actions: {
    addPaciente(p) {
      this.pacientes.push(p)
    },
    async getPaciente(id) {
      const paciente = this.pacientes.find(p => p.id == id)
      if (!paciente) {
        try {
          let response = await obtenerUsuario(id, 'pacientes')
          this.addPaciente(response.data)
          return response.data
        } catch (error) {
          console.error('Error obteniendo paciente:', error)
          throw error
        }
      }
      return paciente
    },
    setPaciente(id, paciente) {
      let p = this.getPaciente(id)
      p.nombre = paciente.nombre
      p.apellidos = paciente.apellidos
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
      let usuario = await usuarioStore.getUsuario()
      console.log(JSON.stringify(usuario))
      try {
        for (let idPaciente of usuario.pacientes) {
          let response = await obtenerUsuario(idPaciente, 'pacientes')
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
