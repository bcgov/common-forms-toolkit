const path = require('path');
const cdogsService = require('./cdogsService');
const dataService = require('../services/dataService');
const transformService = require('../services/transformService');

const templateJson = require('../assets/silviculture-ipc-template-b.json');

module.exports = {
  generate: async ipcPlanId => {
    const docx = path.join(__dirname, '..', 'assets', 'silviculture-ipc-template-j.docx');

    let templateId = await cdogsService.getHash(docx);
    const templateResult = await cdogsService.getTemplate(templateId);
    if (templateResult.status !== 200) {
      const uploadResult = await cdogsService.uploadTemplate(docx);
      templateId = uploadResult.data;
    }

    // ok, have the template... get the data and create the document...
    const ipcPlan = await dataService.getIPCPlan(ipcPlanId);
    const ipcPlanData = transformService.modelToAPI.ipcPlanToPost(ipcPlan);

    const body = { ...templateJson };
    body.data = { ...ipcPlanData };

    return await cdogsService.templateRender(templateId, body);
  }
};
