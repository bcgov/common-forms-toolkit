module.exports = (sequelize, DataTypes) => {
  const IPCPlan = sequelize.define('IPCPlan', {
    ipcPlanId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4
      }
    },
    notes: {
      allowNull: true,
      comment: '',
      type: DataTypes.STRING(4000),
      unique: false
    },
    guidelinesRead: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    assessmentCompleted: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    developedPlan: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    protectionSignage: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    workerContactPersonnel: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    commonAreaDistancing: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    sleepingAreaType: {
      allowNull: false,
      comment: 'Sleeping Area Type',
      type: DataTypes.INTEGER,
      unique: false
    },
    sharedSleepingPerRoom: {
      allowNull: false,
      comment: 'Workers sleeping per room',
      type: DataTypes.INTEGER,
      unique: false
    },
    sharedSleepingDistancing: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    selfIsolateUnderstood: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    selfIsolateAccommodation: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    laundryServices: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    wasteManagementGloves: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    wasteManagementSchedule: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    wasteManagementBags: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    handWashingStations: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    handWashingSoapWater: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    handWashingWaterless: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    handWashingPaperTowels: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    handWashingSignage: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    distancingMaintained: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    distancingFaceShields: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    disinfectingSchedule: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    educationSignage: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    educationContactPersonnel: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    trainingCovid19: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    trainingEtiquette: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    trainingLocations: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    trainingFirstAid: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    trainingReporting: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    mealsDistancing: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    mealsDishware: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    mealsDishwashing: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    infectionSeparation: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    infectionSymptoms: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    infectionHeathLinkBC: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    infectionSanitization: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    infectionAccommodation: {
      allowNull: true,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    infectedFeeding: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    infectedHousekeeping: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    infectedWaste: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    certifyAccurateInformation: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    agreeToInspection: {
      allowNull: false,
      comment: '',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    formVersion: {
      allowNull: false,
      comment: 'Version of form used to populate this plan',
      type: DataTypes.STRING(30),
      unique: false,
      defaultValue: '1.0.0'
    }
  }, {
    comment: 'List of all IPC plan answers',
    tableName: 'ipc_plan'
  });
  IPCPlan.associate = models => {
    IPCPlan.hasOne(models.Business, {
      foreignKey: 'ipcPlanId'
    });
    IPCPlan.hasMany(models.Contact, {
      foreignKey: 'ipcPlanId'
    });
    IPCPlan.hasMany(models.InspectionStatus, {
      foreignKey: 'ipcPlanId'
    });
    IPCPlan.hasMany(models.Note, {
      foreignKey: 'ipcPlanId'
    });
    IPCPlan.hasOne(models.Location, {
      foreignKey: 'ipcPlanId'
    });
  };
  return IPCPlan;
};
