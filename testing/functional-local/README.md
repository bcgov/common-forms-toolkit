# Functional Tests

## Description

These are the automated functional tests that prove the User Stories to be functional.

## Usage (Local)

1. Start the application under test
2. Make sure you have Java installed (Min. Version 1.8)
3. Make sure you have Gradle 4.2.1 installed: `choco install gradle --version=4.2.1`
4. Navigate to the /testing/functional-local directory and...

The following commands will launch the tests with the individual browsers:

    gradle chromeTest

Alternative commands (might require additional set up):

    gradle chromeHeadlessTest //Will run in pipeline as well
    gradle firefoxTest
    gradle firefoxHeadlessTest //Will run in pipeline as well

## Test result reports

After the tests have been run (with chromeTest), you can find the test reports here:

- testing\functional-local\build\reports\spock\index.html _Showing the BDD results per User Story (Business focused view)_
- testing\functional-local\build\reports\tests\chromeTest\index.html _Showing the test results (more technical view)_
- testing\functional-local\build\test-results\chromeTest _Contains individual XML test result files that can be consumed by Jenkins in the pipeline to provide consolidated test result reporting._
