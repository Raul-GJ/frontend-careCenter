<script setup>
  import { ref } from 'vue'
  import { useSesionStore } from '@/stores/sesionStore'
  import { useRouter } from 'vue-router'
  import { login } from '@/services/apiAuth'
  import { useLoadingStore } from '@/stores/loadingStore'

  const router = useRouter()

  const sesionStore = useSesionStore()
  const loadingStore = useLoadingStore()
  
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
  const errorValue = ref(false)

  async function doLogin() {
    loadingStore.start()
    console.log('Intentando iniciar sesión con:', correo.value, contrasenya.value)
    let response
    try {
      response = await login(correo.value, contrasenya.value)
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      errorValue.value = true
      loadingStore.stop()
      return
    }
    const token = response.data.token
    const id = response.data.id
    const roles = response.data.roles
    if (!token || !id || !roles || roles.length === 0) {
      console.error('Respuesta inesperada del servidor:', response)
      errorValue.value = true
      loadingStore.stop()
      return
    }

    localStorage.setItem('token', token);
    sesionStore.setId(id)
    const usuario = await sesionStore.getUsuario()
    if (usuario == null) {
      console.log('Error al cargar el usuario')
      loadingStore.stop()
      return
    }
    console.log('Usuario cargado:', usuario)
    loadingStore.stop()
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
      <v-alert 
        v-if="errorValue" 
        type="error"
        dismissible
        @click:close="error = false"
      >
        Error al iniciar sesión. Por favor, verifica tus credenciales.
      </v-alert>

      <v-btn @click="doLogin()">
        Login
      </v-btn>
    </v-form>
  </v-container>
</template>