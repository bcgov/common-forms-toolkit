<template>
  <v-container>
    <div class="hide-on-review">
      <v-btn
        v-if="showTestDataButton"
        class="mb-5"
        outlined
        color="primary"
        @click="sampleData"
        data-test="btn-form-test-data"
      >
        <span>FOR TEST ONLY - FILL SAMPLE DATA</span>
      </v-btn>

      <BaseHeaderSection :text="'Provide the following information'" />
    </div>

    <v-form ref="form" v-model="step1Valid" class="mt-6">
      <BaseHeaderSub :text="'Business Information'" />

      <v-container class="pt-10">
        <v-row>
          <v-col cols="12" lg="6">
            <label>Registered Business Name</label>
            <OrgBookSearch
              v-if="!reviewMode"
              :field-model.sync="businessName"
              :field-rules="businessNameRules"
            />
            <v-text-field
              v-if="reviewMode"
              dense
              flat
              outlined
              solo
              v-model="businessName"
              data-test="text-form-businessName"
              :rules="businessNameRules"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <label>Business Address line 1</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              v-model="businessAddressLine1"
              data-test="text-form-businessAddressLine1"
              :rules="businessAddressLine1Rules"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <label>Business Address line 2 (Optional)</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              v-model="businessAddressLine2"
              data-test="text-form-businessAddressLine2"
              :rules="businessAddressLine2Rules"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <label>City</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              v-model="businessAddressCity"
              data-test="text-form-businessAddressCity"
              :rules="businessAddressCityRules"
            />
          </v-col>

          <v-col cols="12" sm="3">
            <label>Province</label>
            <v-select
              :items="provinces"
              dense
              flat
              outlined
              solo
              single-line
              label="Select"
              v-model="businessAddressProvince"
              data-test="select-form-businessAddressProvince"
              :rules="businessAddressProvinceRules"
            />
          </v-col>

          <v-col cols="12" sm="3">
            <label>Postal Code</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              v-model="businessAddressPostalCode"
              data-test="text-form-businessAddressPostalCode"
              :rules="businessAddressPostalCodeRules"
            />
          </v-col>
        </v-row>
      </v-container>

      <BaseHeaderSub :text="'Primary Contact'" />

      <v-container class="pt-10">
        <v-row>
          <v-col cols="12" sm="6">
            <label>First Name</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              v-model="firstName"
              data-test="text-form-firstName"
              :rules="firstNameRules"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <label>Last Name</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              v-model="lastName"
              data-test="text-form-lastName"
              :rules="lastNameRules"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <label>Phone Number</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              placeholder="000-000-0000"
              :rules="phone1Rules"
              prepend-inner-icon="phone"
              v-model="phone1"
              data-test="text-form-phone1"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <label>Alternative Phone Number (Optional)</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              placeholder="000-000-0000"
              prepend-inner-icon="phone"
              v-model="phone2"
              data-test="text-form-phone2"
              :rules="phone2Rules"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <label>E-mail Address (Primary Contact)</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              placeholder="john.doe@example.com"
              :rules="emailRules"
              prepend-inner-icon="email"
              v-model="email"
              data-test="text-form-email"
            />
          </v-col>
        </v-row>
      </v-container>

      <BaseHeaderSub :text="'Employer-provided Workplace or Housing Locations'" />

      <v-container class="pt-10">
        <v-row>
          <v-col cols="12" sm="6" lg="5">
            <label>Address line 1</label>
            <v-text-field
              v-model="motelAddressLine1"
              :rules="motelAddressLine1Rules"
              dense
              flat
              outlined
              solo
            />
          </v-col>

          <v-col cols="12" sm="6" lg="5">
            <label>Address line 2 (Optional)</label>
            <v-text-field
              v-model="motelAddressLine2"
              :rules="motelAddressLine2Rules"
              dense
              flat
              outlined
              solo
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6" lg="5">
            <label>City</label>
            <v-text-field
              v-model="motelCity"
              data-test="text-form-motelCity"
              :rules="motelCityRules"
              dense
              flat
              outlined
              solo
            />
          </v-col>
          <v-col cols="12" sm="3" lg="2">
            <label>Province</label>
            <v-select
              dense
              flat
              outlined
              solo
              single-line
              label="select"
              v-model="motelProvince"
              data-test="select-form-motelProvince"
              :items="provinces"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="3" lg="2">
            <label>Postal Code</label>
            <v-text-field
              v-model="motelPostalCode"
              :rules="motelPostalCodeRules"
              dense
              flat
              outlined
              solo
            />
          </v-col>
        </v-row>
      </v-container>


      <v-container>

        <hr class="mb-10"/>
        <v-row>
          <v-col cols="12" lg="10">
            <label>Additional Locations:</label>
            <v-textarea
              v-model="motelAdditional"
              :rules="motelAdditionalRules"
              dense
              flat
              outlined
              solo
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <div class="hide-on-review pt-5">
      <v-btn color="primary" @click="submit" data-test="btn-form-to-next-step">
        <span>Go to Step 2</span>
      </v-btn>
      <v-btn text @click="setStep(0)" data-test="btn-form-to-previous-step">
        <span>Back</span>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import validator from 'validator';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import OrgBookSearch from '@/components/common/OrgBookSearch.vue';
