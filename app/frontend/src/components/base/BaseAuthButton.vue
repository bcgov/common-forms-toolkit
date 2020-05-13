<template>
  <div v-if="keycloakReady">
    <v-btn v-if="authenticated" dark outlined @click="logout">
      <span>Logout</span>
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BaseAuthButton',
  computed: {
    ...mapGetters('auth', [
      'authenticated',
      'createLoginUrl',
      'createLogoutUrl',
      'keycloakReady'
    ])
  },
  methods: {
    login() {
      if (this.keycloakReady) {
        window.location.replace(
          this.createLoginUrl({
            idpHint: 'idir',
            redirectUri: location.origin + location.pathname + '/#/admin'
          })
        );
      }
    },
    logout() {
      if (this.keycloakReady) {
        window.location.replace(
          this.createLogoutUrl({
            idpHint: 'idir',
            redirectUri: location.origin + location.pathname
          })
        );
      }
    }
  }
};
</script>
