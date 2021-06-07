import commonFormService from '@/services/commonFormService';
import { FormNames } from '@/utils/constants';
import { SampleData, RandomCities } from './sampleData.js';

// Change the supplied state to the exact format required by the API endpoint
// Any data guards/sanitation can go in here
function transformToPost(state) {
  // TODO: unit test this!
  const copy = JSON.parse(JSON.stringify(state));

  // Recursive remove all '' fields from body to post
  // https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
  // const cleanEmpty = copy => Object.entries(copy)
  //   .map(([k, v]) => [k, v && typeof v === 'object' ? cleanEmpty(v) : v])
  //   .reduce((a, [k, v]) => (v === '' ? a : { ...a, [k]: v }), {});

  const contacts = [copy.primaryContact];
  const body = {
    type: copy.type,
    business: copy.business,
    contacts: contacts,
    attestation: copy.attestation,
    location: copy.location
  };

  return body;
}

// Change the results of the API fetch to the store state format
function transformToState(data) {
  // TODO: unit test this!
  const copy = JSON.parse(JSON.stringify(data));

  const primary = copy.contacts ? copy.contacts.find(({ contactType }) => contactType === 'PRIMARY') : {};
  return {
    type: copy.operationType,
    business: copy.business,
    primaryContact: primary,
    attestation: copy.attestation,
    location: copy.location
  };
}

export default {
  namespaced: true,
  state: {
    getFormError: '',
    gettingForm: false,
    submitting: false,
    step: 0,
    submissionComplete: false,
    submissionDetails: null,
    submissionError: '',

    // Form schema
    // 'operation type' form field is hidden, default set
    type: 'AGRICULTURE',
    business: {
      name: '',
      orgBookId: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      postalCode: ''
    },
    primaryContact: {
      contactType: 'PRIMARY',
      firstName: '',
      lastName: '',
      phone1: '',
      phone2: '',
      email: ''
    },
    location: {

      startDate: '2001-01-01',
      endDate: '2002-02-02',
      city: 'defaultCity',
      cityLatitude: undefined,
      cityLongitude: undefined,
      numberOfWorkers: 1,
      accTents: false,
      tentDetails: '',
      accMotel: false,
      motelName: '',
      motelAddressLine1: '',
      motelAddressLine2: '',
      motelCity: '',
      motelProvince: '',
      motelPostalCode: '',
      accWorkersHome: false,
      motelAdditional: ''
    },
    attestation: {
      guidelinesRead: false,
      assessmentCompleted: false,
      developedPlan: false,
      protectionSignage: false,
      workerContactPersonnel: false,
      sharedSleepingDistancing: false,
      sharedSleepingCommunication: false,
      sharedSleepingProvidedAccommodations: false,
      selfIsolateUnderstood: false,
      selfIsolateAccommodation: false,
      laundryServices: false,
      wasteManagementGloves: false,
      wasteManagementSchedule: false,
      wasteManagementBags: false,
      handWashingStations: false,
      handWashingSoapWater: false,
      handWashingWaterless: false,
      handWashingPaperTowels: false,
      handWashingSignage: false,
      distancingMaintained: false,
      distancingFaceShields: false,
      disinfectingSchedule: false,
      transportationSingleOccupant: false,
      transportationBusesVans: false,
      transportationHelicopter: false,
      transportationTrucksCars: false,
      transportationTravelPod: false,
      transportationCleaningDistancing: false,
      educationSignage: false,
      educationContactPersonnel: false,
      trainingCovid19: false,
      trainingEtiquette: false,
      trainingLocations: false,
      trainingFirstAid: false,
      trainingReporting: false,
      mealsDistancing: false,
      mealsDishware: false,
      mealsDishwashing: false,
      infectionSeparation: false,
      infectionSymptoms: false,
      infectionHeathLinkBC: false,
      infectionSanitization: false,
      infectedFeeding: false,
      infectedHousekeeping: false,
      infectedWaste: false,
      infectionAccommodation: false,
      certifyAccurateInformation: false,
      agreeToInspection: false
    }
  },
  getters: {
    getFormError: state => state.getFormError,
    gettingForm: state => state.gettingForm,
    step: state => state.step,
    submitting: state => state.submitting,
    submissionComplete: state => state.submissionComplete,
    submissionDetails: state => state.submissionDetails,
    submissionError: state => state.submissionError,

    // Form objects
    operationType: state => state.type,
    business: state => state.business,
    primaryContact: state => state.primaryContact,
    attestation: state => state.attestation,
    location: state => state.location
  },
  mutations: {
    setGetFormError(state, errorMessage) {
      state.getFormError = errorMessage;
    },
    setGettingForm(state, isGetting) {
      state.gettingForm = isGetting;
    },
    setSubmitting(state, isSubmitting) {
      state.submitting = isSubmitting;
    },
    setStep: (state, step) => {
      window.scrollTo(0, 0);
      state.step = step;
    },
    setSubmissionComplete(state) {
      state.submissionComplete = true;
      window.scrollTo(0, 0);
    },
    setSubmissionDetails(state, responseData) {
      state.submissionDetails = responseData;
    },
    setSubmissionError(state, errorMessage) {
      state.submissionError = errorMessage;
    },

    // Form updates
    setOperationType(state, type) {
      state.type = type;
    },
    updateBusiness: (state, obj) => {
      Object.assign(state.business, obj);
    },
    updatePrimaryContact: (state, obj) => {
      Object.assign(state.primaryContact, obj);
    },
    updateAttestation: (state, obj) => {
      Object.assign(state.attestation, obj);
    },
    updateLocation: (state, obj) => {
      Object.assign(state.location, obj);
    }
  },
  actions: {
    async getForm({ commit }, id) {
      commit('setGettingForm', true);
      commit('setGetFormError', '');
      try {
        const response = await commonFormService.getSubmission(FormNames.FARMOPSCREENING, id);
        if (!response.data) {
          throw new Error(`Failed to GET for ${id}`);
        }
        const transformed = transformToState(response.data);

        commit('updateAttestation', transformed.attestation);
        commit('updateBusiness', transformed.business);
        commit('updatePrimaryContact', transformed.primaryContact);
        commit('updateLocation', transformed.location);
        commit('setOperationType', transformed.type ? transformed.type.display : '');
        commit('setSubmissionComplete');
      } catch (error) {
        console.error(`Error getting form: ${error}`); // eslint-disable-line no-console
        commit('setGetFormError', 'An error occurred while attempting to fetch details. Please refresh and try again.');
      } finally {
        commit('setGettingForm', false);
      }
    },
    async submitForm({ commit, state }) {
      commit('setSubmitting', true);
      commit('setSubmissionError', '');
      try {
        const body = transformToPost(state);
        const response = await commonFormService.sendSubmission(FormNames.FARMOPSCREENING, body);
        if (!response.data) {
          throw new Error('No response data from API while submitting form');
        }
        commit('setSubmissionDetails', response.data);
        commit('setSubmissionComplete');
      } catch (error) {
        console.error(`Error submitting form: ${error} - ${error.message}`); // eslint-disable-line no-console
        commit('setSubmissionError', 'An error occurred while attempting to submit the form. Please try again.');
      } finally {
        commit('setSubmitting', false);
      }
    },
    async sampleData({ commit }) {
      commit('updateBusiness', SampleData.business);
      commit('updatePrimaryContact', SampleData.primaryContact);
      const l = SampleData.location;
      l.city = RandomCities[Math.floor(Math.random() * RandomCities.length)];
      commit('updateLocation', l);
    }
  }
};
