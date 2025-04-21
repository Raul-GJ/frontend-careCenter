import { defineStore } from 'pinia'
import axios from 'axios'
import { useUsuarioStore } from './usuarioStore'

export const uesEspecialistaStore = defineStore('especialistas', {
  state: () => ({
    /** @type {{ id: String, nombre: String, apellido1: String, apellido2: String, email: String, telefono: String, nCol: String, pacientes: Array, espceialidad: String, infoEstudios: Array, plantillas: Array, consultas: Array}[]} */
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
    async loadEspecialistas() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let usuario = usuarioStore.getUsuario()
      let urlApi = usuarioStore.getUrlApi()
      try {
        for (let idEspecialista of usuario.especialistas) {
          let response = await axios.get(urlApi + "usuarios/especialistas/" + idEspecialista)
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
