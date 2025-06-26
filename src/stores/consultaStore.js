import { defineStore } from 'pinia'
import { obtenerConsulta, crearConsulta, obtenerConsultasUsuario, responderConsulta } from '@/services/apiConsultas'
import { useSesionStore } from './sesionStore'
import { useUsuarioStore } from './usuarioStore'

/**
 * @typedef {Object} Consulta
 * @property {String} id
 * @property {Object} emisor
 * @property {Object} receptor
 * @property {String} asunto
 * @property {String} mensaje
 * @property {Date} fecha
 * @property {Object} respuesta
 */

export const useConsultaStore = defineStore('consultas', {
  state: () => ({
    /** @type {Consulta[]} */
    consultas: [],
    isLoaded: false
  }),
  actions: {
    addConsulta(consulta) {
      const index = this.consultas.findIndex(c => c.id == consulta.id)
      if (index === -1) {
        this.consultas.push(consulta)
      } else {
        this.consultas[index] = { ...this.consultas[index], ...consulta }
      }
    },
    async getConsulta(id, force = false) {
      let consulta = this.consultas.find(c => c.id == id)
      if (!consulta || force) {
        try {
          let response = await obtenerConsulta(id)
          this.addConsulta(response.data)
          consulta = response.data
        } catch (error) {
          console.error('Error obteniendo consulta:', error)
          throw error
        }
      }
      return consulta
    },
    async responderConsulta(id, respuesta) {
      let response = await responderConsulta(id, respuesta)
      if (response.status !== 204) {
        throw new Error('Error al responder la consulta')
      }
      await this.getConsulta(id, true)
    },
    deleteConsulta(id) {
      this.consultas = this.consultas.filter(c => c.id != id)
    },
    async loadConsultas(force = false) {
      if (this.isLoaded && !force) return
      this.clearConsultas()
      const sesionStore = useSesionStore()
      const usuarioStore = useUsuarioStore()
      let usuario = await sesionStore.getUsuario()
      let idUsuario = usuario.id
      try {
        let response = await obtenerConsultasUsuario(idUsuario)
        for (let consulta of response.data) {
          let consulta2 = { ...consulta }
          consulta2.emisor = usuario
          if (consulta.receptor) {
            try {
              const response2 = await usuarioStore.getUsuario(consulta.receptor)
              consulta2.receptor = response2
            } catch (error) {
              console.error('Error obteniendo receptor de consulta:', consulta.receptor)
              throw error
            }
          }
          this.addConsulta(consulta2)
        }
        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando consultas: ', error)
      }
    },
    clearConsultas() {
      this.consultas = []
      this.isLoaded = false
    },
    async crearConsulta(consulta) {
      try {
        const response = await crearConsulta(consulta)
        if (response.status !== 201) {
          throw new Error('Error al crear la consulta')
        }
        let location = response.headers.get("location")
        let id = location.split("/").at(-1)
        await this.getConsulta(id)
        return id
      } catch (error) {
        console.error('Error creando consulta:', error)
        throw error
      }
    }
  },
})
