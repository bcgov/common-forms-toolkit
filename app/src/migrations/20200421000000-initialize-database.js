module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable('ipc_plan', {
          ipcPlanId: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID,
            validate: {
              isUUID: 4
            }
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE
          },
          notes: {
            allowNull: true,
            comment: '',
            type: Sequelize.STRING(4000),
            unique: false
          },
          guidelinesRead: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          assessmentCompleted: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          developedPlan: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          protectionSignage: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          workerContactPersonnel: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          commonAreaDistancing: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          sleepingAreaType: {
            allowNull: false,
            comment: 'Sleeping Area Type',
            type: Sequelize.INTEGER,
            unique: false
          },
          sharedSleepingPerRoom: {
            allowNull: false,
            comment: 'Workers sleeping per room',
            type: Sequelize.INTEGER,
            unique: false
          },
          sharedSleepingDistancing: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          selfIsolateUnderstood: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          selfIsolateAccommodation: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          laundryServices: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          wasteManagementGloves: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          wasteManagementSchedule: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          wasteManagementBags: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          handWashingStations: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          handWashingSoapWater: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          handWashingWaterless: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          handWashingPaperTowels: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          handWashingSignage: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          distancingSleepingBarriers: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          distancingFaceShields: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          disinfectingSchedule: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          educationSignage: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          educationContactPersonnel: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          trainingCovid19: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          trainingEtiquette: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          trainingLocations: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          trainingFirstAid: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          trainingReporting: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          mealsDistancing: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          mealsDishware: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          mealsDishwashing: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          infectionSeparation: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          infectionSymptoms: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          infectionHeathLinkBC: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          infectionSanitization: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          infectionAccommodation: {
            allowNull: true,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          infectedFeeding: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          infectedHousekeeping: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          infectedWaste: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          certifyAccurateInformation: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          agreeToInspection: {
            allowNull: false,
            comment: '',
            type: Sequelize.BOOLEAN,
            unique: false
          }
        }, {
          comment: 'List of all IPC plan answers',
          transaction: t
        }),
        queryInterface.createTable('business', {
          businessId: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE
          },
          ipcPlanId: {
            allowNull: false,
            comment: 'Associated ICP Plan id',
            type: Sequelize.UUID,
            references: {
              model: 'ipc_plan',
              key: 'ipcPlanId'
            }
          },
          name: {
            allowNull: false,
            comment: 'The business name',
            type: Sequelize.STRING(255),
            unique: false
          },
          addressLine1: {
            allowNull: false,
            comment: 'Address line 1',
            type: Sequelize.STRING(255),
            unique: false
          },
          addressLine2: {
            allowNull: true,
            comment: 'Address line 2',
            type: Sequelize.STRING(255),
            unique: false
          },
          city: {
            allowNull: false,
            comment: 'City name',
            type: Sequelize.STRING(255),
            unique: false
          },
          province: {
            allowNull: false,
            comment: 'Province',
            type: Sequelize.STRING(30),
            unique: false
          },
          postalCode: {
            allowNull: false,
            comment: 'Postal code',
            type: Sequelize.STRING(30),
            unique: false
          }
        },{
          comment: 'List of all businesses',
          transaction: t
        }),
        queryInterface.createTable('contact', {
          contactId: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
          },
          ipcPlanId: {
            allowNull: false,
            comment: 'Associated ICP Plan id',
            type: Sequelize.UUID,
            references: {
              model: 'ipc_plan',
              key: 'ipcPlanId'
            }
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE
          },
          contactType: {
            allowNull: false,
            comment: 'Contact type',
            type: Sequelize.STRING(30),
            unique: false
          },
          firstName: {
            allowNull: false,
            comment: 'Contact first name',
            type: Sequelize.STRING(120),
            unique: false
          },
          lastName: {
            allowNull: false,
            comment: 'Contact last name',
            type: Sequelize.STRING(120),
            unique: false
          },
          phone1: {
            allowNull: false,
            comment: 'Contact primary phone',
            type: Sequelize.STRING(30),
            unique: false
          },
          phone2: {
            allowNull: true,
            comment: 'Contact secondary phone',
            type: Sequelize.STRING(30),
            unique: false
          },
          email: {
            allowNull: false,
            comment: 'Contact email address',
            type: Sequelize.STRING(255),
            unique: false
          }
        }, {
          comment: 'List of all contacts',
          transaction: t
        }),
        queryInterface.createTable('location', {
          locationId: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE
          },
          ipcPlanId: {
            allowNull: false,
            comment: 'Associated ICP Plan id',
            type: Sequelize.UUID,
            references: {
              model: 'ipc_plan',
              key: 'ipcPlanId'
            }
          },
          startDate: {
            allowNull: false,
            type: Sequelize.DATE
          },
          endDate: {
            allowNull: false,
            type: Sequelize.DATE
          },
          addressLine1: {
            allowNull: false,
            type: Sequelize.STRING(255),
            unique: false
          },
          addressLine2: {
            allowNull: true,
            type: Sequelize.STRING(255),
            unique: false
          },
          city: {
            allowNull: false,
            type: Sequelize.STRING(255),
            unique: false
          },
          province: {
            allowNull: false,
            type: Sequelize.STRING(30),
            unique: false
          },
          postalCode: {
            allowNull: false,
            type: Sequelize.STRING(30),
            unique: false
          },
          accTents: {
            allowNull: false,
            comment: 'Tent Accommodations',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          tentDetails: {
            allowNull: true,
            comment: 'Tent Details',
            type: Sequelize.STRING(255),
            unique: false
          },
          accMotel: {
            allowNull: false,
            comment: 'Motel Accommodations',
            type: Sequelize.BOOLEAN,
            unique: false
          },
          motelName: {
            allowNull: true,
            type: Sequelize.STRING(255),
            unique: false
          },
          motelAddressLine1: {
            allowNull: true,
            type: Sequelize.STRING(255),
            unique: false
          },
          motelAddressLine2: {
            allowNull: true,
            type: Sequelize.STRING(255),
            unique: false
          },
          motelCity: {
            allowNull: true,
            type: Sequelize.STRING(255),
            unique: false
          },
          motelProvince: {
            allowNull: true,
            type: Sequelize.STRING(30),
            unique: false
          },
          motelPostalCode: {
            allowNull: true,
            type: Sequelize.STRING(30),
            unique: false
          },
          accWorkersHome: {
            allowNull: false,
            comment: 'Worker/Home Accommodations',
            type: Sequelize.BOOLEAN,
            unique: false
          }
        },{
          comment: 'List of all locations',
          transaction: t
        })
      ]);
    });
  },

  down: queryInterface => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('location', {
          transaction: t
        }),
        queryInterface.dropTable('contact', {
          transaction: t
        }),
        queryInterface.dropTable('business', {
          transaction: t
        }),
        queryInterface.dropTable('ipc_plan', {
          transaction: t
        })
      ]);
    });
  }
};
