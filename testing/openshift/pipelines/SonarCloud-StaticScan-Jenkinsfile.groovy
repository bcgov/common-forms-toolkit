#!/usr/bin/env groovy
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// ================================================================================================
// SonarCloud Scanner Settings
// ------------------------------------------------------------------------------------------------

// The name of the SonarCloud URL.  
def SONARQUBE_URL = 'https://sonarcloud.io'

// The name of your SonarCloud project
def SONAR_PROJECT_NAME = 'ppr'

// The project key of your SonarCloud project
def SONAR_PROJECT_KEY = 'bcgov_ppr'

// The organization your project belongs to
def SONAR_ORGANIZATION = 'bcgov-sonarcloud'
// ================================================================================================

// The jenkins-python3nodejs template has been purpose built for supporting SonarCloud scanning.
podTemplate(
  label: 'jenkins-python3nodejs',
  name: 'jenkins-python3nodejs',
  serviceAccount: 'jenkins',
  cloud: 'openshift',
  containers: [
    containerTemplate(
      name: 'jnlp',
      image: '172.50.0.2:5000/openshift/jenkins-slave-python3nodejs',
      resourceRequestCpu: '1000m',
      resourceLimitCpu: '2000m',
      resourceRequestMemory: '2Gi',
      resourceLimitMemory: '4Gi',
      workingDir: '/tmp',
      command: '',
      args: '${computer.jnlpmac} ${computer.name}',
        envVars: [
          secretEnvVar(key: 'SONAR_TOKEN', secretName: 'sonar-token', secretKey: 'SONAR_TOKEN'),
        ]
    )
  ])
  {
  node('jenkins-python3nodejs') {

    stage('Checkout Source') {
      echo "Checking out source code ..."
      checkout scm
    }

    stage('SonarCloud Analysis') {
      echo "Performing static SonarCloud code analysis ..."

      // The `sonar-runner` MUST exist in your project and contain a Gradle environment consisting of:
      // - Gradle wrapper script(s)
      // - A simple `build.gradle` file that includes the SonarCloud plug-in.
      //
      // An example can be found here:
      // - https://github.com/BCDevOps/sonarqube
      dir('sonar-runner') {
        // ======================================================================================================
        // Set your SonarCloud scanner properties at this level, not at the Gradle Build level.
        // The only thing that should be defined at the Gradle Build level is a minimal set of generic defaults.
        //
        // For more information on available properties visit:
        // - https://sonarcloud.io/documentation/analysis/analysis-parameters/
        // ======================================================================================================
        sh (
          returnStdout: true,
          script: "./gradlew sonarqube \
            -Dsonar.verbose=true \
            -Dsonar.host.url=${SONARQUBE_URL} \
            -Dsonar.login=${SONAR_TOKEN} \
            -Dsonar.projectName='${SONAR_PROJECT_NAME}' \
            -Dsonar.projectKey=${SONAR_PROJECT_KEY}"
        )
      }
    }
  }
}