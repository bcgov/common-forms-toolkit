import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import getRouter from '@/router';
import MyForm from '@/views/MyForm.vue';

const localVue = createLocalVue();
localVue.use(getRouter());
localVue.use(Vuetify);
localVue.use(Vuex);

describe('MyForm.vue', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store();
  });

  it('renders', () => {
    store.registerModule('form', { namespaced: true });

    const wrapper = shallowMount(MyForm, { localVue, store });

    expect(wrapper.html()).toMatch('router-view');
  });
});
