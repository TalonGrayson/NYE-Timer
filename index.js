const { DateTime } = require("luxon");

console.log("Starting NYE Countdowns...");

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
let allTimezonesCounted = false;


console.log("Total timezones: %o", timezones.length);
console.log("Timezones counted: %o", timezonesCounted);

const countdown = () => {
    setTimeout(() => {
        const millisecondsRemaining = DateTime.local(2024, 1, 1, 0, 0, 0, 0).setZone(timezones[timezonesCounted]).diffNow().values.milliseconds;

        const secondsRemaining = Math.floor(millisecondsRemaining/1000);
        const minutesRemaining = Math.floor(secondsRemaining/60);
        const hoursRemaining = Math.floor(minutesRemaining/60);
        const daysRemaining = Math.floor(hoursRemaining/24);
    
        const trueHoursRemaining = hoursRemaining - (daysRemaining*24);
        const trueMinutesRemaining = minutesRemaining - (hoursRemaining*60);
        const trueSecondsRemaining = secondsRemaining - (minutesRemaining*60);
        const trueMillisecondsRemaining = millisecondsRemaining - (secondsRemaining*1000);

        const countdownString = `${daysRemaining} day${daysRemaining != 1 ? "s" : ""}, ${trueHoursRemaining}h ${trueMinutesRemaining}m ${trueSecondsRemaining}s`
    
        if(millisecondsRemaining > 0) {
            console.log(`Countdown to NYE for ${timezones[timezonesCounted]}: ${countdownString}`)
            countdown();
        } else {
            timezonesCounted++;
        }
    }, 1000)
}

countdown();