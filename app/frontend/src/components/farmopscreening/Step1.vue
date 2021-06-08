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

      <BaseHeaderSub v-if="formVersionId == 1" :text="'COVID-19 Coordinator'" />

      <v-container v-if="formVersionId == 1">
        <v-row>
          <v-col cols="12" sm="6">
            <label>First Name</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              v-model="covidFirstName"
              data-test="text-form-covidFirstName"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <label>Last Name</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              v-model="covidLastName"
              data-test="text-form-covidLastName"
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
              prepend-inner-icon="phone"
              v-model="covidPhone1"
              data-test="text-form-covidPhone1"
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
              v-model="covidPhone2"
              data-test="text-form-covidPhone2"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6" lg="5">
            <label>E-mail Address (Primary Contact)</label>
            <v-text-field
              dense
              flat
              outlined
              solo
              placeholder="john.doe@example.com"
              prepend-inner-icon="email"
              v-model="covidEmail"
              data-test="text-form-covidEmail"
            />
          </v-col>
        </v-row>
      </v-container>

      <BaseHeaderSub :text="'Employer-provided Housing Locations'" />

      <template v-if="formVersionId == 1">
        <v-container class="pt-10">
          <v-row>
            <v-col cols="12" sm="6">
              <v-menu
                v-model="startDateMenu"
                data-test="menu-form-startDate"
                :close-on-content-click="true"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <label>Operation Start Date</label>
                  <v-text-field
                    v-model="startDate"
                    data-test="text-form-startDate"
                    placeholder="yyyy-mm-dd"
                    append-icon="event"
                    v-on:click:append="startDateMenu = true"
                    readonly
                    v-on="on"
                    dense
                    flat
                    outlined
                    solo
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="startDate"
                  data-test="picker-form-startDate"
                  @input="startDateMenu = false"
                  :readonly="reviewMode"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" sm="6">
              <v-menu
                v-model="endDateMenu"
                data-test="menu-form-endDate"
                :close-on-content-click="true"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <label>Operation End Date</label>
                  <v-text-field
                    v-model="endDate"
                    data-test="text-form-endDate"
                    placeholder="yyyy-mm-dd"
                    append-icon="event"
                    v-on:click:append="endDateMenu = true"
                    readonly
                    v-on="on"
                    dense
                    flat
                    outlined
                    solo
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  data-test="picker-form-endDate"
                  @input="endDateMenu = false"
                  :readonly="reviewMode"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <label>Closest Community / Town / City</label>
              <CityLookup
                v-if="!reviewMode"
                :field-model.sync="locationCity"
                :latitude.sync="cityLatitude"
                :longitude.sync="cityLongitude"
              />
              <v-text-field
                v-if="reviewMode"
                dense
                flat
                outlined
                solo
                v-model="locationCity"
                data-test="text-form-locationCity"
              />
              <v-text-field
                v-model="cityLatitude"
                data-test="text-form-cityLatitude"
                class="d-none"
              />
              <v-text-field
                v-model="cityLongitude"
                data-test="text-form-cityLongitude"
                class="d-none"
              />
            </v-col>

            <v-col cols="12" sm="6" lg="3">
              <label>Number of workers at this location</label>
              <v-text-field
                v-model="numberOfWorkers"
                data-test="text-form-numberOfWorkers"
                type="number"
                min="1"
                dense
                flat
                outlined
                solo
              />
            </v-col>
          </v-row>

          <br />
          <hr />
          <h3 class="mt-6">
            Type of housing provided by employers for workers at this
            location (check all that apply)
          </h3>

          <v-checkbox
            v-model="accTents"
            data-test="cb-form-accTents"
            :readonly="reviewMode"
            label="Tent or trailer sites"
          ></v-checkbox>

          <div v-if="accTents">
            <v-row>
              <v-col cols="12">
                <label>
                  Details (eg:<em>"1km from HWY 1 at 100 mile house north on Logging Road"</em>)
                </label>
                <v-textarea
                  v-model="tentDetails"
                  data-test="text-form-tentDetails"
                  auto-grow
                  rows="1"
                  dense
                  flat
                  outlined
                  solo
                />
              </v-col>
            </v-row>
          </div>

          <v-checkbox
            v-model="accMotel"
            data-test="cb-form-accMotel"
            :readonly="reviewMode"
            label="Worker's Lodging Location (Motel, hotel, or other lodging)"
          ></v-checkbox>
          <div v-if="accMotel">
            <v-row>
              <v-col cols="12" sm="6" lg="5">
                <label>Name</label>
                <v-text-field
                  v-model="motelName"
                  data-test="text-form-motelName"
                  dense
                  flat
                  outlined
                  solo
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6" lg="5">
                <label>Address line 1</label>
                <v-text-field
                  v-model="motelAddressLine1"
                  data-test="text-form-motelAddressLine1"
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
                  data-test="text-form-motelAddressLine2"
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
                  :rules="motelAddressProvinceRules"
                  :items="provinces"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="3" lg="2">
                <label>Postal Code</label>
                <v-text-field
                  v-model="motelPostalCode"
                  data-test="text-form-motelPostalCode"
                  :rules="motelPostalCodeRules"
                  dense
                  flat
                  outlined
                  solo
                />
              </v-col>
            </v-row>
          </div>

          <v-checkbox
            v-model="accWorkersHome"
            data-test="cb-form-accWorkersHome"
            :readonly="reviewMode"
            label="Worker's home in community"
          ></v-checkbox>
        </v-container>
      </template>

      <template v-if="formVersionId != 1">

        <BaseImportantCard class="mt-6 hide-on-review ">
          <span>Important: Please include all employer-provided housing locations, including locations that may not be ready for an inspection. If your Business address entered above is also an housing location, please re-enter it here. If you have more than one housing location, enter them into the 'Additional Locations' input box below.</span>
        </BaseImportantCard>

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
          <hr class="mb-10" />
          <v-row>
            <v-col cols="12" lg="10">
              <label>Additional Locations:</label>
              <v-textarea v-model="motelAdditional" dense flat outlined solo />
            </v-col>
          </v-row>
        </v-container>
      </template>
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
import CityLookup from '@/components/common/CityLookup.vue';
import OrgBookSearch from '@/components/common/OrgBookSearch.vue';
import Vue from 'vue';

