import { defineStore } from 'pinia'
import { obtenerAlerta, obtenerAlertasUsuario, modificarAlerta } from '@/services/apiAlertas'
import { useUsuarioStore } from './usuarioStore'

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
  }),
  actions: {
    addAlerta(alerta) {
      const index = this.alertas.findIndex(a => a.id == alerta.id)
      if (index === -1) {
        this.alertas.push(alerta)
      } else {
        this.alertas[index] = { ...this.alertas[index], ...alerta }
      }
    },
    async getAlerta(id) {
      let alerta = this.alertas.find(a => a.id == id)
      if (!alerta) {
        try {
          const response = await obtenerAlerta(id)
          this.addAlerta(response.data)
          alerta = response.data
        } catch (error) {
          console.error('Error obteniendo alerta:', error)
          throw error
        }
      }
      return alerta
    },
    async setAlerta(id, alerta) {
      try {
        await modificarAlerta(id, alerta)
      } catch (error) {
        console.error('Error modificando alerta:', error)
        throw error
      }
      this.addAlerta({ ...alerta, id })
    },
    async leerAlerta(id) {
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
      if (this.alertas.length > 0 && !force) {
        return // Ya están cargadas
      }
      this.clearAlertas()
      const usuarioStore = useUsuarioStore()
      let usuario = await usuarioStore.getUsuario()
      try {
        const response = await obtenerAlertasUsuario(usuario.id)
        for (let alerta of response.data) {
          this.addAlerta(alerta)
        }
      } catch (error) {
        console.error('Error cargando alertas: ', error)
        throw error
      }
    },
    clearAlertas() {
      this.alertas = []
    }
  }
})
