import { defineStore } from 'pinia'
import axios from 'axios'
import { useUsuarioStore } from './usuarioStore'

export const useSeguimientoStore = defineStore('seguimientos', {
  state: () => ({
    /** @type {{ id: String, fecha: Date, plazo: Date, formulario: Object}[]} */
    seguimientos: [],
    isLoaded: false
  }),
  actions: {
    addSeguimiento(s) {
      this.seguimientos.push(s)
    },
    getSeguimiento(id) {
      return this.seguimientos.find(s => s.id == id)
    },
    setSeguimiento(id, seguimiento) {
      let s = this.getSeguimiento(id)
      s.fecha = seguimiento.fecha
      s.plazo = seguimiento.plazo
      s.formulario = seguimiento.formulario
    },
    deleteSeguimiento(id) {
      this.seguimientos = this.seguimientos.filter(s => s.id != id)
    },
  },
  async loadSeguimientos() {
    if (this.isLoaded)
      return
    const usuarioStore = useUsuarioStore()
    let usuario = usuarioStore.getUsuario()
    let urlApi = usuarioStore.getUrlApi()
    try {
      for (let idSeguimiento of usuario.seguimientos) {
        let response = await axios.get(urlApi + "seguimientos/" + idSeguimiento)
        console.log(JSON.stringify(response.data))
        this.addSeguimiento(response.data)
      }
      this.isLoaded = true
    } catch (error) {
      console.error('Error cargando seguimientos: ', error)
    }
  },
  clearSeguimientos() {
    this.seguimientos = []
    this.isLoaded = false
  }
})
