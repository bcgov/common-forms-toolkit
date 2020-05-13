const Constants = require('../../../src/components/constants');

const helper = require('../../common/helper');

const { models, validators, validatorUtils } = require('../../../src/components/validators');

const validIPCPost = require('../../fixtures/validIPCPost.json');

helper.logHelper();

describe('validatorUtils', () => {
  describe('validatorUtils.isEmail', () => {

    it('should return true for email address', () => {
      const result = validatorUtils.isEmail('email@address.com');

      expect(result).toBeTruthy();
    });

    it('should return true for email address with display name', () => {
      const result = validatorUtils.isEmail('Email Address <email@address.com>');

      expect(result).toBeTruthy();
    });

    it('should return false for non-email address value', () => {
      const result = validatorUtils.isEmail('this is not an email');

      expect(result).toBeFalsy();
    });

    it('should return false for empty value', () => {
      const result = validatorUtils.isEmail('');

      expect(result).toBeFalsy();
    });

    it('should return false for whitespace value', () => {
      const result = validatorUtils.isEmail('            ');

      expect(result).toBeFalsy();
    });

    it('should return false for undefined value', () => {
      const result = validatorUtils.isEmail(undefined);

      expect(result).toBeFalsy();
    });

    it('should return false for non-string value', () => {
      const result = validatorUtils.isEmail(123);

      expect(result).toBeFalsy();
    });

  });

  describe('validatorUtils.isInt', () => {

    it('should return true for a int', () => {
      const value = 123;
      const result = validatorUtils.isInt(value);

      expect(result).toBeTruthy();
    });

    it('should return true for a integer as string ', () => {
      const value = '123456';
      const result = validatorUtils.isInt(value);

      expect(result).toBeTruthy();
    });

    it('should return true for a integer as string object ', () => {
      const value = String(123456);
      const result = validatorUtils.isInt(value);

      expect(result).toBeTruthy();
    });

    it('should return false for a non-numeric string ', () => {
      const value = 'abcdefg1234567';
      const result = validatorUtils.isInt(value);

      expect(result).toBeFalsy();
    });

    it('should return false for a float ', () => {
      const value = 123.45;
      const result = validatorUtils.isInt(value);

      expect(result).toBeFalsy();
    });

    it('should return false for a float string ', () => {
      const value = '123.45';
      const result = validatorUtils.isInt(value);

      expect(result).toBeFalsy();
    });

    it('should return false for an array', () => {
      const result = validatorUtils.isInt([{ value: 123 }]);

      expect(result).toBeFalsy();
    });

    it('should return false for a function', () => {
      const value = x => {
        return String(x);
      };
      const result = validatorUtils.isInt(value);

      expect(result).toBeFalsy();
    });

  });

  describe('validatorUtils.isString', () => {

    it('should return true for a string', () => {
      const value = 'this is a string';
      const result = validatorUtils.isString(value);

      expect(result).toBeTruthy();
    });

    it('should return true for a string object ', () => {
      const value = String(123456);
      const result = validatorUtils.isString(value);

      expect(result).toBeTruthy();
    });

    it('should return false for a number ', () => {
      const value = 123456;
      const result = validatorUtils.isString(value);

      expect(result).toBeFalsy();
    });

    it('should return false for a non-string object ', () => {
      const result = validatorUtils.isString({ value: 'string' });

      expect(result).toBeFalsy();
    });

    it('should return false for an array', () => {
      const result = validatorUtils.isString([{ value: 'string' }]);

      expect(result).toBeFalsy();
    });

    it('should return false for a function', () => {
      const value = x => {
        return String(x);
      };
      const result = validatorUtils.isString(value);

      expect(result).toBeFalsy();
    });

  });

  describe('validatorUtils.isNonEmptyString', () => {

    it('should return true for a string', () => {
      const value = 'this is a string';
      const result = validatorUtils.isNonEmptyString(value);

      expect(result).toBeTruthy();
    });

    it('should return true for a string object ', () => {
      const value = String(123456);
      const result = validatorUtils.isNonEmptyString(value);

      expect(result).toBeTruthy();
    });

    it('should return false for a number ', () => {
      const value = 123456;
      const result = validatorUtils.isNonEmptyString(value);

      expect(result).toBeFalsy();
    });

    it('should return false for a non-string object ', () => {
      const result = validatorUtils.isNonEmptyString({ value: 'string' });

      expect(result).toBeFalsy();
    });

    it('should return false for an array', () => {
      const result = validatorUtils.isNonEmptyString([{ value: 'string' }]);

      expect(result).toBeFalsy();
    });

    it('should return false for a function', () => {
      const value = x => {
        return String(x);
      };
      const result = validatorUtils.isNonEmptyString(value);

      expect(result).toBeFalsy();
    });


    it('should return false for a empty string', () => {
      const value = '';
      const result = validatorUtils.isNonEmptyString(value);

      expect(result).toBeFalsy();
    });

    it('should return false for a empty string object ', () => {
      const value = String();
      const result = validatorUtils.isNonEmptyString(value);

      expect(result).toBeFalsy();
    });


  });

  describe('validatorUtils.isObject', () => {

    it('should return false for an string', () => {
      const value = 'this is a string';
      const result = validatorUtils.isObject(value);

      expect(result).toBeFalsy();
    });

    it('should return false for a string object ', () => {
      const value = String(123456);
      const result = validatorUtils.isObject(value);

      expect(result).toBeFalsy();
    });

    it('should return false for a number ', () => {
      const value = 123456;
      const result = validatorUtils.isObject(value);

      expect(result).toBeFalsy();
    });

    it('should return true for an object ', () => {
      const result = validatorUtils.isObject({ value: 'string' });

      expect(result).toBeTruthy();
    });

    it('should return false for an array', () => {
      const result = validatorUtils.isObject([{ value: 'string' }]);

      expect(result).toBeFalsy();
    });

    it('should return false for a function', () => {
      const value = x => {
        return String(x);
      };
      const result = validatorUtils.isObject(value);

      expect(result).toBeFalsy();
    });

  });

  describe('validatorUtils.isBoolean', () => {

    it('should return false for an string', () => {
      const value = 'this is a string';
      const result = validatorUtils.isBoolean(value);

      expect(result).toBeFalsy();
    });

    it('should return false for a string object ', () => {
      const value = String(123456);
      const result = validatorUtils.isBoolean(value);

      expect(result).toBeFalsy();
    });

    it('should return false for a number ', () => {
      const value = 1;
      const result = validatorUtils.isBoolean(value);

      expect(result).toBeFalsy();
    });

    it('should return false for an object ', () => {
      const result = validatorUtils.isBoolean({ value: 'string' });

      expect(result).toBeFalsy();
    });

    it('should return false for an array', () => {
      const result = validatorUtils.isBoolean([{ value: 'string' }]);

      expect(result).toBeFalsy();
    });

    it('should return false for a function', () => {
      const value = x => {
        return String(x);
      };
      const result = validatorUtils.isBoolean(value);

      expect(result).toBeFalsy();
    });

    it('should return true for a Boolean Object', () => {
      const result = validatorUtils.isBoolean(new Boolean(false));

      expect(result).toBeTruthy();
    });

    it('should return true for a boolean', () => {
      const value = false;
      const result = validatorUtils.isBoolean(value);

      expect(result).toBeTruthy();
    });

  });
});

