<script setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useConsultaStore } from '@/stores/consultaStore'
  
  const consultaStore = useConsultaStore()
  const { consultas } = storeToRefs(consultaStore)

  const consultasSinResponder = computed(() => {
    return consultas.value.filter((c) => c.respuesta == null)
  })

  const consultasRespondidas = computed(() => {
    return consultas.value.filter((c) => c.respuesta != null)
  })

  consultaStore.loadConsultas()
</script>

<template>
  <v-container>
    <p>Consultas sin responder</p>
    <v-table height="200" fixed-header>
      <thead>
        <tr>
          <th>
            Id
          </th>
          <th>
            Asunto
          </th>
          <th>
            Fecha
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="consulta in consultasSinResponder" :key="consulta.id" >
          <td>{{ consulta.id }}</td>
          <td>{{ consulta.asunto }}</td>
          <td>{{ consulta.fecha }}</td>
          <td>
            <router-link :to="`./verConsulta/${consulta.id}`">
              <v-btn 
                icon="mdi-folder-open" 
                title="Abrir consulta"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
    <p>Consultas leídas</p>
    <v-table height="200" fixed-header>
      <thead>
        <tr>
          <th>
            Id
          </th>
          <th>
            Asunto
          </th>
          <th>
            Fecha
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="consulta in consultasRespondidas" :key="consulta.id" >
          <td>{{ consulta.id }}</td>
          <td>{{ consulta.asunto }}</td>
          <td>{{ consulta.fecha }}</td>
          <td>
            <router-link :to="`./verConsulta/${consulta.id}`">
              <v-btn 
                icon="mdi-folder-open" 
                title="Abrir consulta"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>