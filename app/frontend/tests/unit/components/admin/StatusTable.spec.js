import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import router from '@/router';
import StatusTable from '@/components/admin/StatusTable.vue';

const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);

describe('StatusTable.vue', () => {
  it.skip('renders', () => {
    const wrapper = shallowMount(StatusTable, { localVue, router });

    expect(wrapper.text()).toMatch('');
  });
});
