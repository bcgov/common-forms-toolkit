const request = require('supertest');

const helper = require('../../../common/helper');
const router = require('../../../../src/routes/v1/email');

const emailComponent = require('../../../../src/components/email');

// Simple Express Server
const basePath = '/api/v1/email';
const app = helper.expressHelper(basePath, router);
helper.logHelper();

describe(`POST ${basePath}`, () => {
  const sendRequestSpy = jest.spyOn(emailComponent, 'sendReceiptRequest');
  let body;

  beforeEach(() => {
    body = {
      ipcPlanId: '93d4ec6c-af70-42b8-91f8-30ba5ef82693',
      to: 'email@valid.ok'
    };
    sendRequestSpy.mockReset();
  });

  it('should yield a created response', async () => {
    sendRequestSpy.mockReturnValue('test');

    const response = await request(app).post(`${basePath}`).send(body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toBeTruthy();
    expect(response.body).toMatch('test');
    expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendRequestSpy).toHaveBeenCalledWith(body.ipcPlanId, body.to);
  });

  it('should yield a validation failure', async () => {
    const email = 'badEmail';
    body.to = email;
    sendRequestSpy.mockReturnValue('test');

    const response = await request(app).post(`${basePath}`).send(body);

    expect(response.statusCode).toBe(422);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('Validation failed');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].value).toMatch(email);
    expect(response.body.errors[0].message).toMatch('Invalid value for `to`.');
    expect(sendRequestSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a server gracefully', async () => {
    const errMsg = 'bad';
    sendRequestSpy.mockImplementation(() => {
      throw new Error(errMsg);
    });

    const response = await request(app).post(`${basePath}`).send(body);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toBe(errMsg);
    expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendRequestSpy).toHaveBeenCalledWith(body.ipcPlanId, body.to);
  });
});
