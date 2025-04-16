// stores/userStore.js
import { defineStore } from 'pinia'

export const useUtilsStore = defineStore('utils', {
  state: () => ({
    urlApi: "http://localhost:8080/salud/api/",
    headers: {
      headers: {
        "Content-Type": "application/json"
      }
    }
  }),
  actions: {
    getUrlApi() {
      return this.urlApi
    },
    getHeaders() {
      return this.headers
    }
  }
})
