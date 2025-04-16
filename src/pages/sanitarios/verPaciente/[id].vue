<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const pacienteId = route.params.id
</script>

<template>
  <div>
    <h1>Paciente: {{ pacienteId }}</h1>
  </div>
</template>