import Vue from 'vue';

export default {
  name: 'FarmStep1',
  props: {
    reviewMode: Boolean
  },
  components: {
    OrgBookSearch,
  },
  data() {
    return {
      step1Valid: false,
      validationFailed: false,
      startDateMenu: false,
      endDateMenu: false,
      showTestDataButton: Vue.prototype.$config
        ? Vue.prototype.$config.env !== 'prod'
        : false,

      // Todo: constants file
      provinces: [
        'AB',
        'BC',
        'MB',
        'NB',
        'NL',
        'NS',
        'NT',
        'NU',
        'ON',
        'PE',
        'QC',
        'SK',
        'YT'
      ],

      // Business
      businessNameRules: [
        (v) => !!v || 'Business name is required',
        (v) =>
          (v && v.length <= 255) ||
          'Business name must be 255 characters or less',
      ],
      businessAddressLine1Rules: [
        (v) => !!v || 'Business address is required',
        (v) =>
          (v && v.length <= 255) || 'Line 1 must be 255 characters or less',
      ],
      businessAddressLine2Rules: [
        (v) => !v || v.length <= 255 || 'Line 2 must be 255 characters or less',
      ],
      businessAddressCityRules: [
        (v) => !!v || 'City is required',
        (v) => (v && v.length <= 255) || 'City must be 255 characters or less',
      ],
      businessAddressProvinceRules: [(v) => !!v || 'Province is required'],
      businessAddressPostalCodeRules: [
        (v) => !!v || 'Postal Code is required',
        (v) => (v && v.length <= 7) || 'Please enter a valid postal code',
      ],

      // Contact
      firstNameRules: [
        (v) => !!v || 'First name is required',
        (v) =>
          (v && v.length <= 255) || 'First name must be 255 characters or less',
      ],
      lastNameRules: [
        (v) => !!v || 'Last name is required',
        (v) =>
          (v && v.length <= 255) || 'Last name must be 255 characters or less',
      ],
      phone1Rules: [
        (v) => !!v || 'Phone number is required',
        (v) => validator.isMobilePhone(v) || 'invalid phone number format',
        (v) =>
          (v && v.length <= 30) || 'Phone number must be 30 characters or less',
      ],
      phone2Rules: [
        (v) =>
          !v || validator.isMobilePhone(v) || 'invalid phone number format',
        (v) =>
          !v || v.length <= 30 || 'Phone number must be 30 characters or less',
      ],
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) =>
          validator.isEmail(v, { allow_display_name: true }) ||
          'invalid e-mail format',
        (v) =>
          (v && v.length <= 255) || 'E-mail must be 255 characters or less',
      ],

      // Location
      motelAddressLine1Rules: [
        (v) =>
          !v || v.length <= 255 || 'Address must be 255 characters or less',
      ],
      motelAddressLine2Rules: [
        (v) =>
          !v || v.length <= 255 || 'Address must be 255 characters or less',
      ],
      motelCityRules: [
        (v) => !v || v.length <= 255 || 'City must be 255 characters or less',
      ],
      motelPostalCodeRules: [
        (v) => !v || v.length <= 7 || ' enter a valid postal code',
      ],
    };
  },
  computed: {
    ...mapGetters('farmOpScreeningForm', [
      'business',
      'primaryContact',
      'location'
    ]),

    // Business
    businessName: {
      get() {
        return this.business.name;
      },
      set(value) {
        this.updateBusiness({ ['name']: value });
      }
    },
    businessAddressLine1: {
      get() {
        return this.business.addressLine1;
      },
      set(value) {
        this.updateBusiness({ ['addressLine1']: value });
      }
    },
    businessAddressLine2: {
      get() {
        return this.business.addressLine2;
      },
      set(value) {
        this.updateBusiness({ ['addressLine2']: value });
      }
    },
    businessAddressCity: {
      get() {
        return this.business.city;
      },
      set(value) {
        this.updateBusiness({ ['city']: value });
      }
    },
    businessAddressProvince: {
      get() {
        return this.business.province;
      },
      set(value) {
        this.updateBusiness({ ['province']: value });
      }
    },
    businessAddressPostalCode: {
      get() {
        return this.business.postalCode;
      },
      set(value) {
        this.updateBusiness({ ['postalCode']: value });
      }
    },

    // Contact
    firstName: {
      get() {
        return this.primaryContact.firstName;
      },
      set(value) {
        this.updatePrimaryContact({ ['firstName']: value });
      }
    },
    lastName: {
      get() {
        return this.primaryContact.lastName;
      },
      set(value) {
        this.updatePrimaryContact({ ['lastName']: value });
      }
    },
    phone1: {
      get() {
        return this.primaryContact.phone1;
      },
      set(value) {
        this.updatePrimaryContact({ ['phone1']: value });
      }
    },
    phone2: {
      get() {
        return this.primaryContact.phone2;
      },
      set(value) {
        this.updatePrimaryContact({ ['phone2']: value });
      }
    },
    email: {
      get() {
        return this.primaryContact.email;
      },
      set(value) {
        this.updatePrimaryContact({ ['email']: value });
      },
    },

    // Location
    motelAddressLine1: {
      get() {
        return this.location.motelAddressLine1;
      },
      set(value) {
        this.updateLocation({ ['motelAddressLine1']: value });
      }
    },
    motelAddressLine2: {
      get() {
        return this.location.motelAddressLine2;
      },
      set(value) {
        this.updateLocation({ ['motelAddressLine2']: value });
      }
    },
    motelCity: {
      get() {
        return this.location.motelCity;
      },
      set(value) {
        this.updateLocation({ ['motelCity']: value });
      }
    },
    motelProvince: {
      get() {
        return this.location.motelProvince;
      },
      set(value) {
        this.updateLocation({ ['motelProvince']: value });
      }
    },
    motelPostalCode: {
      get() {
        return this.location.motelPostalCode;
      },
      set(value) {
        this.updateLocation({ ['motelPostalCode']: value });
      }
    },
    motelAdditional: {
      get() {
        return this.location.motelAdditional;
      },
      set(value) {
        this.updateLocation({ ['motelAdditional']: value });
      },
    },
  },
  methods: {
    ...mapActions('farmOpScreeningForm', ['sampleData']),
    ...mapMutations('farmOpScreeningForm', [
      'setStep',
      'updateBusiness',
      'updatePrimaryContact',
      'updateLocation',
    ]),
    async submit() {
      if (this.$refs.form.validate()) {
        this.setStep(2);
      } else {
        await new Promise((r) => setTimeout(r, 200)); //ugh
        const el = document.querySelector(
          '.v-messages.error--text:first-of-type'
        );
        el.scrollIntoView(true);
        window.scrollBy(0, -60); // ugh again
      }
    }
  },
  mounted() {
    if (!this.reviewMode) {
      // Once they've gotten to the form start (step 2) enable the typical "leave site" native browser warning
      // This gets disabled after form submit in step 6
      window.onbeforeunload = () => true;
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  .row {
    div[class^='col-'],
    div[class*=' col-'] {
      padding-bottom: 0;
      padding-top: 0;
    }
  }
}
</style>
