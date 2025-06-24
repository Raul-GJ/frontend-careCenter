import { defineStore } from 'pinia'
import { obtenerAlerta } from '@/services/apiAlertas'
import { obtenerAlertasUsuario } from '@/services/apiAlertas'
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
    async getAlerta(id) {
      const alerta = this.alertas.find(a => a.id == id)
      if (!alerta) {
        try {
          let response = await obtenerAlerta(id)
          this.addAlerta(response.data)
          return response.data
        } catch (error) {
          console.error('Error obteniendo alerta:', error)
          throw error
        }
      }
      return alerta
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
      let usuario = await usuarioStore.getUsuario()
      try {
        const response = await obtenerAlertasUsuario(usuario.id)
        for (let alerta of response.data) {
          this.addAlerta(alerta)
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
