import { defineStore } from 'pinia'
import { obtenerSeguimiento } from '@/services/apiSeguimientos'
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
    async getSeguimiento(id) {
      let seguimiento = this.seguimientos.find(s => s.id == id)
      if (!seguimiento) {
        try {
          let response = await obtenerSeguimiento(id)
          this.addSeguimiento(response.data)
          return response.data
        } catch (error) {
          console.error('Error obteniendo seguimiento:', error)
          throw error
        }
      }
      return seguimiento
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
    async loadSeguimientos() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let usuario = await usuarioStore.getUsuario()
      try {
        for (let idSeguimiento of usuario.seguimientos) {
          let response = await obtenerSeguimiento(idSeguimiento)
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
  },
  
})