export default {
  name: 'FarmStep1',
  props: {
    reviewMode: Boolean,
  },
  components: {
    CityLookup,
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
        'YT',
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

      motelAddressLine1Rules: [
        (v) => !!v || 'Accommodation address is required',
        (v) =>
          !v || v.length <= 255 || 'Address must be 255 characters or less',
      ],
      motelAddressLine2Rules: [
        (v) =>
          !v || v.length <= 255 || 'Address must be 255 characters or less',
      ],
      motelCityRules: [
        (v) => !!v || 'Accommodation city is required',
        (v) => !v || v.length <= 255 || 'City must be 255 characters or less',
      ],
      motelAddressProvinceRules: [
        (v) => !!v || 'Accommodation Province is required'
      ],
      motelPostalCodeRules: [
        (v) => !!v || 'Postal code is required',
        (v) => !v || v.length <= 7 || ' enter a valid postal code',
      ],
    };
  },
  computed: {
    ...mapGetters('farmOpScreeningForm', [
      'business',
      'primaryContact',
      'location',
      'covidContact',
      'formVersionId',
    ]),

    // Business
    businessName: {
      get() {
        return this.business.name;
      },
      set(value) {
        this.updateBusiness({ ['name']: value });
      },
    },
    businessAddressLine1: {
      get() {
        return this.business.addressLine1;
      },
      set(value) {
        this.updateBusiness({ ['addressLine1']: value });
      },
    },
    businessAddressLine2: {
      get() {
        return this.business.addressLine2;
      },
      set(value) {
        this.updateBusiness({ ['addressLine2']: value });
      },
    },
    businessAddressCity: {
      get() {
        return this.business.city;
      },
      set(value) {
        this.updateBusiness({ ['city']: value });
      },
    },
    businessAddressProvince: {
      get() {
        return this.business.province;
      },
      set(value) {
        this.updateBusiness({ ['province']: value });
      },
    },
    businessAddressPostalCode: {
      get() {
        return this.business.postalCode;
      },
      set(value) {
        this.updateBusiness({ ['postalCode']: value });
      },
    },

    // Contact
    firstName: {
      get() {
        return this.primaryContact.firstName;
      },
      set(value) {
        this.updatePrimaryContact({ ['firstName']: value });
      },
    },
    lastName: {
      get() {
        return this.primaryContact.lastName;
      },
      set(value) {
        this.updatePrimaryContact({ ['lastName']: value });
      },
    },
    phone1: {
      get() {
        return this.primaryContact.phone1;
      },
      set(value) {
        this.updatePrimaryContact({ ['phone1']: value });
      },
    },
    phone2: {
      get() {
        return this.primaryContact.phone2;
      },
      set(value) {
        this.updatePrimaryContact({ ['phone2']: value });
      },
    },
    email: {
      get() {
        return this.primaryContact.email;
      },
      set(value) {
        this.updatePrimaryContact({ ['email']: value });
      },
    },

    // COVID Coordinator
    covidFirstName: {
      get() {
        return this.covidContact.firstName;
      },
    },
    covidLastName: {
      get() {
        return this.covidContact.lastName;
      },
    },
    covidPhone1: {
      get() {
        return this.covidContact.phone1;
      },
    },
    covidPhone2: {
      get() {
        return this.covidContact.phone2;
      },
    },
    covidEmail: {
      get() {
        return this.covidContact.email;
      },
    },

    // Location
    startDate: {
      get() {
        return this.location.startDate;
      },
    },
    endDate: {
      get() {
        return this.location.endDate;
      },
    },
    locationCity: {
      get() {
        return this.location.city;
      },
    },
    cityLatitude: {
      get() {
        return this.location.cityLatitude;
      },
    },
    cityLongitude: {
      get() {
        return this.location.cityLongitude;
      },
    },
    numberOfWorkers: {
      get() {
        return this.location.numberOfWorkers
          ? this.location.numberOfWorkers.toString()
          : '';
      },
    },
    accTents: {
      get() {
        return this.location.accTents;
      },
    },
    tentDetails: {
      get() {
        return this.location.tentDetails;
      },
    },
    accMotel: {
      get() {
        return this.location.accMotel;
      },
    },
    motelName: {
      get() {
        return this.location.motelName;
      },
    },

    motelAddressLine1: {
      get() {
        return this.location.motelAddressLine1;
      },
      set(value) {
        this.updateLocation({ ['motelAddressLine1']: value });
      },
    },
    motelAddressLine2: {
      get() {
        return this.location.motelAddressLine2;
      },
      set(value) {
        this.updateLocation({ ['motelAddressLine2']: value });
      },
    },
    motelCity: {
      get() {
        return this.location.motelCity;
      },
      set(value) {
        this.updateLocation({ ['motelCity']: value });
      },
    },
    motelProvince: {
      get() {
        return this.location.motelProvince;
      },
      set(value) {
        this.updateLocation({ ['motelProvince']: value });
      },
    },
    motelPostalCode: {
      get() {
        return this.location.motelPostalCode;
      },
      set(value) {
        this.updateLocation({ ['motelPostalCode']: value });
      },
    },
    accWorkersHome: {
      get() {
        return this.location.accWorkersHome;
      },
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
    },
  },
  mounted() {
    if (!this.reviewMode) {
      // Once they've gotten to the form start (step 2) enable the typical "leave site" native browser warning
      // This gets disabled after form submit in step 6
      window.onbeforeunload = () => true;
    }
  },
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
