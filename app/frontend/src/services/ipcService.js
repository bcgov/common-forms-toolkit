import { appAxios } from '@/services/interceptors';
import { ApiRoutes } from '@/utils/constants';

export default {
  /**
   * @function getAllIPCData
   * Fetch the contents of all IPC form submissions
   * @returns {Promise} An axios response
   */
  getAllIPCData() {
    return appAxios().get(ApiRoutes.IPC);
  },

  /**
   * @function getAllIPCMetaData
   * Fetch only the basic meta data of all IPC form submissions
   * @returns {Promise} An axios response
   */
  getAllIPCMetaData() {
    return appAxios().get(ApiRoutes.IPC, { params: { meta: true } });
  },

  /**
   * @function sendIPCContent
   * Sends an IPC form submission
   * @param {object} content An object with business, contacts and ipcPlan attributes
   * @returns {Promise} An axios response
   */
  sendIPCContent(content) {
    return appAxios().post(ApiRoutes.IPC, content);
  },

  /**
   * @function getIPCContent
   * Fetch the contents of a single IPC form submission
   * @param {string} ipcPlanId the guid of a submitted ipcplan from the database
   * @returns {Promise} An axios response
   */
  getIPCContent(ipcPlanId) {
    return appAxios().get(`${ApiRoutes.IPC}/${ipcPlanId}`);
  },

  /**
   * @function getIPCInspectionStatuses
   * Fetch the inspection statuses of a specific IPC form submission
   * @param {string} ipcPlanId The guid of a submitted ipcplan from the database
   * @returns {Promise} An axios response
   */
  getIPCInspectionStatuses(ipcPlanId) {
    return appAxios().get(`${ApiRoutes.IPC}/${ipcPlanId}/status`);
  },

  /**
   * @function sendIPCInspectionStatuses
   * Update the inspection statuses of a specific IPC form submission
   * @param {string} ipcPlanId The guid of a submitted ipcplan from the database
   * @param {object} content An object representing the updated status for the `ipcPlanId` form
   * @returns {Promise} An axios response
   */
  sendIPCInspectionStatuses(ipcPlanId, content) {
    return appAxios().post(`${ApiRoutes.IPC}/${ipcPlanId}/status`, content);
  },

  /**
   * @function getNotes
   * Fetch the notes of a specific IPC form submission
   * @param {string} ipcPlanId The guid of a submitted ipcplan from the database
   * @returns {Promise} An axios response
   */
  getNotes(ipcPlanId) {
    return appAxios().get(`${ApiRoutes.IPC}/${ipcPlanId}/notes`);
  },

  /**
   * @function addNote
   * Add a note of a specific IPC form submission
   * @param {string} ipcPlanId The guid of a submitted ipcplan from the database
   * @param {object} content An object representing the note
   * @returns {Promise} An axios response
   */
  addNote(ipcPlanId, content) {
    return appAxios().post(`${ApiRoutes.IPC}/${ipcPlanId}/notes`, content);
  },

};
