<template>
  <v-container>
    <BaseSecure inspector>
      <h1>Submission Status History</h1>

      <StatusTable :ipcPlanId="ipcPlanId" class="my-4" />
    </BaseSecure>
  </v-container>
</template>

<script>
import StatusTable from '@/components/admin/StatusTable.vue';

export default {
  name: 'Status',
  props:{
    ipcPlanId: {
      required: true,
      type: String
    }
  },
  components: {
    StatusTable
  }
};
</script>
