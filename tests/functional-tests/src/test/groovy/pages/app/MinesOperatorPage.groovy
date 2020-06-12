package pages

class MinesOperatorPage extends BaseAppPage {

    static at = { title == 'Industrial Camps' }
    static url = 'minesoperatorscreening'

    static content = {
        toolbar_Title { $("div", data-test:"btn-header-title") }
    }

    void toolbar_loginButton() {
        toolbar_Login.click()
    }

    void screen_loginButton() {
        screen_Login.click()
    }
}
