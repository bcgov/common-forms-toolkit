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

podTemplate(label: 'bddstack', name: 'bddstack', serviceAccount: 'jenkins', cloud: 'openshift', containers: [
  containerTemplate(
    name: 'jnlp',
    image: 'docker-registry.default.svc:5000/zwmtib-tools/bddstack-node:2.0',
    resourceRequestCpu: '500m',
    resourceLimitCpu: '1000m',
    resourceRequestMemory: '1Gi',
    resourceLimitMemory: '4Gi',
    workingDir: '/home/jenkins',
    command: '',
    args: '${computer.jnlpmac} ${computer.name}',
    envVars: [
        envVar(key:'BASEURL', value: 'https://dev.bcregistry.ca/cooperatives/'),
        secretEnvVar(key: 'PPR_VIEWER_USERNAME', secretName: 'ppr-user', secretKey: 'username'),
        secretEnvVar(key: 'PPR_PASSWORD', secretName: 'ppr-user', secretKey: 'password')
       ]
  )
])       
{
    stage('Automated E2E Functional Test') {
        node('bddstack') {
            //the checkout is mandatory, otherwise functional test would fail
            echo "checking out source"
            echo "Build: ${BUILD_ID}"
            checkout scm
            dir('testing/functional') {
                try {
                        sh 'gradle chromeHeadlessTest'
                } finally {
                        archiveArtifacts allowEmptyArchive: true, artifacts: 'build/reports/geb/**/*'
                        junit 'build/test-results/**/*.xml'
                        publishHTML (target: [
                                    allowMissing: false,
                                    alwaysLinkToLastBuild: false,
                                    keepAll: true,
                                    reportDir: 'build/reports/spock',
                                    reportFiles: 'index.html',
                                    reportName: "Test: BDD Spock Report"
                                ])
                        publishHTML (target: [
                                    allowMissing: false,
                                    alwaysLinkToLastBuild: false,
                                    keepAll: true,
                                    reportDir: 'build/reports/tests/chromeHeadlessTest',
                                    reportFiles: 'index.html',
                                    reportName: "Test: Full Test Report"
                                ])
                    perfReport compareBuildPrevious: true, excludeResponseTime: true, ignoreFailedBuilds: true, ignoreUnstableBuilds: true, modeEvaluation: true, modePerformancePerTestCase: true, percentiles: '0,50,90,100', relativeFailedThresholdNegative: 80.0, relativeFailedThresholdPositive: 20.0, relativeUnstableThresholdNegative: 50.0, relativeUnstableThresholdPositive: 50.0, sourceDataFiles: 'build/test-results/**/*.xml'
                }
            }
        }
    }
}