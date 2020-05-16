const routes = require('express').Router();

const controller = require('./controller');

routes.get('/', async (req, res, next) => {
  await controller.read(req, res, next);
});

routes.get('/current', async (req, res, next) => {
  await controller.current(req, res, next);
});

routes.post('/', async (req, res, next) => {
  await controller.create(req, res, next);
});

routes.get('/submissions', async (req, res, next) => {
  await controller.allSubmissions(req, res, next);
});

routes.post('/submissions', async (req, res, next) => {
  await controller.createSubmission(req, res, next);
});

routes.put('/submissions/:submissionId', async (req, res, next) => {
  await controller.updateSubmission(req, res, next);
});

routes.get('/submissions/:submissionId', async (req, res, next) => {
  await controller.readSubmission(req, res, next);
});

routes.post('/submissions/:submissionId/statuses', async (req, res, next) => {
  await controller.createSubmissionStatus(req, res, next);
});

routes.get('/submissions/:submissionId/statuses', async (req, res, next) => {
  await controller.readSubmissionStatuses(req, res, next);
});

routes.post('/submissions/:submissionId/statuses/:statusId/notes', async (req, res, next) => {
  await controller.createSubmissionStatusNote(req, res, next);
});

routes.get('/submissions/:submissionId/statuses/:statusId/notes', async (req, res, next) => {
  await controller.readSubmissionStatusNotes(req, res, next);
});

routes.post('/submissions/:submissionId/notes', async (req, res, next) => {
  await controller.createSubmissionNote(req, res, next);
});

routes.get('/submissions/:submissionId/notes', async (req, res, next) => {
  await controller.readSubmissionNotes(req, res, next);
});


module.exports = routes;
