import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import ipcService from '@/services/ipcService';
import { ApiRoutes } from '@/utils/constants';

const mockInstance = axios.create();
const nullUuid = '00000000-0000-0000-0000-000000000000';

jest.mock('@/services/interceptors', () => {
  return {
    appAxios: () => mockInstance
  };
});

describe('ipcService', () => {
  const mockAxios = new MockAdapter(mockInstance);

  beforeEach(() => {
    mockAxios.reset();
  });

  describe('getAllIPCData', () => {
    it('calls the ipc get endpoint', async () => {
      const body = [];
      mockAxios.onGet(ApiRoutes.IPC).reply(200, body);

      const result = await ipcService.getAllIPCData();
      expect(result).toBeTruthy();
      expect(result.data).toEqual(body);
      expect(mockAxios.history.get.length).toBe(1);
    });
  });

  describe('getAllIPCMetaData', () => {
    it('calls the ipc get metadata endpoint', async () => {
      const body = [];
      mockAxios.onGet(ApiRoutes.IPC, { params: { meta: true } }).reply(200, body);

      const result = await ipcService.getAllIPCMetaData();
      expect(result).toBeTruthy();
      expect(result.data).toEqual(body);
      expect(mockAxios.history.get.length).toBe(1);
    });
  });

  describe('sendIPCContent', () => {
    it('calls the ipc post endpoint', async () => {
      const body = {};
      mockAxios.onPost(ApiRoutes.IPC).reply(201, body);

      const result = await ipcService.sendIPCContent({});
      expect(result).toBeTruthy();
      expect(result.data).toEqual(body);
      expect(mockAxios.history.post.length).toBe(1);
    });
  });

  describe('getIPCContent', () => {
    it('calls the ipc get endpoint for an ipcPlanId', async () => {
      const body = {};
      mockAxios.onGet(`${ApiRoutes.IPC}/${nullUuid}`).reply(200, body);

      const result = await ipcService.getIPCContent(nullUuid);
      expect(result).toBeTruthy();
      expect(result.data).toEqual(body);
      expect(mockAxios.history.get.length).toBe(1);
    });
  });

  describe('getIPCInspectionStatuses', () => {
    it('calls the ipc status get endpoint for an ipcPlanId', async () => {
      const body = {};
      mockAxios.onGet(`${ApiRoutes.IPC}/${nullUuid}/status`).reply(200, body);

      const result = await ipcService.getIPCInspectionStatuses(nullUuid);
      expect(result).toBeTruthy();
      expect(result.data).toEqual(body);
      expect(mockAxios.history.get.length).toBe(1);
    });
  });

  describe('sendIPCInspectionStatuses', () => {
    it('calls the ipc status post endpoint for an ipcPlanId', async () => {
      const body = {};
      mockAxios.onPost(`${ApiRoutes.IPC}/${nullUuid}/status`).reply(201, body);

      const result = await ipcService.sendIPCInspectionStatuses(nullUuid, {});
      expect(result).toBeTruthy();
      expect(result.data).toEqual(body);
      expect(mockAxios.history.post.length).toBe(1);
    });
  });
});
