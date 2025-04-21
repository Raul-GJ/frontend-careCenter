import { defineStore } from 'pinia'
import axios from 'axios'
import { useUsuarioStore } from './usuarioStore'

export const useEstudioStore = defineStore('estudios', {
  state: () => ({
    /** @type {{ id: String, nombre: String, descripcion: String, fechaAlta: Date, fechaFin: Date, pacientes: Array, seguimientos: Array, alertas: Array, rol: String}[]} */
    estudios: [],
    isLoaded: false
  }),
  actions: {
    addEstudio(e) {
      this.estudios.push(e)
    },
    getEstudio(id) {
      return this.estudios.find(e => e.id == id)
    },
    setEstudio(id, estudio) {
      let e = this.getEstudio(id)
      e.nombre = estudio.nombre
      e.descripcion = estudio.descripcion
      e.fechaFin = estudio.fechaFin
    },
    deleteEstudio(id) {
      this.estudios = this.estudios.filter(e => e.id != id)
    },
    async loadEstudios() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let idUsuario = usuarioStore.getId()
      let urlApi = usuarioStore.getUrlApi()
      try {
        let response = await axios.get(urlApi + "asignaciones/estudios/" + idUsuario)
        console.log(JSON.stringify(response.data))
        for (let asignacion of response.data) {
          console.log(JSON.stringify(asignacion))
          let response2 = await axios.get(urlApi + "estudios/" + asignacion.estudio)
          let newEstudio = response2.data
          newEstudio.rol = asignacion.rol
          this.addEstudio(newEstudio)
        }
        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando estudios: ', error)
      }
    },
    clearEstudios() {
      this.estudios = []
      this.isLoaded = false
    }
  },
})
