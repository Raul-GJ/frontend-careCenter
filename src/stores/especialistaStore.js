import { defineStore } from 'pinia'
import api from '@/services/api'
import { useUsuarioStore } from './usuarioStore'

export const useEspecialistaStore = defineStore('especialistas', {
  state: () => ({
    /** @type {{ id: String, nombre: String, apellidos: String, email: String, telefono: String, nCol: String, pacientes: Array, espceialidad: String, infoEstudios: Array, plantillas: Array, consultas: Array}[]} */
    especialistas: [],
    isLoaded: false
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
      e.apellidos = especialista.apellidos
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
    async loadEspecialistas() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let usuario = usuarioStore.getUsuario()
      try {
        for (let idEspecialista of usuario.especialistas) {
          let response = await api.get("usuarios/" + idEspecialista)
          console.log(JSON.stringify(response.data))
          this.addEspecialista(response.data)
        }
        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando especialistas: ', error)
      }
    },
    clearEspecialistas() {
      this.especialistas = []
      this.isLoaded = false
    }
  },
})
