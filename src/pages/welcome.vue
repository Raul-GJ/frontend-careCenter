<script setup>

</script>

<template>
  <v-container>
    <header>
      <v-app-bar>
        <h1>Mi app</h1>
        <v-spacer />
        <router-link to="/auth/login">
          <v-btn>Login</v-btn>
        </router-link>
        <router-link to="/auth/register">
          <v-btn>Registro</v-btn>
        </router-link>
      </v-app-bar>
    </header>
    <main>
      <h2>Bienvenido!</h2>
      <section>
        <article>
          <p>Esta es la página de bienvenida de la aplicación</p>
        </article>
      </section>
    </main>
  </v-container>
</template>