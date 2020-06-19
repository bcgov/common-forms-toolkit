/*
	This is the Geb configuration file.

	See: http://www.gebish.org/manual/current/#configuration
*/

import org.openqa.selenium.Dimension
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.firefox.FirefoxOptions
import org.openqa.selenium.remote.DesiredCapabilities
import org.openqa.selenium.PageLoadStrategy
import com.aoe.gebspockreports.GebReportingListener

waiting {
	timeout = 20
	retryInterval = 1
}

atCheckWaiting = [20, 1]

environments {

	// run via “./gradlew chromeTest”
	// See: https://github.com/SeleniumHQ/selenium/wiki/ChromeDriver
	ChromeOptions o = new ChromeOptions()
    o.addArguments('no-sandbox')
    o.addArguments('disable-extensions')
    o.addArguments('dns-prefetch-disable')
    o.addArguments('disable-gpu')
    o.addArguments('start-maximized')
    o.addArguments('enable-automation')
    o.addArguments('disable-infobars')
    o.addArguments('disable-dev-shm-usage')
    o.addArguments('disable-browser-side-navigation')
    o.setPageLoadStrategy(PageLoadStrategy.NONE)

	chrome {
		driver = {
			new ChromeDriver(o)
			}
	}

	// run via “./gradlew chromeHeadlessTest”
	// See: https://github.com/SeleniumHQ/selenium/wiki/ChromeDriver
	chromeHeadless {
		driver = {
			o.addArguments('headless')
			new ChromeDriver(o)
		}
	}

	// run via “./gradlew firefoxTest”
	// See: https://github.com/SeleniumHQ/selenium/wiki/FirefoxDriver
	firefox {
		driver = { new FirefoxDriver() }
	}

	firefoxHeadless {
		driver = {
			FirefoxOptions fo = new FirefoxOptions()
			fo.addArguments('-headless')
			new FirefoxDriver(fo)
		}
	}
}

// To run the tests with all browsers just run “./gradlew test”

baseNavigatorWaiting = true

// Allows for setting you baseurl in an environment variable.
// This is particularly handy for development and the pipeline
def env = System.getenv()
baseUrl = env['BASEURL']
//if (!baseUrl) {
	baseUrl = "https://comfort-test.pathfinder.gov.bc.ca/app/"
//}

println "BaseURL: ${baseUrl}"
println "--------------------------"

cacheDriverPerThread = true
quitCachedDriverOnShutdown = true

reportingListener = new GebReportingListener()
reportsDir = 'build/reports/spock'
