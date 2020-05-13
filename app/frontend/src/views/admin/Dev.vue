<template>
  <v-container class="dev text-center">
    <BaseSecure developer>
      <h1 class="my-6">Dev</h1>
      <ApiTester class="my-8" />
    </BaseSecure>
  </v-container>
</template>

<script>
import ApiTester from '@/components/admin/ApiTester.vue';

export default {
  name: 'Admin',
  components: {
    ApiTester
  }
};
</script>
