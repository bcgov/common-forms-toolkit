<template>
  <v-container>
    <BaseSecure>
      <h1>Submissions</h1>
      <SubmissionsTable />
    </BaseSecure>
  </v-container>
</template>

<script>
import SubmissionsTable from '@/components/admin/SubmissionsTable.vue';

export default {
  name: 'AdminRoot',
  components: {
    SubmissionsTable
  }
};
</script>
