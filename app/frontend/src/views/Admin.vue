<template>
  <div>
    <BCGovNavBar />
    <v-container>
      <BaseSecure>
        <transition name="component-fade" mode="out-in">
          <router-view />
        </transition>
      </BaseSecure>
    </v-container>
  </div>
</template>

<script>
import BCGovNavBar from '@/components/bcgov/BCGovNavBar.vue';

export default {
  name: 'Admin',
  components: {
    BCGovNavBar
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
