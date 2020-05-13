module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    contactId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4
      }
    },
    contactType: {
      allowNull: false,
      comment: 'Contact type',
      type: DataTypes.STRING(30),
      unique: false
    },
    firstName: {
      allowNull: false,
      comment: 'Contact first name',
      type: DataTypes.STRING(120),
      unique: false
    },
    lastName: {
      allowNull: false,
      comment: 'Contact last name',
      type: DataTypes.STRING(120),
      unique: false
    },
    phone1: {
      allowNull: true,
      comment: 'Contact primary phone',
      type: DataTypes.STRING(30),
      unique: false
    },
    phone2: {
      allowNull: true,
      comment: 'Contact secondary phone',
      type: DataTypes.STRING(30),
      unique: false
    },
    email: {
      allowNull: true,
      comment: 'Contact email address',
      type: DataTypes.STRING(255),
      unique: false
    }
  }, {
    comment: 'List of all contacts',
    tableName: 'contact'
  });
  Contact.associate = models => {
    Contact.belongsTo(models.IPCPlan, {
      foreignKey: 'ipcPlanId'
    });
  };
  return Contact;
};
