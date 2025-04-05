<script setup>
  import { computed, ref } from 'vue'

  const alertas = ref([
    {id: '1', asunto: 'Alerta 1', mensaje: 'bla bla bla 1', fecha: '25/03/2025', repetitiva: true},
    {id: '2', asunto: 'Alerta 2', mensaje: 'bla bla bla 2', fecha: '28/01/2025', repetitiva: true},  
    {id: '3', asunto: 'Alerta 3', mensaje: 'bla bla bla 3', fecha: '01/04/2025', repetitiva: false},
    {id: '4', asunto: 'Alerta 4', mensaje: 'bla bla bla 4', fecha: '02/01/2025', repetitiva: false},
  ])

  const alertasFuturas = computed(() => {
    return alertas.value.filter((c) => crearFecha(c.fecha).getTime() >= new Date().getTime())
  })

  const alertasPasadas = computed(() => {
    return alertas.value.filter((c) => crearFecha(c.fecha).getTime() < new Date().getTime())
  })

  function crearFecha(fechaString) {
    let partes = fechaString.split("/");
    return new Date(Date.UTC(+partes[2], partes[1] - 1, +partes[0]));
  }

  function leerAlerta(alerta) {
    alert(alerta.mensaje)
  }
</script>

<template>
  <v-container>
    <p>Próximas alertas</p>
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
        <tr v-for="alerta in alertasFuturas" :key="alerta.id" >
          <td>{{ alerta.id }}</td>
          <td>{{ alerta.asunto }}</td>
          <td>{{ alerta.fecha }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver alerta" @click="leerAlerta(alerta)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
    <p>Alertas pasadas</p>
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
        <tr v-for="alerta in alertasPasadas" :key="alerta.id" >
          <td>{{ alerta.id }}</td>
          <td>{{ alerta.asunto }}</td>
          <td>{{ alerta.fecha }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver alerta" @click="leerAlerta(alerta)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>