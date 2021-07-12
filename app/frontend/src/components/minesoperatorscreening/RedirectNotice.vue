<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" xl="8" offset-xl="2">
        <v-alert outlined class="mt-5">
          <div class="text-h6">Workplace safety attestations are no longer submitted on this website.</div>
          <div>
            For more information about your responsibilities as an industrial camp operator, please see <a href="https://www.worksafebc.com/en/covid-19/bcs-four-step-restart">BC’s Restart: Communicable disease prevention</a>
          </div>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'RedirectNotice',
};
</script>
