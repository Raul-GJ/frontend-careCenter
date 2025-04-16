// stores/userStore.js
import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    id: "67fea5cce4329c278d16df66",
    tipo: "especialista",
    urlApi: "http://localhost:8080/salud/api/"
  }),
  actions: {
    getId() {
      return this.id
    },
    setId(id) {
      this.id = id
    },
    getTipo() {
      return this.tipo
    },
    setTipo(tipo) {
      this.tipo = tipo
    },
    getUrlApi() {
      return this.urlApi
    }
  }
})
