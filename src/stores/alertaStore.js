import { defineStore } from 'pinia'
import { obtenerAlerta } from '@/services/apiAlertas'
import { useUsuarioStore } from './usuarioStore'

export const useAlertaStore = defineStore('alertas', {
  state: () => ({
    /** @type {{ id: String, asunto: String, mensaje: String, fecha: Date, leida: boolean}[]} */
    alertas: [],
    isLoaded: false
  }),
  actions: {
    addAlerta(a) {
      this.alertas.push(a)
    },
    getAlerta(id) {
      return this.alertas.find(a => a.id == id)
    },
    setAlerta(id, alerta) {
      let a = this.getAlerta(id)
      a.leida = alerta.leida
      a.asunto = alerta.asunto
      a.mensaje = alerta.mensaje
      a.fecha = alerta.fecha
    },
    leerAlerta(id) {
      let a = this.getAlerta(id)
      a.leida = true
    },
    deleteAlerta(id) {
      this.alertas = this.alertas.filter(a => a.id != id)
    },
    async loadAlertas() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let usuario = usuarioStore.getUsuario()
      try {
        for (let idAlerta of usuario.alertas) {
          let response = await obtenerAlerta(idAlerta)
          console.log(JSON.stringify(response.data))
          this.addAlerta(response.data)
        }
        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando alertas: ', error)
      }
    },
    clearAlertas() {
      this.alertas = []
      this.isLoaded = false
    }
  },
})
