import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import router from '@/router';
import Dashboard from '@/views/admin/Dashboard.vue';

const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);

describe('Dashboard.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(Dashboard, {
      localVue,
      stubs: ['BaseSecure']
    });

    expect(wrapper.html()).toMatch('');
  });
});
