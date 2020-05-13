const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const dbConfig = require(__dirname + '/../../config/database.js');
const db = {};

const sequelize = new Sequelize(dbConfig);

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.isNotFoundError = e => e && e instanceof Sequelize.EmptyResultError;
db.isSyntaxError = e => e && e instanceof Sequelize.DatabaseError && /syntax/.test(e.message);
db.isRequiredFieldError = e => e && e instanceof Sequelize.ValidationError && /notNull/.test(e.message);
db.isRequiredFieldErrorMessage = e => db.isRequiredFieldError(e) ? e.message.split(':')[1] : '';

module.exports = db;
