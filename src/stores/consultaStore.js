import { defineStore } from 'pinia'
import { obtenerConsultasUsuario } from '@/services/apiConsultas'
import { useUsuarioStore } from './usuarioStore'
import { obtenerUsuario } from '@/services/apiUsuarios'

export const useConsultaStore = defineStore('consultas', {
  state: () => ({
    /** @type {{ id: String, emisor: Object, receptor: Object, asunto: String, mensaje: String, fecha: Date, respuesta: Object}[]} */
    consultas: [],
    isLoaded: false
  }),
  actions: {
    addConsulta(c) {
      this.consultas.push(c)
    },
    async getConsulta(id) {
      const consulta = this.consultas.find(c => c.id == id)
      if (!consulta) {
        try {
          // No hay un endpoint individual para una consulta, así que devuelve undefined
          return undefined
        } catch (error) {
          console.error('Error obteniendo consulta:', error)
          throw error
        }
      }
      return consulta
    },
    responderConsulta(id, consulta) {
      let c = this.getConsulta(id)
      c.respuesta = consulta.respuesta
      c.fechaRespuesta = consulta.fechaRespuesta
    },
    deleteConsulta(id) {
      this.consultas = this.consultas.filter(c => c.id != id)
    },
    async loadConsultas() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let usuario = usuarioStore.getUsuario()
      let idUsuario = usuario.id
      try {
        let response = await obtenerConsultasUsuario(idUsuario)
        console.log(JSON.stringify(response.data))
        for (let consulta of response.data) {
          let consulta2 = consulta
          consulta2.emisor = usuario
          if (consulta.receptor) {
            let response2 = await obtenerUsuario(consulta.receptor)
            consulta2.receptor = response2.data
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
    }
  },
})
