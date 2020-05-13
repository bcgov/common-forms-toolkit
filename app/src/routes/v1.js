const router = require('express').Router();

const emailRouter = require('./v1/email');
const ipcRouter = require('./v1/ipc');

/** Base v1 Responder */
router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: ['/email', '/ipc']
  });
});

/** Email Router */
router.use('/email', emailRouter);

/** IPC Router */
router.use('/ipc', ipcRouter);

module.exports = router;
