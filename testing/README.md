# Testing Instructions

## Description

Most of the tests for this project are meant to be run from the developer workstation.
However, the Unit tests will be part of the pipeline and will be executed whenever the code is rebuilt.

## API Tests

The API Tests will be executed by using Postman. Postman needs to be installed on the workstation, the application can be downloaded here: https://www.getpostman.com/downloads/

The test definition file from Postman will be used by the headless testing complement to Postman called Newman (https://www.npmjs.com/package/newman), newman will also allow these API Tests to be implemented in the pipeline.

## Functional Tests

For our functional tests we are deploying BDDStack (https://github.com/BCDevOps/BDDStack). BDDStack tests the application based on the defined user stories. please see the README in the testing/functional directory for instructions on how to run these tests.

BDDStack tests will also run as part of the pipeline.

## Unit Tests

The unit tests can be found in the app and app-frontend directories.
