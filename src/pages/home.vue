<script setup>
  import { ref } from 'vue'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()

  const usuarioStore = useUsuarioStore()
  const usuario = ref(null)

  async function loadUsuario() {
    loadingStore.start()
    await usuarioStore.loadUsuario()
    usuario.value = usuarioStore.getUsuario()
    loadingStore.stop()
  }

  loadUsuario()
</script>

<template>
  <v-container>
    <main v-if="usuario">
      <h2>Hola {{ usuario.nombre }}</h2>
      <section>
        <article>
          <p>Esta es la página principal de la aplicación</p>
        </article>
      </section>
    </main>
  </v-container>
</template>