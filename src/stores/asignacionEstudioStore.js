import { defineStore } from 'pinia'
import axios from 'axios'
import { useUsuarioStore } from './usuarioStore'

export const useAsignacionEstudioStore = defineStore('asignacionEstudios', {
  state: () => ({
    /** @type {{ id: String, estudio: String, especialista: String, rol: String}[]} */
    asignacionEstudios: [],
    isLoaded: false
  }),
  actions: {
    addAsignacionEstudio(e) {
      this.asignacionEstudios.push(e)
    },
    getAsignacionEstudio(id) {
      return this.asignacionEstudios.find(e => e.id == id)
    },
    setAsignacionEstudio(id, asignacion) {
      let e = this.getAsignacionEstudio(id)
      e.estudio = asignacion.estudio
      e.especialista = asignacion.especialista
      e.rol = asignacion.rol
    },
    deleteAsignacionEstudio(id) {
      this.asignacionEstudios = this.asignacionEstudios.filter(e => e.id != id)
    },
    async loadAsignaciones() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let idUsuario = usuarioStore.getId()
      let urlApi = usuarioStore.getUrlApi()
      try {
        let response = await axios.get(urlApi + "asignaciones/especialista/" + idUsuario)
        console.log(JSON.stringify(response.data))
        for (let asignacion of response.data) {
          this.addAsignacionEstudio(asignacion)
        }
        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando asignaciones: ', error)
      }
    },
    clearAsignaciones() {
      this.asignacionEstudios = []
      this.isLoaded = false
    }
  },
})
