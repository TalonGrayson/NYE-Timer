const obs = require("./obs-connector");
const { DateTime } = require("luxon");
const Action = require("./actions");
const targetDateTime = "2024-01-01T00:00:00"
// const targetDateTime = "2023-12-29T16:58:00"

console.log("Starting NYE Countdowns...");
console.log("Counting down to: %o", targetDateTime);

let timezones = [
    "Europe/London",                        // GMT  (UTC +0) 
    "Atlantic/Cape_Verde",                  // CVT  (UTC -1) 
    "America/Nuuk",                         // CGT  (UTC -2) 
    "America/Buenos_Aires",                 // ART  (UTC -3) 
    "America/St_Johns",                     // NST  (UTC -3:30)
    "America/Goose_Bay",                    // AST  (UTC -4) 
    "America/New_York",                     // EST  (UTC -5) 
    "America/Mexico_City",                  // CST  (UTC -6) 
    "America/Denver",                       // MST  (UTC -7) 
    "America/Los_Angeles",                  // PST  (UTC -8) 
    "America/Anchorage",                    // AKST (UTC -9) 
    "Pacific/Marquesas",                    // MART (UTC -9:30)
    "Pacific/Honolulu",                     // HST  (UTC -10)
    "Pacific/Pago_Pago"                     // SST  (UTC -11)
]
let timezonesCounted = 0;

const countdown = () => {
    setTimeout(() => {
        let ukTime = DateTime.now().setZone(timezones[0]);
        let nextMidnight = DateTime.fromISO(targetDateTime, { zone: timezones[timezonesCounted] });
        let millisecondsRemaining = nextMidnight - ukTime;

        const secondsRemaining = Math.floor(millisecondsRemaining/1000);
        const minutesRemaining = Math.floor(secondsRemaining/60);
        const hoursRemaining = Math.floor(minutesRemaining/60);
        const daysRemaining = Math.floor(hoursRemaining/24);
    
        const trueHoursRemaining = hoursRemaining - (daysRemaining*24);
        const trueMinutesRemaining = minutesRemaining - (hoursRemaining*60);
        const trueSecondsRemaining = secondsRemaining - (minutesRemaining*60);

        let countdownString = `${trueMinutesRemaining}m ${trueSecondsRemaining}s`

        if(trueHoursRemaining > 0 || daysRemaining > 0) {
            countdownString = `${trueHoursRemaining}h ${countdownString}`
        }

        if(daysRemaining > 0) {
            countdownString = `${daysRemaining}d ${countdownString}`
        }
    
        if(millisecondsRemaining > 0) {
            console.log(countdownString)
        } else if (timezones[timezonesCounted+1]) {
            timezonesCounted++;
            new Action(obs).happyNewYear("Popups", "ShotDisclaimer", 8);
            console.log("Next timezone to celebrate NYE: %o", timezones[timezonesCounted]);
        } else {
            return;
        }

        countdown();
    }, 1000)
}

countdown();