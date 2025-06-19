<script setup>
  import { ref } from 'vue'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useRouter } from 'vue-router'
  import { login } from '@/services/apiAuth'

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
  const mostrarContrasenya = ref(false)

  async function doLogin() {
    console.log('Intentando iniciar sesión con:', correo.value, contrasenya.value)
    let response = await login(correo.value, contrasenya.value)
    let token = response.data.token
    let id = response.data.id
    localStorage.setItem('token', token);
    usuarioStore.setId(id)
    usuarioStore.loadUsuario()
    if (usuarioStore.getUsuario() == null) {
      console.log('Error al cargar el usuario')
      return
    }
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

      <v-btn @click="doLogin()">
        Login
      </v-btn>
    </v-form>
  </v-container>
</template>