module.exports = (sequelize, DataTypes) => {
  const InspectionStatus = sequelize.define('InspectionStatus', {
    inspectionStatusId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4
      }
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.STRING(255),
      unique: false
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING(30),
      unique: false,
      defaultValue: 'Submitted'
    },
    grade: {
      allowNull: true,
      type: DataTypes.STRING(120),
      unique: false
    },
    inspectorName: {
      allowNull: true,
      type: DataTypes.STRING(255),
      unique: false
    },
    inspectorEmail: {
      allowNull: true,
      type: DataTypes.STRING(255),
      unique: false
    },
    inspectionDate: {
      allowNull: true,
      type: DataTypes.DATE,
      unique: false
    },
    reasonsForDecision: {
      allowNull: true,
      type: DataTypes.STRING(4000),
      unique: false
    },
    guidancePlan: {
      allowNull: true,
      type: DataTypes.STRING(4000),
      unique: false
    }
  }, {
    tableName: 'inspection_status'
  });
  InspectionStatus.associate = models => {
    InspectionStatus.belongsTo(models.IPCPlan, {
      foreignKey: 'ipcPlanId'
    });
  };
  return InspectionStatus;
};
