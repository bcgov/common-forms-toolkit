module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    businessId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4
      }
    },
    name: {
      allowNull: false,
      comment: 'The business name',
      type: DataTypes.STRING(255),
      unique: false
    },
    addressLine1: {
      allowNull: false,
      comment: 'Address line 1',
      type: DataTypes.STRING(255),
      unique: false
    },
    addressLine2: {
      allowNull: true,
      comment: 'Address line 2',
      type: DataTypes.STRING(255),
      unique: false
    },
    city: {
      allowNull: false,
      comment: 'City name',
      type: DataTypes.STRING(255),
      unique: false
    },
    province: {
      allowNull: false,
      comment: 'Province',
      type: DataTypes.STRING(30),
      unique: false
    },
    postalCode: {
      allowNull: false,
      comment: 'Postal code',
      type: DataTypes.STRING(30),
      unique: false
    }
  }, {
    comment: 'List of all businesses',
    tableName: 'business'
  });
  Business.associate = models => {
    Business.belongsTo(models.IPCPlan, {
      foreignKey: 'ipcPlanId'
    });
  };
  return Business;
};
