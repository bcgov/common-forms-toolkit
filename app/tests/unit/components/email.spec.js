const axios = require('axios');
const config = require('config');
const MockAdapter = require('axios-mock-adapter');

const helper = require('../../common/helper');

const email = require('../../../src/components/email');
const utils = require('../../../src/components/utils');

helper.logHelper();

const mockAxios = new MockAdapter(axios);

const tokenEndpoint = config.get('serviceClient.commonServices.tokenEndpoint');
const username = config.get('serviceClient.commonServices.username');
const password = config.get('serviceClient.commonServices.password');

describe('sendReceipt', () => {
  const utilSpy = jest.spyOn(utils, 'getKeyCloakToken');
  const axiosSpy = jest.spyOn(axios, 'post');

  beforeEach(() => {
    utilSpy.mockClear();
    axiosSpy.mockClear();
  });

  it('should post to the emailMerge endpoint', async () => {
    utils.getKeyCloakToken.mockResolvedValue('token1234');

    const res = [
      {
        messages: [
          {
            msgId: '16b3e0f2-506c-4954-817e-be0969524ea0',
            tag: 'tag',
            to: ['emailhere@someemail.com']
          }
        ],
        txId: '9095c9e5-6f8a-4068-96b8-a6dd7178a3e4'
      }
    ];
    mockAxios.onPost().reply(201, res);

    const result = await email.sendReceipt({});

    expect(result).toBeTruthy();
    expect(result).toEqual(res);

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it.skip('should throw an exception if the response is 200', async () => {
    utils.getKeyCloakToken.mockResolvedValue('token1234');
    mockAxios.onPost().reply(200, { test: 123 });

    await expect(email.sendReceipt({}))
      .rejects
      .toThrow('Error calling email endpoint. Error: Error from POST to CHES. Response Code: 200');

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it.skip('should throw an exception if the response is 403', async () => {
    utils.getKeyCloakToken.mockResolvedValue('token1234');
    mockAxios.onPost().reply(403, { test: 123 });

    await expect(email.sendReceipt({}))
      .rejects
      .toThrow('Error calling email endpoint. Error: Request failed with status code 403');

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it.skip('should throw an exception if the token fetch fails', async () => {
    utils.getKeyCloakToken.mockImplementation(() => {
      throw new Error('TOKENERR');
    });

    await expect(email.sendReceipt({}))
      .rejects
      .toThrow('Error calling email endpoint. Error: TOKENERR');

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(0);
  });
});


describe('sendReceiptRequest', () => {
  const utilSpy = jest.spyOn(utils, 'getKeyCloakToken');
  const axiosSpy = jest.spyOn(axios, 'post');

  const ipcPlanId = '93d4ec6c-af70-42b8-91f8-30ba5ef82693';
  const to = 'emailhere@someemail.com';

  beforeEach(() => {
    utilSpy.mockClear();
    axiosSpy.mockClear();
  });

  it('should post to the email endpoint', async () => {
    utils.getKeyCloakToken.mockResolvedValue('token1234');

    const res = {
      messages: [
        {
          msgId: '16b3e0f2-506c-4954-817e-be0969524ea0',
          to: [to]
        }
      ],
      txId: '9095c9e5-6f8a-4068-96b8-a6dd7178a3e4'
    };
    mockAxios.onPost().reply(201, res);

    const result = await email.sendReceiptRequest(ipcPlanId, to);

    expect(result).toBeTruthy();
    expect(result).toEqual(res);

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception if the response is 200', async () => {
    utils.getKeyCloakToken.mockResolvedValue('token1234');
    mockAxios.onPost().reply(200, { test: 123 });

    await expect(email.sendReceiptRequest(ipcPlanId, to))
      .rejects
      .toThrow('Error calling email endpoint. Error: Error from POST to CHES. Response Code: 200');

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception if the response is 403', async () => {
    utils.getKeyCloakToken.mockResolvedValue('token1234');
    mockAxios.onPost().reply(403, { test: 123 });

    await expect(email.sendReceiptRequest(ipcPlanId, to))
      .rejects
      .toThrow('Error calling email endpoint. Error: Request failed with status code 403');

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception if the token fetch fails', async () => {
    utils.getKeyCloakToken.mockImplementation(() => {
      throw new Error('TOKENERR');
    });

    await expect(email.sendReceiptRequest(ipcPlanId, to))
      .rejects
      .toThrow('Error calling email endpoint. Error: TOKENERR');

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(0);
  });
});
