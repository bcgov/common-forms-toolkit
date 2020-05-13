module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    locationId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4
      }
    },
    startDate: {
      allowNull: true,
      type: DataTypes.DATE
    },
    endDate: {
      allowNull: true,
      type: DataTypes.DATE
    },
    addressLine1: {
      allowNull: true,
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
      allowNull: true,
      comment: 'City name',
      type: DataTypes.STRING(255),
      unique: false
    },
    cityLatitude: {
      allowNull: true,
      comment: 'Latitude coordinate of city',
      type: DataTypes.NUMERIC(10,7),
      unique: false
    },
    cityLongitude: {
      allowNull: true,
      comment: 'Longitude coordinate of city',
      type: DataTypes.NUMERIC(10,7),
      unique: false
    },
    province: {
      allowNull: true,
      comment: 'Province',
      type: DataTypes.STRING(30),
      unique: false
    },
    postalCode: {
      allowNull: true,
      comment: 'Postal code',
      type: DataTypes.STRING(30),
      unique: false
    },
    accTents: {
      allowNull: false,
      comment: 'Tent Accommodations',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    tentDetails: {
      allowNull: true,
      comment: 'Tent Details',
      type: DataTypes.STRING(255),
      unique: false
    },
    accMotel: {
      allowNull: false,
      comment: 'Motel Accommodations',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    motelName: {
      allowNull: true,
      comment: 'Motel name',
      type: DataTypes.STRING(255),
      unique: false
    },
    motelAddressLine1: {
      allowNull: true,
      comment: 'Address line 1',
      type: DataTypes.STRING(255),
      unique: false
    },
    motelAddressLine2: {
      allowNull: true,
      comment: 'Address line 2',
      type: DataTypes.STRING(255),
      unique: false
    },
    motelCity: {
      allowNull: true,
      comment: 'City name',
      type: DataTypes.STRING(255),
      unique: false
    },
    motelProvince: {
      allowNull: true,
      comment: 'Province',
      type: DataTypes.STRING(30),
      unique: false
    },
    motelPostalCode: {
      allowNull: true,
      comment: 'Postal code',
      type: DataTypes.STRING(30),
      unique: false
    },
    accWorkersHome: {
      allowNull: true,
      comment: 'Worker/Home Accommodations',
      type: DataTypes.BOOLEAN,
      unique: false
    },
    licencees: {
      allowNull: true,
      comment: 'Name of licencee(s) (free text)',
      type: DataTypes.STRING(1000),
      unique: false
    },
    numberOfWorkers: {
      allowNull: true,
      comment: 'Number (integer) of workers working at the location',
      type: DataTypes.INTEGER,
      unique: false
    }
  },
  {
    comment: 'List of all locations',
    tableName: 'location'
  });
  Location.associate = models => {
    Location.belongsTo(models.IPCPlan, {
      foreignKey: 'ipcPlanId'
    });
  };
  return Location;
};
