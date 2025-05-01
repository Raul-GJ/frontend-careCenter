<script setup>
  import { ref } from 'vue'
  import api from '@/services/api'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const usuarioStore = useUsuarioStore()
  
  const reglas = ref({
          necesario: value => !!value || 'Campo necesario.',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Correo electrónico incorrecto.'
          },
        })

  const correo = ref('')
  const contrasenya = ref('')

  async function login() {
    let token = localStorage.getItem('token')
    if (token)
      localStorage.removeItem('token')
    let body = { correo: correo.value, contrasenya: contrasenya.value }
    let response = await api.post("auth/login", body)
    if (response.status != 200) {
      alert("Credenciales incorrectas")
      return
    }
    let id = response.data.id
    usuarioStore.setId(id)
    /*
    let response2 = await api.get("usuarios/" + id)
    if (response2.status != 200) {
      console.log("Error al cargar el usuario")
      return
    }
    usuarioStore.setUsuario(response2.data)
    */
    usuarioStore.loadUsuario()
    if (usuarioStore.getUsuario() == null) {
      console.log('Error al cargar el usuario')
      return
    }
    
    localStorage.setItem('token', response.data.token);
    router.push('/home')
  }

</script>

<template>
  <v-container>
    <h1>Página de Login</h1>
    <p>* Indica que un campo es obligatorio</p>
    <v-form 
      @submit.prevent 
    >  
      <v-text-field 
        v-model="correo"  
        label="Correo electrónico *" 
        :rules="[reglas.necesario, reglas.email]"
      />
      <v-text-field
        v-model="contrasenya"
        :append-icon="mostrarContrasenya ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[reglas.necesario]"
        :type="mostrarContrasenya ? 'text' : 'password'"
        label="Contraseña *"
        counter
        @click:append="mostrarContrasenya = !mostrarContrasenya"
      />

      <v-btn @click="login()">
        Login
      </v-btn>
      <!--
      <router-link to="/home">
        <v-btn>Login</v-btn>
      </router-link>
      -->
    </v-form>
  </v-container>
</template>