import { defineStore } from 'pinia'
import { crearAlerta, leerAlerta, obtenerAlerta, obtenerAlertasUsuario } from '@/services/apiAlertas'
import { useSesionStore } from './sesionStore'

/**
 * @typedef {Object} Alerta
 * @property {String} id
 * @property {String} asunto
 * @property {String} mensaje
 * @property {Date} fecha
 * @property {boolean} leida
 */

export const useAlertaStore = defineStore('alertas', {
  state: () => ({
    /** @type {Alerta[]} */
    alertas: [],
    isLoaded: false
  }),
  actions: {
    addAlerta(alerta) {
      const index = this.alertas.findIndex(a => a.id == alerta.id)
      if (index === -1) {
        this.alertas.push(alerta) // Para las alertas no existe opción de modificar
      }
    },
    async getAlerta(id, force = false) {
      let alerta = this.alertas.find(a => a.id == id)
      if (!alerta || force) {
        try {
          const response = await obtenerAlerta(id)
          alerta = response.data
          this.addAlerta(alerta)
        } catch (error) {
          console.error('Error obteniendo alerta:', error)
          throw error
        }
      }
      return alerta
    },
    async leerAlerta(id) {
      const response = await leerAlerta(id)
      if (response.status !== 204) {
        throw new Error('Error al marcar alerta como leída')
      }
      let alerta = await this.getAlerta(id)
      if (alerta) {
        alerta.leida = true
        this.addAlerta(alerta)
      }
    },
    deleteAlerta(id) {
      this.alertas = this.alertas.filter(a => a.id != id)
    },
    async loadAlertas(force = false) {
      console.log("Cargando alertas:", this.isLoaded, force)
      
      if (this.isLoaded && !force) {
        return // Ya están cargadas
      }
      this.clearAlertas()
      const sesionStore = useSesionStore()
      let usuario = await sesionStore.getUsuario()
      try {
        const response = await obtenerAlertasUsuario(usuario.id)
        for (let alerta of response.data) {
          this.addAlerta(alerta)
        }
      } catch (error) {
        console.error('Error cargando alertas: ', error)
        throw error
      }
      this.isLoaded = true
    },
    clearAlertas() {
      this.alertas = []
      this.isLoaded = false
    },
    async crearAlerta(alerta) {
      try {
        const response = await crearAlerta(alerta)
        if (response.status !== 201) {
          throw new Error('Error al crear alerta')
        }
        let location = response.headers.get("location")
        let id = location.split("/").at(-1)
        await this.getAlerta(id)
        return id
      }
      catch (error) {
        console.error('Error creando alerta:', error)
        throw error
      }
    }
  }
})
