import { defineStore } from 'pinia'
import api from '@/services/api'
import { useUsuarioStore } from './usuarioStore'

export const useMedicoStore = defineStore('medicos', {
  state: () => ({
    /** @type {{ id: String, nombre: String, apellidos: String, email: String, telefono: String, nCol: String, pacientes: Array, atributoTemporal: String}[]} */
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
        let response = await api.get("usuarios/" + usuario.medicoCabecera)
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
