const moment = require('moment');
const validator = require('validator');

const Constants = require('./constants');

const validatorUtils = {
  isEmail: x => {
    return validatorUtils.isString(x) && !validator.isEmpty(x, { ignore_whitespace: true }) && validator.isEmail(x, { allow_display_name: true });
  },

  isInt: x => {
    if (isNaN(x)) {
      return false;
    }
    const num = parseFloat(x);
    // use modulus to determine if it is an int
    return num % 1 === 0;
  },

  isString: x => {
    return Object.prototype.toString.call(x) === '[object String]';
  },

  isNonEmptyString: x => {
    return validatorUtils.isString(x) && !validator.isEmpty(x, {ignore_whitespace: true});
  },

  isObject: x => {
    return Object.prototype.toString.call(x) === '[object Object]';
  },

  isBoolean: (x) => {
    if (Object.prototype.toString.call(x) === '[object Boolean]') {
      return validator.isBoolean(String(x));
    }
    return false;
  },

  isDateString: (x) => validatorUtils.isNonEmptyString(x) && moment(x).isValid()
};

const models = {

  address: {
    addressLine1: value => validatorUtils.isNonEmptyString(value),
    addressLine2: value => validatorUtils.isString(value),
    city: value => validatorUtils.isString(value),
    province: value => validatorUtils.isString(value),
    postalCode: value => validatorUtils.isString(value)
  },

  business: {
    name: value => {
      return validatorUtils.isNonEmptyString(value);
    }
  },

  contact: {
    firstName: value => {
      return validatorUtils.isNonEmptyString(value);
    },
    lastName: value => {
      return validatorUtils.isNonEmptyString(value);
    },
    phone1: value => {
      return validatorUtils.isNonEmptyString(value) && validator.isMobilePhone(value);
    },
    phone2: value => validatorUtils.isString(value),
    email: value => {
      return validatorUtils.isEmail(value);
    },
  },

  email: {
    ipcPlanId: value => validatorUtils.isNonEmptyString(value) && validator.isUUID(value, 4),
    to: value => validatorUtils.isEmail(value)
  },

  ipcPlan: {
    booleanFields: [
      'guidelinesRead',
      'assessmentCompleted',
      'developedPlan',
      'protectionSignage',
      'workerContactPersonnel',
      'commonAreaDistancing',
      'selfIsolateUnderstood',
      'selfIsolateAccommodation',
      'laundryServices',
      'wasteManagementGloves',
      'wasteManagementSchedule',
      'wasteManagementBags',
      'handWashingStations',
      'handWashingSoapWater',
      'handWashingWaterless',
      'handWashingPaperTowels',
      'handWashingSignage',
      'distancingMaintained',
      'distancingFaceShields',
      'disinfectingSchedule',
      'educationSignage',
      'educationContactPersonnel',
      'trainingCovid19',
      'trainingEtiquette',
      'trainingLocations',
      'trainingFirstAid',
      'trainingReporting',
      'mealsDistancing',
      'mealsDishware',
      'mealsDishwashing',
      'infectionSeparation',
      'infectionSymptoms',
      'infectionHeathLinkBC',
      'infectionSanitization',
      'infectionAccommodation',
      'infectedFeeding',
      'infectedHousekeeping',
      'infectedWaste',
      'certifyAccurateInformation',
      'agreeToInspection'
    ],
    sleepingAreaType: value => validatorUtils.isInt(value) && validator.isInt(String(value), {min: Constants.SLEEPING_AREA_TYPE_SINGLE, max: Constants.SLEEPING_AREA_TYPE_SHARED, allow_leading_zeroes: false}),
    sharedSleepingPerRoom: value => validatorUtils.isInt(value) && validator.isInt(String(value), {min: 1, max: 10, allow_leading_zeroes: false}),
    sharedSleepingDistancing: value => validatorUtils.isBoolean(value),
  },

  location: {
    startDate: value => validatorUtils.isDateString(value),
    endDate: value => validatorUtils.isDateString(value),
    accTents: value => validatorUtils.isBoolean(value),
    accMotel: value => validatorUtils.isBoolean(value),
    accWorkersHome: value => validatorUtils.isBoolean(value),
  }
};

