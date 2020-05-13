import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import router from '@/router';
import Dev from '@/views/admin/Dev.vue';

const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);

describe('Dev.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(Dev, {
      localVue,
      stubs: ['ApiTester', 'BaseSecure']
    });

    expect(wrapper.html()).toMatch('apitester');
  });
});
