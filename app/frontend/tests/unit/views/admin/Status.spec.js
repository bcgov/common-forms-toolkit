import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import router from '@/router';
import Status from '@/views/admin/Status.vue';

const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);

describe('Status.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(Status, {
      localVue,
      router,
      stubs: ['BaseSecure', 'StatusTable']
    });

    expect(wrapper.text()).toMatch('Submission Status History');
  });
});
