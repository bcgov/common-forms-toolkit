# Application on Openshift

This application is deployed on Openshift. This readme will outline how to setup and configure an Openshift project to get the application to a deployable state. This document assumes a working knowledge of Kubernetes/Openshift container orchestration concepts (i.e. buildconfigs, deployconfigs, imagestreams, secrets, configmaps, routes, networksecuritypolicies, etc)

Our builds and deployments are orchestrated with Jenkins. Refer to [Jenkinsfile](../Jenkinsfile) and [Jenkinsfile.cicd](../Jenkinsfile.cicd) to see how the Openshift templates are used for building and deploying in our CI/CD pipeline.

## Table of Contents

- [Environment Setup - ConfigMaps and Secrets](#environment-setup---configmaps-and-secrets)
- [Build Config & Deployment](#build-config--deployment)
- [Templates](#templates)
- [Pull Request Cleanup](#pull-request-cleanup)
- [Appendix - Supporting Deployments](#appendix---supporting-deployments)

## Environment Setup - ConfigMaps and Secrets

There are some requirements in the target Openshift namespace/project which are **outside** of the CI/CD pipeline process. This application requires that a few Secrets as well as Config Maps are already present in the environment before it is able to function as intended. Otherwise the Jenkins pipeline will fail the deployment by design.

In order to prepare an environment, you will need to ensure that all of the following configmaps and secrets are populated. This is achieved by executing the following commands as a project administrator of the targeted environment. Note that this must be repeated on *each* of the target deployment namespace/projects (i.e. `dev`, `test` and `prod`) as that they are independent of each other. Deployments will fail otherwise. Refer to [custom-environment-variables](../app/config/custom-environment-variables.json) for the direct mapping of environment variables to the app.

### Config Maps

*Note:* Replace anything in angle brackets with the appropriate value!

```sh
export NAMESPACE=<yournamespace>
export APP_NAME=<yourappshortname>

oc create -n $NAMESPACE configmap $APP_NAME-frontend-config \
  --from-literal=FRONTEND_APIPATH=api/v1 \
  --from-literal=FRONTEND_BASEPATH=/app \
  --from-literal=FRONTEND_ENV=dev \
  --from-literal=FRONTEND_KC_REALM=cp1qly2d \
  --from-literal=FRONTEND_KC_SERVERURL=https://sso-dev.pathfinder.gov.bc.ca/auth
```

```sh
oc create -n $NAMESPACE configmap $APP_NAME-sc-config \
  --from-literal=SC_CS_CHES_ENDPOINT=https://ches-master-9f0fbe-dev.pathfinder.gov.bc.ca/api \
  --from-literal=SC_CS_CDOGS_ENDPOINT=https://cdogs-master-idcqvl-dev.pathfinder.gov.bc.ca/api \
  --from-literal=SC_CS_TOKEN_ENDPOINT=https://sso-dev.pathfinder.gov.bc.ca/auth/realms/jbd6rnxw/protocol/openid-connect/token
```

```sh
oc create -n $NAMESPACE configmap $APP_NAME-server-config \
  --from-literal=SERVER_APIPATH=/api/v1 \
  --from-literal=SERVER_BASEPATH=/app \
  --from-literal=SERVER_BODYLIMIT=30mb \
  --from-literal=SERVER_KC_REALM=cp1qly2d \
  --from-literal=SERVER_KC_SERVERURL=https://sso-dev.pathfinder.gov.bc.ca/auth \
  --from-literal=SERVER_LOGLEVEL=info \
  --from-literal=SERVER_MORGANFORMAT=combined \
  --from-literal=SERVER_PORT=8080
```

### Secrets

Replace anything in angle brackets with the appropriate value!

```sh
export NAMESPACE=<yournamespace>
export APP_NAME=<yourappshortname>

export username=<username>
export password=<password>

oc create -n $NAMESPACE secret generic $APP_NAME-keycloak-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=$username \
  --from-literal=password=$password
```

```sh
export username=<username>
export password=<password>

oc create -n $NAMESPACE secret generic $APP_NAME-sc-cs-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=$username \
  --from-literal=password=$password
```

This is the for Keycloak admin functionality, such as group, user and role management.  

```sh
export username=<username>
export password=<password>

oc create -n $NAMESPACE secret generic $APP_NAME-keycloak-admin-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=$username \
  --from-literal=password=$password
```

## Build Config & Deployment

This application is currently designed as a single application pod deployments. It will host a static frontend containing all of the Vue.js resources and assets, and a Node.js backend which serves the API that the frontend requires. We are currently leveraging Openshift Routes with path based filtering in order to forward incoming traffic to the right deployment service.

### Frontend

The frontend temporarily installs dependencies needed to generate the static assets that will appear in the `/app/frontend/dist` folder. These contents will be picked up by the application and hosted appropriately.

### Application

The backend is a standard [Node](https://nodejs.org)/[Express](https://expressjs.com) server. It handles the JWT based authentication via OIDC authentication flow, and exposes the API to authorized users. This deployment container is built up on top of an Alpine Node image. The resulting container after build is what is deployed.

## Templates

The Jenkins pipeline heavily leverages Openshift Templates in order to ensure that all of the environment variables, settings, and contexts are pushed to Openshift correctly. Files ending with `.bc.yaml` specify the build configurations, while files ending with `.dc.yaml` specify the components required for deployment.

### Build Configurations

Build configurations will emit and handle the chained builds or standard builds as necessary. They take in the following parameters:

| Name | Required | Description |
| --- | --- | --- |
| REPO_NAME | yes | Application repository name |
| JOB_NAME | yes | Job identifier (i.e. 'pr-5' OR 'master') |
| SOURCE_REPO_REF | yes | Git Pull Request Reference (i.e. 'pull/CHANGE_ID/head') |
| SOURCE_REPO_URL | yes | Git Repository URL |

The template can be manually invoked and deployed via Openshift CLI. For example:

```sh
export NAMESPACE=<yournamespace>

oc process -n $NAMESPACE -f openshift/app.bc.yaml -p REPO_NAME=common-forms-toolkit
 -p JOB_NAME=master -p SOURCE_REPO_URL=https://github.com/bcgov/common-forms-toolkit.git -p SOURCE_REPO_REF=master -o yaml | oc apply -n $NAMESPACE -f -
```

Note that these build configurations do not have any triggers defined. They will be invoked by the Jenkins pipeline, started manually in the console, or by an equivalent oc command for example:

```sh
oc start-build -n $NAMESPACE <buildname> --follow
```

Finally, we generally tag the resultant image so that the deployment config will know which exact image to use. This is also handled by the Jenkins pipeline. The equivalent oc command for example is:

```sh
oc tag -n $NAMESPACE <buildname>:latest <buildname>:master
```

*Note: Remember to swap out the bracketed values with the appropriate values!*

### Deployment Configurations

Deployment configurations will emit and handle the deployment lifecycles of running containers based off of the previously built images. They generally contain a deploymentconfig, a service, and a route. Before our application is deployed, Patroni (a Highly Available Postgres Cluster implementation) needs to be deployed. Refer to any `patroni*` templates and their [official documentation](https://patroni.readthedocs.io/en/latest/) for more details.

Our application template take in the following parameters:

| Name | Required | Description |
| --- | --- | --- |
| REPO_NAME | yes | Application repository name |
| JOB_NAME | yes | Job identifier (i.e. 'pr-5' OR 'master') |
| NAMESPACE | yes | which namespace/"environment" are we deploying to? dev, test, prod? |
| APP_NAME | yes | short name for the application |
| ROUTE_HOST | yes | base domain for the publicly accessible URL |
| ROUTE_PATH | yes | base path for the publicly accessible URL |

The Jenkins pipeline will handle deployment invocation automatically. However should you need to run it manually, you can do so with the following for example:

```sh
export NAMESPACE=<yournamespace>
export APP_NAME=<yourappshortname>

oc process -n $NAMESPACE -f openshift/app.dc.yaml -p REPO_NAME=common-forms-toolkit -p JOB_NAME=master -p NAMESPACE=$NAMESPACE -p APP_NAME=$APP_NAME -p ROUTE_HOST=$APP_NAME-dev.pathfinder.gov.bc.ca -p ROUTE_PATH=master -o yaml | oc apply -n $NAMESPACE -f -
```

Due to the triggers that are set in the deploymentconfig, the deployment will begin automatically. However, you can deploy manually by use the following command for example:

```sh
oc rollout -n $NAMESPACE latest dc/<buildname>-master
```

*Note: Remember to swap out the bracketed values with the appropriate values!*

## Vanity URL Redirects

In the event a vanity *.gov.bc.ca URL is required for "easier" access to a specific form, we will need some form of reverse-proxy to handle 302 redirects on our behalf. At this time, we are leveraging Caddy to achieve this, specifically with the `bcgov/s2i-caddy:v1-stable` image on Openshift. Note that this will only need to be performed in the prod environment once, as this does not apply to any other environments. In order to deploy this reverse proxy, run the following (where APP_NAME should match with the public name and intended path such as `minesoperatorscreening`):

```sh
export NAMESPACE=<yournamespace>
export APP_NAME=<yourappshortname>

oc process -n $NAMESPACE -f caddy-reverse-proxy.dc.yaml APP_NAME=$APP_NAME -o yaml | oc apply -n $NAMESPACE -f -
```

This template will implement a deploymentconfig, a configmap with the appropriate caddyfile settings, and an attached service. A route must be manually created to expose the service after the template has been deployed.

### Background Design

This template was created because for the most part, we were only seeking to run the Caddy executable with a catch-all 302 proxy redirect to a different site. One of the main approaches is to layer your customizations on top of the caddy image as part of the build process (normally done when you are attempting to directly host static file assets). However, as we are only needing to edit one configuration file (the Caddyfile), we can instead just mount this file directly into the base image through the use of a config map mounted as a volume file.

This pattern is useful as it decouples the image from the configuration. Changing the settings would just involve updating the config map, and then restarting the pods. Specific to this caddy image, the default Caddyfile is located at /etc/Caddyfile. As you are not able to mount config map volumes onto folders which already contain the targeted file, we instead mount it onto the /mnt directory. We then overrode the container startup command to use the /mnt/Caddyfile instead in order to achieve what we want.

## Pull Request Cleanup

As of this time, we do not automatically clean up resources generated by a Pull Request once it has been accepted and merged in. This is still a manual process. Our PR deployments are all named in the format "pr-###", where the ### is the number of the specific PR. In order to clear all resources for a specific PR, run the following two commands to delete all relevant resources from the Openshift project (replacing `PRNUMBER` with the appropriate number):

```sh
export NAMESPACE=<yournamespace>
export APP_NAME=<yourappshortname>

oc delete all,secret,pvc,nsp -n $NAMESPACE --selector app=$APP_NAME-pr-<PRNUMBER>
oc delete all,svc,cm,sa,role,secret -n $NAMESPACE --selector cluster-name=pr-<PRNUMBER>
```

The first command will clear out all related executable resources for the application, while the second command will clear out the remaining Patroni cluster resources associated with that PR.

## Appendix - Supporting Deployments

There will be instances where this application will need supporting modifications or deployment such as databases and business analytics tools. Below is a list of initial reference points for other Openshift templates that could be leveraged and bolted onto the existing Jenkins pipeline if applicable.

### Metabase

- [Overview & Templates](https://github.com/bcgov/nr-get-token/wiki/Metabase)

### MongoDB

Refer to the `mongodb.dc.yaml` and `mongodb.secret.yaml` files found below for a simple persistent MongoDB deployment:

- [Templates](https://github.com/bcgov/common-hosted-form-service/tree/feature/octemplates/openshift)

### Patroni (HA Postgres)

Refer to the `patroni.dc.yaml` and `patroni.secret.yaml` files found below for a Highly Available Patroni cluster statefulset:

- [Templates](https://github.com/bcgov/nr-get-token/tree/master/openshift)

#### Database Backup

- [Documentation & Templates](https://github.com/bcgov/nr-get-token/wiki/Database-Backup)

### Redis

Refer to the `redis.dc.yaml` and `redis.secret.yaml` files found below for a simple persistent Redis deployment:

- [Templates](https://github.com/bcgov/common-hosted-email-service/tree/master/openshift)
