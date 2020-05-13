const config = require('config');
const rateLimit = require('express-rate-limit');
const router = require('express').Router();

const email = require('../../components/email');
const ipcPlanPdf = require('../../components/ipcPlanPdf');
const keycloak = require('../../components/keycloak');

const dataService = require('../../services/dataService');
const transformService = require('../../services/transformService');

const clientId = config.get('server.keycloak.clientId');

const ipcRateLimiter = rateLimit({
  windowMs: config.get('server.rateLimit.ipc.windowMs'),
  max: config.get('server.rateLimit.ipc.max')
});

router.post('/', ipcRateLimiter, async (req, res, next) => {
  try {
    const xform = transformService.apiToModel.postToIPCPlan(req.body);
    const result = await dataService.save(xform.business, xform.contacts, xform.ipcPlan, xform.location);
    const data = transformService.modelToAPI.ipcPlanToPost(result);
    email.sendReceipt({ confirmationNumber: data.confirmationId });
    return res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/pdf/:ipcPlanId', ipcRateLimiter, async (req, res, next) => {
  try {
    const result = await ipcPlanPdf.generate(req.params.ipcPlanId);
    ['Content-Disposition','Content-Type','Content-Length','Content-Transfer-Encoding'].forEach(h => {
      res.setHeader(h, result.headers[h.toLowerCase()]);
    });
    return res.send(result.data);
  } catch (err) {
    next(err);
  }
});

router.get('/', keycloak.protect(), async (req, res, next) => {
  try {
    if (req.query.meta) {
      const result = await dataService.getIPCPlansMeta();
      return res.status(200).json(transformService.transformIPCPlansMeta(result));
    } else {
      const result = await dataService.getIPCPlans();
      return res.status(200).json(transformService.modelToAPI.ipcPlansToPost(result));
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:ipcPlanId', keycloak.protect(), async (req, res, next) => {
  try {
    const result = await dataService.getIPCPlan(req.params.ipcPlanId);
    return res.status(200).json(transformService.modelToAPI.ipcPlanToPost(result));
  } catch (err) {
    next(err);
  }
});

router.get('/:ipcPlanId/status', keycloak.protect(`${clientId}:inspector`), async (req, res, next) => {
  try {
    const result = await dataService.getInspectionStatuses(req.params.ipcPlanId);
    return res.status(200).json(transformService.modelToAPI.inspectionStatuses(result));
  } catch (err) {
    next(err);
  }
});

router.post('/:ipcPlanId/status', keycloak.protect(`${clientId}:inspector`), async (req, res, next) => {
  try {
    const createdBy = req.kauth.grant.access_token.content.preferred_username;
    // the saveInspectionStatus can add a note to the inspection status if the req.body has a note field...
    const result = await dataService.saveInspectionStatus(req.params.ipcPlanId, createdBy, req.body);
    return res.status(201).json(transformService.modelToAPI.inspectionStatus(result));
  } catch (err) {
    next(err);
  }
});

router.get('/:ipcPlanId/notes', keycloak.protect(`${clientId}:inspector`), async (req, res, next) => {
  try {
    const result = await dataService.getNotes(req.params.ipcPlanId);
    return res.status(200).json(transformService.modelToAPI.notes(result));
  } catch (err) {
    next(err);
  }
});

router.post('/:ipcPlanId/notes', keycloak.protect(`${clientId}:inspector`), async (req, res, next) => {
  try {
    const createdBy = req.kauth.grant.access_token.content.preferred_username;
    const result = await dataService.saveNote(req.params.ipcPlanId, createdBy, req.body);
    return res.status(201).json(transformService.modelToAPI.note(result));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
