module.exports = {
  ...require('../../common/middleware'),
  ...require('../../files/middleware/upload'),
  ...require('./searchParameters')
};
