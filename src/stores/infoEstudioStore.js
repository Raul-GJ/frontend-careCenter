import { defineStore } from 'pinia'

export const infoEstudioStore = defineStore('infoEstudios', {
  state: () => ({
    /** @type {{ id: String, rol: String}[]} */
    infoEstudios: []
  }),
  actions: {
    addInfoEstudio(e) {
      this.infoEstudios.push(e)
    },
    getInfoEstudio(id) {
      return this.infoEstudios.find(e => e.id == id)
    },
    setInfoEstudio(id, rol) {
      let e = this.getInfoEstudio(id)
      e.rol = rol
    },
    deleteInfoEstudio(id) {
      this.infoEstudios = this.infoEstudios.filter(e => e.id != id)
    },
  },
})
