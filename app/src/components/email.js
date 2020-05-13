const axios = require('axios');
const config = require('config');
const fs = require('fs');
const log = require('npmlog');

const utils = require('./utils');

const apiEndpoint = config.get('serviceClient.commonServices.ches.endpoint');
const tokenEndpoint = config.get('serviceClient.commonServices.tokenEndpoint');
const username = config.get('serviceClient.commonServices.username');
const password = config.get('serviceClient.commonServices.password');

const emailBody = fs.readFileSync('src/assets/silvIPC_emailTemplate.html', 'utf8');

const email = {
  /**
   * @function sendReceipt
   * Sends an email receipt through CHES
   * @param {object} context A freeform key-value pair object
   */
  sendReceipt: async context => {
    if (config.has('server.emailRecipients')) {
      log.verbose('email.sendReceipt', 'server.emailRecipients exists - sending email notification');
      const recipients = config.get('server.emailRecipients');

      try {
        context.messageLinkText = 'Please login to view the details of this Silviculture and Planting Operator IPC Attestation';
        context.messageLinkUrl = 'https://silvicultureoperatorscreening.gov.bc.ca/app/#/admin';

        const token = await utils.getKeyCloakToken(username, password, tokenEndpoint);
        const response = await axios.post(apiEndpoint + '/v1/emailMerge', {
          body: emailBody,
          bodyType: 'html',
          contexts: [
            {
              context: context,
              to: recipients.split(',').filter(r => r),
            }
          ],
          from: 'FP.Engagement@gov.bc.ca',
          priority: 'normal',
          subject: 'Silviculture IPC Form Accepted'
        }, {
          headers: { Authorization: `Bearer ${token.access_token}` }
        });

        if (response.status == 201) {
          return response.data;
        } else {
          throw new Error(`Error from POST to CHES. Response Code: ${response.status}`);
        }
      } catch (error) {
        log.error('email.sendRequest', error.message);
        // throw new Error(`Error calling email endpoint. Error: ${error.message}`);
      }
    }
  },

  /**
   * @function sendReceiptRequest
   * Sends an email receipt request through CHES to the sender
   * @param {string} ipcPlanId The sender's ipcPlanId confirmation uuid
   * @param {string} to The sender's target email address
   */
  sendReceiptRequest: async (ipcPlanId, to) => {
    try {
      const token = await utils.getKeyCloakToken(username, password, tokenEndpoint);
      const response = await axios.post(apiEndpoint + '/v1/emailMerge', {
        body: emailBody,
        bodyType: 'html',
        contexts: [
          {
            context: {
              confirmationNumber: ipcPlanId.split('-')[0].toUpperCase(),
              messageLinkText: 'Download PDF Receipt',
              messageLinkUrl: `https://silvicultureoperatorscreening.gov.bc.ca/app/api/v1/ipc/pdf/${ipcPlanId}`
            },
            to: [to]
          }
        ],
        from: 'FP.Engagement@gov.bc.ca',
        priority: 'normal',
        subject: 'Silviculture IPC Form Receipt'
      }, {
        headers: { Authorization: `Bearer ${token.access_token}` }
      });

      if (response.status == 201) {
        return response.data;
      } else {
        throw new Error(`Error from POST to CHES. Response Code: ${response.status}`);
      }
    } catch (error) {
      log.error('email.sendRequest', error.message);
      throw new Error(`Error calling email endpoint. Error: ${error.message}`);
    }
  },
};

module.exports = email;
