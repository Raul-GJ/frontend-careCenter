import { defineStore } from 'pinia'
import { obtenerUsuario } from '@/services/apiUsuarios'
import { useUsuarioStore } from './usuarioStore'

export const useMedicoStore = defineStore('medicos', {
  state: () => ({
    /** @type {{ id: String, nombre: String, apellidos: String, email: String, telefono: String, fechaNacimiento: Date, sexo: String, direccion: String, dni: String, nCol: String, centroDeSalud: String, pacientes: Array}[]} */
    medicos: []
  }),
  actions: {
    addMedico(m) {
      this.medicos.push(m)
    },
    async getMedico(id) {
      const medico = this.medicos.find(m => m.id == id)
      if (!medico) {
        try {
          let response = await obtenerUsuario(id, 'medicos')
          this.addMedico(response.data)
          return response.data
        } catch (error) {
          console.error('Error obteniendo médico:', error)
          throw error
        }
      }
      return medico
    },
    setMedico(id, medico) {
      let m = this.getMedico(id)
      m.nombre = medico.nombre
      m.apellidos = medico.apellidos
      m.email = medico.email
      m.telefono = medico.telefono
      m.nCol = medico.nCol
      m.atributoTemporal = medico.atributoTemporal
    },
    deleteMedico(id) {
      this.medicos = this.medicos.filter(m => m.id != id)
    },
    async loadMedicos() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let usuario = usuarioStore.getUsuario()
      try {
        let response = await obtenerUsuario(usuario.medicoCabecera, 'medicos')
        console.log(JSON.stringify(response.data))
        this.addMedico(response.data)
        
        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando medicos: ', error)
      }
    },
    clearMedicos() {
      this.medicos = []
      this.isLoaded = false
    }
  },
})
