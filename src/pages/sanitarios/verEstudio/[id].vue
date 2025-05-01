<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import { useEstudioStore } from '@/stores/estudioStore'

  const estudioStore = useEstudioStore()

  const route = useRoute()
  const idEstudio = route.params.id

  const estudio = ref(null)

  const nombre = ref('')
  const descripcion = ref('')
  const fechaInicio = ref('')
  const fechaFin = ref('')
  const seguimientos = ref([])
  const alertas = ref([])
  const pacientes = ref([])
  const especialistas = ref([])

  function loadEstudio() {
    estudio.value = estudioStore.getEstudio(idEstudio)
  }

  loadEstudio()
</script>

<template>
  <v-container>
    <v-container>
      <v-text-field
        v-model="estudio.nombre"
        variant="solo"
        disabled
      />
      <v-text-field
        v-model="estudio.descripcion"
        variant="solo"
        disabled
      />
      <v-text-field
        v-model="estudio.fechaInicio"
        variant="solo"
        disabled
      />
      <v-text-field
        v-model="estudio.fechaFin"
        variant="solo"
        disabled
      />
    </v-container>
  </v-container>
</template>


