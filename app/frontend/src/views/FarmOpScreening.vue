<template>
  <div>
    <AdminNavBar :formName="formName" />
    <transition name="component-fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import AdminNavBar from '@/components/common/admin/AdminNavBar.vue';
import farmOpScreeningForm from '@/store/modules/farmopscreening/farmOpScreeningForm.js';
import { FormNames } from '@/utils/constants';

export default {
  name: 'FarmOperatorScreening',
  components: {
    AdminNavBar
  },
  beforeDestroy() {
    this.$store.unregisterModule('farmOpScreeningForm');
  },
  computed: {
    formName() {
      return FormNames.FARMOPSCREENING;
    }
  },
  created() {
    if(this.$store.hasModule('farmOpScreeningForm')) {
      this.$store.unregisterModule('farmOpScreeningForm');
    }
    this.$store.registerModule('farmOpScreeningForm', farmOpScreeningForm);
  }
};
</script>

<style scoped>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>
