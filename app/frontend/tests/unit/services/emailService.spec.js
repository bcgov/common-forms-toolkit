import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import emailService from '@/services/emailService';
import { ApiRoutes } from '@/utils/constants';

const mockInstance = axios.create();
const mockAxios = new MockAdapter(mockInstance);

jest.mock('@/services/interceptors', () => {
  return {
    appAxios: () => mockInstance
  };
});

describe('requestReceiptEmail', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('calls email endpoint', async () => {
    const data = {
      ipcPlanId: '2262468c-96e2-4880-8959-8aba442e2055',
      to: 'test@example.com'
    };
    mockAxios.onPost(ApiRoutes.EMAIL).reply(201, data);

    const result = await emailService.requestReceiptEmail(data);
    expect(result).toBeTruthy();
    expect(result.data).toEqual(data);
    expect(mockAxios.history.post.length).toBe(1);
  });
});
