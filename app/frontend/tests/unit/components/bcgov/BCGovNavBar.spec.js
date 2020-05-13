import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import router from '@/router';
import BCGovNavBar from '@/components/bcgov/BCGovNavBar.vue';

const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);
localVue.use(Vuex);

describe('BCGovNavBar.vue', () => {
  let store;
  let hasRole;

  beforeEach(() => {
    store = new Vuex.Store();
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        hasSilvipcRoles: () => () => hasRole
      }
    });
  });

  it('renders without a dev button', () => {
    hasRole = false;

    const wrapper = shallowMount(BCGovNavBar, {
      localVue,
      store,
      stubs: ['router-link', 'router-view']
    });

    expect(wrapper.text()).toContain('Submissions');
    expect(wrapper.text()).toContain('Dashboard');
  });

  it('renders with a dev button', () => {
    hasRole = true;

    const wrapper = shallowMount(BCGovNavBar, {
      localVue,
      store,
      stubs: ['router-link', 'router-view']
    });

    expect(wrapper.text()).toContain('Submissions');
    expect(wrapper.text()).toContain('Dashboard');
    expect(wrapper.text()).toContain('Dev');
  });
});
