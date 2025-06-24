import { defineStore } from 'pinia'
import { obtenerAsignacionesPorEspecialista } from '@/services/apiAsignaciones'
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
    async getAsignacionEstudio(id) {
      const asignacion = this.asignacionEstudios.find(e => e.id == id)
      if (!asignacion) {
        try {
          // No hay un endpoint individual, así que devolvemos undefined o podrías lanzar un error
          return undefined
        } catch (error) {
          console.error('Error obteniendo asignación:', error)
          throw error
        }
      }
      return asignacion
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
      let idUsuario = await usuarioStore.getId()
      try {
        let response = await obtenerAsignacionesPorEspecialista(idUsuario)
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
