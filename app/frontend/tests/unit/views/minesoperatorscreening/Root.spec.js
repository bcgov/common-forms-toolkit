import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import Root from '@/views/minesoperatorscreening/Root.vue';

const localVue = createLocalVue();
localVue.use(Vuetify);

describe('Root.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(Root, { localVue, stubs: ['RedirectNotice']});

    expect(wrapper.html()).toContain('redirectnotice-stub');
  });
});
