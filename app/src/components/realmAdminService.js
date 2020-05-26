const config = require('config');
const { Issuer } = require('openid-client');
const KeycloakAdminClient = require('keycloak-admin').default;
const log = require('npmlog');

const baseUrl = config.get('server.keycloak.serverUrl');
const realm = config.get('server.keycloak.realm');
const username = config.get('server.keycloak.adminClientId');
const password = config.get('server.keycloak.adminClientSecret');

const issuerUrl = `${baseUrl}/realms/${realm}`;
const grantType = 'client_credentials';


const realmAdminService = new KeycloakAdminClient({
  baseUrl: baseUrl,
  realmName: realm
});

let initialized = false;
let keycloakIssuer;
let client;
let tokenSet;

const initialize = async () => {
  if (!initialized) {
    // try to do a straight initialization of the client with configured credentials.
    // service should be good to go right away.
    try {
      await realmAdminService.auth({
        grantType: grantType,
        clientId: username,
        clientSecret: password
      });
    } catch (err) {
      log.error('RealmAdminService.initialize', `Error during authorization of service credentials: ${err.message}`);
      return false;
    }
    //
    // now, get set up so we can keep refreshing the token for realm admin service...
    //
    try {
      keycloakIssuer = await Issuer.discover(issuerUrl);
    } catch (err) {
      log.error('RealmAdminService.initialize', `Error during discovery of issuer: ${err.message}`);
      return false;
    }
    try {
      client = new keycloakIssuer.Client({
        client_id: username,
        client_secret: password
      });
    } catch (err) {
      log.error('RealmAdminService.initialize', `Error creating client: ${err.message}`);
      return false;
    }
    try {
      tokenSet = await client.grant({
        grant_type: grantType,
        client_id: username,
        client_secret: password
      });
    } catch (err) {
      log.error('RealmAdminService.initialize', `Error getting tokens: ${err.message}`);
      return false;
    }
    initialized = true;
  }
  return initialized;
};


const flattenGroupsByPrefix = (groups, prefix, list) => {
  if (Array.isArray(groups) && groups.length) {
    groups.forEach(g => {
      if (g.name.startsWith(prefix)) {
        list.push( {
          id: g.id,
          name: g.name,
          shortName: g.name.substring(prefix.length + 1)
        });
        return;
      } else {
        return flattenGroupsByPrefix(g.subGroups, prefix, list);
      }
    });
  } else {
    return;
  }
};

const trimUserData = (data) => {
  const trim = u => {
    // only return id, username, firstName, lastName, email
    return (({ id, username, firstName, lastName, email }) => ({ id, username, firstName, lastName, email }))(u);
  };
  if (Array.isArray(data)) {
    return data.map(u => trim(u));
  }
  return trim(data);
};

const refreshToken = () => setInterval(async () => {
  // just in case we didn't go through the initialization phase.
  if (!initialized) {
    await initialize();
  }
  const refreshToken = tokenSet.refresh_token;
  tokenSet = await client.refresh(refreshToken);
  realmAdminService.setAccessToken(tokenSet.access_token);
}, 58 * 1000); // 58 seconds

// keep polling and refreshing the token
refreshToken();



module.exports.initialize = initialize;
module.exports.realmAdminService = realmAdminService;
module.exports.utils = {
  flattenGroupsByPrefix: flattenGroupsByPrefix,
  trimUserData: trimUserData
};
