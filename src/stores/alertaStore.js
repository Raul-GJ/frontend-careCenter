import { defineStore } from 'pinia'
import axios from 'axios'
import { useUsuarioStore } from './usuarioStore'

export const useAlertaStore = defineStore('alertas', {
  state: () => ({
    /** @type {{ id: String, asunto: String, mensaje: String, fecha: Date}[]} */
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
      a.nombre = alerta.nombre
      a.apellido1 = alerta.apellido1
      a.apellido2 = alerta.apellido2
      a.email = alerta.email
      a.telefono = alerta.telefono
    },
    deleteAlerta(id) {
      this.alertas = this.alertas.filter(a => a.id != id)
    },
    async loadAlertas() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let usuario = usuarioStore.getUsuario()
      let urlApi = usuarioStore.getUrlApi()
      try {
        for (let idAlerta of usuario.alertas) {
          let response = await axios.get(urlApi + "alertas/" + idAlerta)
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
