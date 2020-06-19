package pages

class MinesOperatorPage extends BaseAppPage {

    static at = { title == "Industrial Camps" }
    static url = "https://comfort-dev.pathfinder.gov.bc.ca/app/minesoperatorscreening/"

    static content = {
      toolbar_Title { $("div", "data-test":"btn-header-title") }
      btn-stepper-one { $("div", "data-test":"btn-stepper-one") }
      btn-stepper-two { $("div", "data-test":"btn-stepper-two") }
      btn-stepper-three { $("div", "data-test":"btn-stepper-three") }
      btn-stepper-four { $("div", "data-test":"btn-stepper-four") }
      btn-stepper-five { $("div", "data-test":"btn-stepper-five") }
      btn-stepper-six { $("div", "data-test":"btn-stepper-six") }
      btn-form-panel-camp-order { $("button", "data-test":"btn-form-panel-camp-order") }
      btn-form-panel-ipc-protocol { $("button", "data-test":"btn-form-panel-ipc-protocol") }
      btn-form-to-next-step { $("button", "data-test":"btn-form-to-next-step") }
      btn-form-test-data { $("button", "data-test":"btn-form-test-data") }
      cb-form-accTents { $("input", "data-test":"cb-form-accTents") }
      cb-form-accMotel { $("input", "data-test":"cb-form-accMotel") }
      cb-form-accWorkersHome { $("input", "data-test":"cb-form-accWorkersHome") }
      btn-form-to-next-step { $("button", "data-test":"btn-form-to-next-step") }
      btn-form-to-previous-step { $("button", "data-test":"btn-form-to-previous-step") }
      cb-form-protectionSignage { $("input", "data-test":"cb-form-protectionSignage") }
      cb-form-workerContactPersonnel { $("input", "data-test":"cb-form-workerContactPersonnel") }
      cb-form-selfIsolateUnderstood { $("input", "data-test":"cb-form-selfIsolateUnderstood") }
      cb-form-selfIsolateAccommodation { $("input", "data-test":"cb-form-selfIsolateAccommodation") }
      cb-form-laundryServices { $("input", "data-test":"cb-form-laundryServices") }
      cb-form-wasteManagementGloves { $("input", "data-test":"cb-form-wasteManagementGloves") }
      cb-form-wasteManagementSchedule { $("input", "data-test":"cb-form-wasteManagementSchedule") }
      cb-form-wasteManagementBags { $("input", "data-test":"cb-form-wasteManagementBags") }
      cb-form-handWashingStations { $("input", "data-test":"cb-form-handWashingStations") }
      cb-form-handWashingSoapWater { $("input", "data-test":"cb-form-handWashingSoapWater") }
      cb-form-handWashingWaterless { $("input", "data-test":"cb-form-handWashingWaterless") }
      cb-form-handWashingPaperTowels { $("input", "data-test":"cb-form-handWashingPaperTowels") }
      cb-form-handWashingSignage { $("input", "data-test":"cb-form-handWashingSignage") }
      cb-form-distancingMaintained { $("input", "data-test":"cb-form-distancingMaintained") }
      cb-form-distancingFaceShields { $("input", "data-test":"cb-form-distancingFaceShields") }
      cb-form-disinfectingSchedule { $("input", "data-test":"cb-form-disinfectingSchedule") }
      cb-form-transportationSingleOccupant { $("input", "data-test":"cb-form-transportationSingleOccupant") }
      cb-form-transportationBusesVans { $("input", "data-test":"cb-form-transportationBusesVans") }
      cb-form-transportationTrucksCars { $("input", "data-test":"cb-form-transportationTrucksCars") }
      cb-form-transportationHelicopter { $("input", "data-test":"cb-form-transportationHelicopter") }
      cb-form-transportationTravelPod { $("input", "data-test":"cb-form-transportationTravelPod") }
      cb-form-transportationCleaningDistancing { $("input", "data-test":"cb-form-transportationCleaningDistancing") }
      btn-form-to-next-step { $("button", "data-test":"btn-form-to-next-step") }
      btn-form-to-previous-step { $("button", "data-test":"btn-form-to-previous-step") }
      cb-form-educationSignage { $("input", "data-test":"cb-form-educationSignage") }
      cb-form-educationContactPersonnel { $("input", "data-test":"cb-form-educationContactPersonnel") }
      cb-form-trainingEtiquette { $("input", "data-test":"cb-form-trainingEtiquette") }
      cb-form-trainingLocations { $("input", "data-test":"cb-form-trainingLocations") }
      cb-form-trainingFirstAid { $("input", "data-test":"cb-form-trainingFirstAid") }
      cb-form-trainingReporting { $("input", "data-test":"cb-form-trainingReporting") }
      cb-form-mealsDistancing { $("input", "data-test":"cb-form-mealsDistancing") }
      cb-form-mealsDishware { $("input", "data-test":"cb-form-mealsDishware") }
      cb-form-mealsDishwashing { $("input", "data-test":"cb-form-mealsDishwashing") }
      btn-form-to-next-step { $("button", "data-test":"btn-form-to-next-step") }
      btn-form-to-previous-step { $("button", "data-test":"btn-form-to-previous-step") }
      cb-form-infectionSeparation { $("input", "data-test":"cb-form-infectionSeparation") }
      cb-form-infectionSymptoms { $("input", "data-test":"cb-form-infectionSymptoms") }
      cb-form-infectionHeathLinkBC { $("input", "data-test":"cb-form-infectionHeathLinkBC") }
      cb-form-infectionSanitization { $("input", "data-test":"cb-form-infectionSanitization") }
      cb-form-infectionAccommodation { $("input", "data-test":"cb-form-infectionAccommodation") }
      cb-form-infectedFeeding { $("input", "data-test":"cb-form-infectedFeeding") }
      cb-form-infectedHousekeeping { $("input", "data-test":"cb-form-infectedHousekeeping") }
      cb-form-infectedWaste { $("input", "data-test":"cb-form-infectedWaste") }
      btn-form-to-next-step { $("button", "data-test":"btn-form-to-next-step") }
      btn-form-to-previous-step { $("button", "data-test":"btn-form-to-previous-step") }
      btn-form-to-step-one { $("button", "data-test":"btn-form-to-step-one") }
      btn-form-panel-camp-order { $("button", "data-test":"btn-form-panel-camp-order") }
      btn-form-panel-ipc-protocol { $("button", "data-test":"btn-form-panel-ipc-protocol") }
      btn-form-to-next-step { $("button", "data-test":"btn-form-to-next-step") }
      btn-form-to-step-two { $("button", "data-test":"btn-form-to-step-two") }
      btn-form-test-data { $("button", "data-test":"btn-form-test-data") }
      cb-form-accTents { $("input", "data-test":"cb-form-accTents") }
      cb-form-accMotel { $("input", "data-test":"cb-form-accMotel") }
      cb-form-accWorkersHome { $("input", "data-test":"cb-form-accWorkersHome") }
      btn-form-to-next-step { $("button", "data-test":"btn-form-to-next-step") }
      btn-form-to-previous-step { $("button", "data-test":"btn-form-to-previous-step") }
      btn-form-to-step-three { $("button", "data-test":"btn-form-to-step-three") }
      cb-form-protectionSignage { $("input", "data-test":"cb-form-protectionSignage") }
      cb-form-workerContactPersonnel { $("input", "data-test":"cb-form-workerContactPersonnel") }
      cb-form-selfIsolateUnderstood { $("input", "data-test":"cb-form-selfIsolateUnderstood") }
      cb-form-selfIsolateAccommodation { $("input", "data-test":"cb-form-selfIsolateAccommodation") }
      cb-form-laundryServices { $("input", "data-test":"cb-form-laundryServices") }
      cb-form-wasteManagementGloves { $("input", "data-test":"cb-form-wasteManagementGloves") }
      cb-form-wasteManagementSchedule { $("input", "data-test":"cb-form-wasteManagementSchedule") }
      cb-form-wasteManagementBags { $("input", "data-test":"cb-form-wasteManagementBags") }
      cb-form-handWashingStations { $("input", "data-test":"cb-form-handWashingStations") }
      cb-form-handWashingSoapWater { $("input", "data-test":"cb-form-handWashingSoapWater") }
      cb-form-handWashingWaterless { $("input", "data-test":"cb-form-handWashingWaterless") }
      cb-form-handWashingPaperTowels { $("input", "data-test":"cb-form-handWashingPaperTowels") }
      cb-form-handWashingSignage { $("input", "data-test":"cb-form-handWashingSignage") }
      cb-form-distancingMaintained { $("input", "data-test":"cb-form-distancingMaintained") }
      cb-form-distancingFaceShields { $("input", "data-test":"cb-form-distancingFaceShields") }
      cb-form-disinfectingSchedule { $("input", "data-test":"cb-form-disinfectingSchedule") }
      cb-form-transportationSingleOccupant { $("input", "data-test":"cb-form-transportationSingleOccupant") }
      cb-form-transportationBusesVans { $("input", "data-test":"cb-form-transportationBusesVans") }
      cb-form-transportationTrucksCars { $("input", "data-test":"cb-form-transportationTrucksCars") }
      cb-form-transportationHelicopter { $("input", "data-test":"cb-form-transportationHelicopter") }
      cb-form-transportationTravelPod { $("input", "data-test":"cb-form-transportationTravelPod") }
      cb-form-transportationCleaningDistancing { $("input", "data-test":"cb-form-transportationCleaningDistancing") }
      btn-form-to-next-step { $("button", "data-test":"btn-form-to-next-step") }
      btn-form-to-previous-step { $("button", "data-test":"btn-form-to-previous-step") }
      btn-form-to-step-four { $("button", "data-test":"btn-form-to-step-four") }
      cb-form-educationSignage { $("input", "data-test":"cb-form-educationSignage") }
      cb-form-educationContactPersonnel { $("input", "data-test":"cb-form-educationContactPersonnel") }
      cb-form-trainingEtiquette { $("input", "data-test":"cb-form-trainingEtiquette") }
      cb-form-trainingLocations { $("input", "data-test":"cb-form-trainingLocations") }
      cb-form-trainingFirstAid { $("input", "data-test":"cb-form-trainingFirstAid") }
      cb-form-trainingReporting { $("input", "data-test":"cb-form-trainingReporting") }
      cb-form-mealsDistancing { $("input", "data-test":"cb-form-mealsDistancing") }
      cb-form-mealsDishware { $("input", "data-test":"cb-form-mealsDishware") }
      cb-form-mealsDishwashing { $("input", "data-test":"cb-form-mealsDishwashing") }
      btn-form-to-next-step { $("button", "data-test":"btn-form-to-next-step") }
      btn-form-to-previous-step { $("button", "data-test":"btn-form-to-previous-step") }
      btn-form-to-step-five { $("button", "data-test":"btn-form-to-step-five") }
      cb-form-infectionSeparation { $("input", "data-test":"cb-form-infectionSeparation") }
      cb-form-infectionSymptoms { $("input", "data-test":"cb-form-infectionSymptoms") }
      cb-form-infectionHeathLinkBC { $("input", "data-test":"cb-form-infectionHeathLinkBC") }
      cb-form-infectionSanitization { $("input", "data-test":"cb-form-infectionSanitization") }
      cb-form-infectionAccommodation { $("input", "data-test":"cb-form-infectionAccommodation") }
      cb-form-infectedFeeding { $("input", "data-test":"cb-form-infectedFeeding") }
      cb-form-infectedHousekeeping { $("input", "data-test":"cb-form-infectedHousekeeping") }
      cb-form-infectedWaste { $("input", "data-test":"cb-form-infectedWaste") }
      btn-form-to-next-step { $("button", "data-test":"btn-form-to-next-step") }
      btn-form-to-previous-step { $("button", "data-test":"btn-form-to-previous-step") }
      cb-form-certifyAccurateInformation { $("input", "data-test":"cb-form-certifyAccurateInformation") }
      cb-form-agreeToInspection { $("input", "data-test":"cb-form-agreeToInspection") }
      btn-form-submit { $("button", "data-test":"btn-form-submit") }
      btn-form-to-previous-step { $("button", "data-test":"btn-form-to-previous-step") }
    }

    void toolbar_loginButton() {
        toolbar_Login.click()
    }

    void screen_loginButton() {
        screen_Login.click()
    }
}
