const emailRouter = require('express').Router();
const Problem = require('api-problem');

const email = require('../../components/email');
const validation = require('../../middleware/validation');

emailRouter.post('/', validation.validateEmail, async (req, res) => {
  try {
    const result = await email.sendReceiptRequest(req.body.ipcPlanId, req.body.to);
    return res.status(201).json(result);
  } catch (error) {
    return new Problem(500, { detail: error.message }).send(res);
  }
});

module.exports = emailRouter;
