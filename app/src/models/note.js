module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    noteId: {
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
    note: {
      allowNull: false,
      type: DataTypes.STRING(4000),
      unique: false
    },
  },
  {
    comment: 'List of all notes',
    tableName: 'note'
  });
  Note.associate = models => {
    Note.belongsTo(models.IPCPlan, {
      foreignKey: 'ipcPlanId'
    });
    Note.belongsTo(models.InspectionStatus, {
      foreignKey: {
        name: 'inspectionStatusId',
        allowNull: true
      }
    });
  };
  return Note;
};
