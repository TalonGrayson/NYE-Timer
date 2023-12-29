const { DateTime } = require("luxon");
const obsCon = require("./obs-connector");
const Action = require("./actions");
const action = new Action();
// const targetDateTime = `${DateTime.now().plus({ years: 1}).year}-01-01T00:00:00`
const targetDateTime = "2023-12-29T13:15:00"

console.log("Starting NYE Countdowns...");
console.log("Counting down to: %o", targetDateTime);

let timezones = [
    "Europe/London",
    "Atlantic/Cape_Verde",
    "America/Nuuk",
    "America/Argentina/Buenos_Aires",
    "America/St_Johns",
    "America/Caracas",
    "America/New_York",
    "America/Mexico_City",
    "America/Denver",
    "America/Los_Angeles",
    "America/Anchorage",
    "Pacific/Honolulu",
    "Pacific/Pago_Pago"
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
        // const trueMillisecondsRemaining = millisecondsRemaining - (secondsRemaining*1000);

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
            action.happyNewYear(obsCon, {scene: "Popups", source: "HNY", duration: "5"});
            console.log("Next timezone to celebrate NYE: %o", timezones[timezonesCounted]);
        } else {
            return;
        }

        countdown();
    }, 1000)
}

countdown();