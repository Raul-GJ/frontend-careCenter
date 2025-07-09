<script setup>
  import { useRoute } from 'vue-router'
  import { ref, computed } from 'vue'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useLoadingStore } from '@/stores/loadingStore'

  const route = useRoute()
  const loadingStore = useLoadingStore()
  const usuarioStore = useUsuarioStore()
  const idSanitario = route.params.id
  const sanitario = ref(null)

  // Computed para calcular la edad
  const edadSanitario = computed(() => {
    if (!sanitario.value?.fechaNacimiento) return null
    const fechaNacimiento = new Date(sanitario.value.fechaNacimiento)
    const hoy = new Date()
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    const mes = hoy.getMonth() - fechaNacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--
    }
    return edad
  })

  // Computed para nombre completo
  const nombreCompleto = computed(() => {
    if (!sanitario.value) return ''
    return `${sanitario.value.nombre || ''} ${sanitario.value.apellidos || ''}`.trim()
  })

  async function loadSanitario() {
    loadingStore.start()
    try {
      sanitario.value = await usuarioStore.getUsuario(idSanitario)
    } catch (error) {
       console.error('Error cargando sanitario:', error)
    } finally {
      loadingStore.stop()
    }
  }

  loadSanitario()
</script>

<template>
  <v-container>
    <div v-if="!loadingStore.loading && sanitario">
      <v-row>
        <v-col cols="12">
          <v-avatar
            image="@/assets/avatar-perfil-por-defecto.png"
            size="250"
          />
          <v-container>
            <v-text-field
              v-model="nombreCompleto"
              label="Nombre completo"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="sanitario.centroDeSalud"
              label="Centro de salud"
              variant="solo"
              disabled
            />
            <v-text-field
              v-if="sanitario.tipo === 'ESPECIALISTA'"
              v-model="sanitario.especialidad"
              label="Especialidad"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="sanitario.sexo"
              label="Sexo"
              variant="solo"
              disabled
            />
            <v-text-field
              :model-value="edadSanitario ? `${edadSanitario} años` : ''"
              label="Edad"
              variant="solo"
              disabled
            />
          </v-container>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>