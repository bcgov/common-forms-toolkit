const routes = require('express').Router();

const controller = require('./controller');

routes.get('/realmUsers', async (req, res, next) => {
  await controller.realmUsers(req, res, next);
});

routes.get('/realmUsers/:userId', async (req, res, next) => {
  await controller.readRealmUser(req, res, next);
});

routes.get('/groups', async (req, res, next) => {
  await controller.readGroups(req, res, next);
});

routes.get('/groups/:groupId', async (req, res, next) => {
  await controller.readGroup(req, res, next);
});

routes.get('/groups/:groupId/users', async (req, res, next) => {
  await controller.readGroupUsers(req, res, next);
});

routes.put('/groups/:groupId/users', async (req, res, next) => {
  await controller.updateGroupUsers(req, res, next);
});

routes.get('/users', async (req, res, next) => {
  await controller.readTeamUsers(req, res, next);
});

routes.get('/users/:userId', async (req, res, next) => {
  await controller.readTeamUser(req, res, next);
});

routes.get('/users/:userId/groups', async (req, res, next) => {
  await controller.readTeamUserGroups(req, res, next);
});

routes.put('/users/:userId/groups', async (req, res, next) => {
  await controller.updateTeamUserGroups(req, res, next);
});


module.exports = routes;
