import { defineStore } from 'pinia'

export const useAsignacionEstudioStore = defineStore('asignacionEstudios', {
  state: () => ({
    /** @type {{ id: String, estudio: String, especialista: String, rol: String}[]} */
    asignacionEstudios: []
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
  },
})
