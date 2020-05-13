const request = require('supertest');

const helper = require('../../../common/helper');

const email = require('../../../../src/components/email');
const dataService = require('../../../../src/services/dataService');
const transformService = require('../../../../src/services/transformService');
const router = require('../../../../src/routes/v1/ipc');
const validIPCPost = require('../../../fixtures/validIPCPost.json');

// Simple Express Server
const basePath = '/api/v1/ipc';
const app = helper.expressHelper(basePath, router);
helper.logHelper();

describe(`GET ${basePath}`, () => {
  it.skip('should yield an ok response when authenticated', async () => {
    // TODO: Mock/supress keycloak.protect() middleware
    const response = await request(app).get(`${basePath}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
  });

  it('should yield an unauthorized response', async () => {
    const response = await request(app).get(`${basePath}`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeTruthy();
  });
});

describe(`POST ${basePath}`, () => {
  const saveSpy = jest.spyOn(dataService, 'save');
  const sendReceiptSpy = jest.spyOn(email, 'sendReceipt');
  const xformSpy = jest.spyOn(transformService.modelToAPI, 'ipcPlanToPost');
  let body;

  beforeEach(() => {
    saveSpy.mockReset();
    sendReceiptSpy.mockReset();
    xformSpy.mockReset();
    body = JSON.parse(JSON.stringify(validIPCPost));
  });

  it('should yield a created response', async () => {
    saveSpy.mockResolvedValue({});
    sendReceiptSpy.mockResolvedValue({});
    xformSpy.mockReturnValue({ confirmationNumber: '00000000' });
    const response = await request(app).post(`${basePath}`).send(body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toBeTruthy();
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
  
});