const validators = {
  email: (obj) => {
    const errors = [];
    if (!models.email.ipcPlanId(obj['ipcPlanId'])) {
      errors.push({ value: obj['ipcPlanId'], message: 'Invalid value for `ipcPlanId`.' });
    }
    if (!models.email.to(obj['to'])) {
      errors.push({ value: obj['to'], message: 'Invalid value for `to`.' });
    }
    return errors;
  },

  ipc: (obj) => {
    if (!validatorUtils.isObject(obj)) {
      return [{ value: 'schema', message: 'Invalid schema. Expect an object.' }];
    }
    if (!validatorUtils.isObject(obj['business'])) {
      return [{ value: 'schema', message: 'Invalid schema. `business` is not an object.' }];
    }
    if (!Array.isArray(obj['contacts'])) {
      return [{ value: 'schema', message: 'Invalid schema. `contacts` is not an array.' }];
    }
    if (!validatorUtils.isObject(obj['covidContact'])) {
      return [{ value: 'schema', message: 'Invalid schema. `covidContact` is not an object.' }];
    }
    if (!validatorUtils.isObject(obj['ipcPlan'])) {
      return [{ value: 'schema', message: 'Invalid schema. `ipcPlan` is not an object.' }];
    }

    const errors = [];
    if (!models.business.name(obj.business['name'])) {
      errors.push({ value: obj.business['name'], message: 'Invalid value for required field `business.name`.' });
    }

    if (!models.address.addressLine1(obj.business['addressLine1'])) {
      errors.push({ value: obj.business['addressLine1'], message: 'Invalid value for required field `business.addressLine1`.' });
    }
    if (!models.address.addressLine2(obj.business['addressLine2'])) {
      errors.push({ value: obj.business['addressLine2'], message: 'Invalid value for field `business.addressLine2`.' });
    }
    if (!models.address.city(obj.business['city'])) {
      errors.push({ value: obj.business['city'], message: 'Invalid value for field `business.city`.' });
    }
    if (!models.address.province(obj.business['province'])) {
      errors.push({ value: obj.business['province'], message: 'Invalid value for field `business.province`.' });
    }
    if (!models.address.postalCode(obj.business['postalCode'])) {
      errors.push({ value: obj.business['postalCode'], message: 'Invalid value for field `business.postalCode`.' });
    }

    obj['contacts'].forEach((value, index) => {
      if (!models.contact.firstName(value['firstName'])) {
        errors.push({ value: value['firstName'], message: `Invalid value for required field \`contacts[${index}].firstName\`.` });
      }
      if (!models.contact.lastName(value['lastName'])) {
        errors.push({ value: value['lastName'], message: `Invalid value for required field \`contacts[${index}].lastName\`.` });
      }
      if (!models.contact.phone1(value['phone1'])) {
        errors.push({ value: value['phone1'], message: `Invalid value for required field \`contacts[${index}].phone1\`.` });
      }
      if (!models.contact.email(value['email'])) {
        errors.push({ value: value['email'], message: `Invalid value for required field \`contacts[${index}].email\`.` });
      }
      if (!models.contact.phone2(value['phone2'])) {
        errors.push({ value: value['phone2'], message: `Invalid value for field \`contacts[${index}].phone2\`.` });
      }
    });

    if (!models.contact.firstName(obj.covidContact['firstName'])) {
      errors.push({ value: obj.covidContact['firstName'], message: 'Invalid value for required field `covidContact.firstName`.' });
    }
    if (!models.contact.lastName(obj.covidContact['lastName'])) {
      errors.push({ value: obj.covidContact['lastName'], message: 'Invalid value for required field `covidContact.lastName`.' });
    }
    if (!models.contact.phone1(obj.covidContact['phone1'])) {
      errors.push({ value: obj.covidContact['phone1'], message: 'Invalid value for required field `covidContact.phone1`.' });
    }
    if (!models.contact.email(obj.covidContact['email'])) {
      errors.push({ value: obj.covidContact['email'], message: 'Invalid value for required field `covidContact.email`.' });
    }
    if (!models.contact.phone2(obj.covidContact['phone2'])) {
      errors.push({ value: obj.covidContact['phone2'], message: 'Invalid value for field `covidContact.phone2`.' });
    }

    if (!models.location.startDate(obj.location['startDate'])) {
      errors.push({ value: obj.location['startDate'], message: 'Invalid value for required field `location.startDate`.' });
    }
    if (!models.location.endDate(obj.location['endDate'])) {
      errors.push({ value: obj.location['endDate'], message: 'Invalid value for required field `location.endDate`.' });
    }
    if (!models.location.accTents(obj.location['accTents'])) {
      errors.push({ value: obj.location['accTents'], message: 'Invalid value for required field `location.accTents`.' });
    } else {
      if (obj.location['accTents']) {
        if (!validatorUtils.isNonEmptyString(obj.location['tentDetails'])) {
          errors.push({ value: obj.location['tentDetails'], message: 'Invalid value for required field `location.tentDetails`.' });
        }
      }
    }
    if (!models.location.accMotel(obj.location['accMotel'])) {
      errors.push({ value: obj.location['accMotel'], message: 'Invalid value for required field `location.accMotel`.' });
    } else {
      if (obj.location['accMotel']) {
        if (!validatorUtils.isNonEmptyString(obj.location['motelName'])) {
          errors.push({ value: obj.location['motelName'], message: 'Invalid value for required field `location.motelName`.' });
        }
        if (!models.address.addressLine1(obj.location['motelAddressLine1'])) {
          errors.push({ value: obj.location['motelAddressLine1'], message: 'Invalid value for required field `location.motelAddressLine1`.' });
        }
        if (!models.address.addressLine2(obj.location['motelAddressLine2'])) {
          errors.push({ value: obj.location['motelAddressLine2'], message: 'Invalid value for field `location.motelAddressLine2`.' });
        }
        if (!models.address.city(obj.location['motelCity'])) {
          errors.push({ value: obj.location['motelCity'], message: 'Invalid value for field `location.motelCity`.' });
        }
        if (!models.address.province(obj.location['motelProvince'])) {
          errors.push({ value: obj.location['motelProvince'], message: 'Invalid value for field `location.motelProvince`.' });
        }
        if (!models.address.postalCode(obj.location['motelPostalCode'])) {
          errors.push({ value: obj.location['motelPostalCode'], message: 'Invalid value for field `location.motelPostalCode`.' });
        }
      }
    }
    if (!models.location.accWorkersHome(obj.location['accWorkersHome'])) {
      errors.push({ value: obj.location['accWorkersHome'], message: 'Invalid value for required field `location.accWorkersHome`.' });
    }
    if (!models.address.addressLine1(obj.location['addressLine1'])) {
      errors.push({ value: obj.location['addressLine1'], message: 'Invalid value for required field `location.addressLine1`.' });
    }
    if (!models.address.addressLine2(obj.location['addressLine2'])) {
      errors.push({ value: obj.location['addressLine2'], message: 'Invalid value for field `location.addressLine2`.' });
    }
    if (!models.address.city(obj.location['city'])) {
      errors.push({ value: obj.location['city'], message: 'Invalid value for field `location.city`.' });
    }
    if (!models.address.province(obj.location['province'])) {
      errors.push({ value: obj.location['province'], message: 'Invalid value for field `location.province`.' });
    }
    if (!models.address.postalCode(obj.location['postalCode'])) {
      errors.push({ value: obj.location['postalCode'], message: 'Invalid value for field `location.postalCode`.' });
    }


    if (!models.ipcPlan.sleepingAreaType(obj.ipcPlan['sleepingAreaType'])) {
      errors.push({ value: obj.ipcPlan['sleepingAreaType'], message: 'Invalid value `ipcPlan.sleepingAreaType`.' });
    } else {
      if (obj.ipcPlan['sleepingAreaType'] === Constants.SLEEPING_AREA_TYPE_SHARED) {
        if (!models.ipcPlan.sharedSleepingPerRoom(obj.ipcPlan['sharedSleepingPerRoom'])) {
          errors.push({ value: obj.ipcPlan['sharedSleepingPerRoom'], message: 'Invalid value `ipcPlan.sharedSleepingPerRoom`.' });
        }
        if (!models.ipcPlan.sharedSleepingDistancing(obj.ipcPlan['sharedSleepingDistancing'])) {
          errors.push({ value: obj.ipcPlan['sharedSleepingDistancing'], message: 'Invalid value `ipcPlan.sharedSleepingDistancing`.' });
        }
      }
    }

    models.ipcPlan.booleanFields.forEach(value => {
      if (!validatorUtils.isBoolean(obj.ipcPlan[value])) {
        errors.push({ value: obj.ipcPlan[value], message: `Invalid value \`ipcPlan.${value}\`.  Boolean expected.` });
      }
    });

    return errors;
  }
};

module.exports = { models, validators, validatorUtils };