describe('validators', ()=> {

  describe('validators.email',  () => {
    let emailObj;

    beforeEach(() => {
      emailObj = {
        ipcPlanId: '93d4ec6c-af70-42b8-91f8-30ba5ef82693',
        to: 'email@valid.ok'
      };
    });

    it('should return no errors for valid email object', () => {
      const result = validators.email(emailObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(0);
    });

    it('should return error for email with invalid ipcPlanId', () => {
      const badValue = '00000000-0000-0000-0000-000000000000';
      emailObj.ipcPlanId = badValue;
      const result = validators.email(emailObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch('Invalid value for `ipcPlanId`.');
    });

    it('should return error for email with invalid to', () => {
      const badValue = 'not-an-email';
      emailObj.to = badValue;
      const result = validators.email(emailObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch('Invalid value for `to`.');
    });
  });

  describe('validators.ipc',  () => {
    let ipcObj;

    beforeEach(() => {
      ipcObj = JSON.parse(JSON.stringify(validIPCPost));
    });

    it('should return no errors for valid ipc object', () => {
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(0);
    });

    it('should return error for invalid schema - no object', () => {
      const result = validators.ipc(1);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toMatch('schema');
      expect(result[0].message).toMatch('Invalid schema. Expect an object.');
    });

    it('should return error for invalid schema - no business object', () => {
      delete ipcObj.business;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toMatch('schema');
      expect(result[0].message).toMatch('Invalid schema. `business` is not an object.');
    });

    it('should return error for invalid schema - no contacts array', () => {
      delete ipcObj.contacts;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toMatch('schema');
      expect(result[0].message).toMatch('Invalid schema. `contacts` is not an array.');
    });

    it('should return error for invalid schema - contacts is not array ', () => {
      ipcObj.contacts = {value: 1};
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toMatch('schema');
      expect(result[0].message).toMatch('Invalid schema. `contacts` is not an array.');
    });

    it('should return error for invalid schema - no ipcPlan object', () => {
      delete ipcObj.ipcPlan;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toMatch('schema');
      expect(result[0].message).toMatch('Invalid schema. `ipcPlan` is not an object.');
    });

    it('should return error for no business name', () => {
      const badValue = '';
      ipcObj.business.name = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/business\.name/);
    });

    it('should return error for no contact first name', () => {
      const badValue = '';
      ipcObj.contacts[0].firstName = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/firstName/);
    });

    it('should return error for invalid contact first name', () => {
      const badValue = 123;
      ipcObj.contacts[0].firstName = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/firstName/);
    });

    it('should return error for no contact last name', () => {
      const badValue = '';
      ipcObj.contacts[0].lastName = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/lastName/);
    });

    it('should return error for invalid contact last name', () => {
      const badValue = 123;
      ipcObj.contacts[0].lastName = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/lastName/);
    });

    it('should return error for no contact phone1', () => {
      const badValue = '';
      ipcObj.contacts[0].phone1 = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/phone1/);
    });

    it('should return error for invalid contact phone1', () => {
      const badValue = 'ABC DEF';
      ipcObj.contacts[0].phone1 = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/phone1/);
    });

    it('should return error for no contact email', () => {
      const badValue = '';
      ipcObj.contacts[0].email = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/email/);
    });

    it('should return error for invalid contact email', () => {
      const badValue = 'this.is@invalid';
      ipcObj.contacts[0].email = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/email/);
    });

    it('should return ok for no contact phone2', () => {
      ipcObj.contacts[0].phone2 = '';
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(0);
    });

    // it('should return error for invalid contact phone2', () => {
    //   const badValue = 'ABC DEF';
    //   ipcObj.contacts[0].phone2 = badValue;
    //   const result = validators.ipc(ipcObj);

    //   expect(result).toBeTruthy();
    //   expect(result).toHaveLength(1);
    //   expect(result[0].value).toEqual(badValue);
    //   expect(result[0].message).toMatch(/phone2/);
    // });

    it('should return error for invalid sleepingAreaType (string)', () => {
      const badValue = 'ABC DEF';
      ipcObj.ipcPlan.sleepingAreaType = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/sleepingAreaType/);
    });

    it('should return error for invalid sleepingAreaType (invalid value)', () => {
      const badValue = 999999;
      ipcObj.ipcPlan.sleepingAreaType = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/sleepingAreaType/);
    });

    it('should return error for invalid sharedSleepingPerRoom (invalid type)', () => {
      const badValue = 'S';
      ipcObj.ipcPlan.sleepingAreaType = Constants.SLEEPING_AREA_TYPE_SHARED;
      ipcObj.ipcPlan.sharedSleepingPerRoom = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/sharedSleepingPerRoom/);
    });

    it('should return error for invalid sharedSleepingPerRoom (invalid value)', () => {
      const badValue = 11;
      ipcObj.ipcPlan.sleepingAreaType = Constants.SLEEPING_AREA_TYPE_SHARED;
      ipcObj.ipcPlan.sharedSleepingPerRoom = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/sharedSleepingPerRoom/);
    });

    it('should return error for invalid sharedSleepingDistancing (invalid type)', () => {
      const badValue = 'not good';
      ipcObj.ipcPlan.sleepingAreaType = Constants.SLEEPING_AREA_TYPE_SHARED;
      ipcObj.ipcPlan.sharedSleepingDistancing = badValue;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(/sharedSleepingDistancing/);
    });

    it('should return ok for valid sleepingAreaType (single)', () => {
      ipcObj.ipcPlan.sleepingAreaType = Constants.SLEEPING_AREA_TYPE_SINGLE;
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(0);
    });

    it('should return ok for invalid sharedSleepingPerRoom & sharedSleepingDistancing when sleepingAreaType is single', () => {
      ipcObj.ipcPlan.sleepingAreaType = Constants.SLEEPING_AREA_TYPE_SINGLE;
      ipcObj.ipcPlan.sharedSleepingPerRoom = 'not a number';
      ipcObj.ipcPlan.sharedSleepingDistancing = 'not a boolean';
      const result = validators.ipc(ipcObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(0);
    });

    test.each(models.ipcPlan.booleanFields)('should return error for invalid boolean value on %s', (value) => {
      let goodObj = JSON.parse(JSON.stringify(validIPCPost));
      const badValue = 'not boolean';
      goodObj.ipcPlan[value] = badValue;
      const result = validators.ipc(goodObj);

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual(badValue);
      expect(result[0].message).toMatch(new RegExp(value));
    });

  });

});
