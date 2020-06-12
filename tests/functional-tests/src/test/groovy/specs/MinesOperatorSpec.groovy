package specs

import listeners.BrowserStackReportingSpec
import pages.MinesOperatorPage

class MinesOperatorSpec extends BrowserStackReportingSpec {

    def "As a user, I want to fill in the Mines Operator Form."() {
        when: 'I enter the url for the Form'
            to MinesOperatorPage
        then: 'I arrive at the correct page'
            at MinesOperatorPage
            assert toolbar_Title.text() == "Industrial Camps"
            assert btn-form-to-next-step
        when: "I click 'Go to Step 2'"
          btn-form-to-next-step.click()
        then: "I will arive in page 2"
          assert text-form-firstName
      }
}
