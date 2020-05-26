const constants = require('./constants');
const middleware = require('./middleware');
const routes = require('./routes');
const teamRoutes = require('./team/routes');
// slug will be the paths.
module.exports.mount = (app) => {
  const p = `/${constants.SLUG}`;
  app.use(p, routes);
  app.use(`${p}/team`, middleware.checkRole(['admin']), teamRoutes);
  app.use(middleware.dataErrors);
  return p;
};
