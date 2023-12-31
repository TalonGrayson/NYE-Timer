const obs = require("./obs-connector");
const { DateTime } = require("luxon");
const Action = require("./actions");
const targetDateTime = process.env.TARGET_DATETIME;

console.log("Starting NYE Countdowns...");
console.log("Counting down to: %o", targetDateTime);

let timezones = [
    "Europe/London",                        // GMT  (UTC +0)
    "Atlantic/Cape_Verde",                  // CVT  (UTC -1)
    "Atlantic/South_Georgia",               // CGT  (UTC -2)
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

const calculateTimeRemaining = () => {
    const ukTime = DateTime.now().setZone(process.env.MY_TIMEZONE);
    const nextMidnight = DateTime.fromISO(targetDateTime, { zone: timezones[timezonesCounted] });
    const millisecondsRemaining = nextMidnight - ukTime;

    const secondsRemaining = Math.floor(millisecondsRemaining/1000);
    const minutesRemaining = Math.floor(secondsRemaining/60);
    const hoursRemaining = Math.floor(minutesRemaining/60);
    const daysRemaining = Math.floor(hoursRemaining/24);

    const trueHoursRemaining = hoursRemaining - (daysRemaining*24);
    const trueMinutesRemaining = minutesRemaining - (hoursRemaining*60);
    const trueSecondsRemaining = secondsRemaining - (minutesRemaining*60);

    return {
        days: daysRemaining,
        hours: trueHoursRemaining,
        minutes: trueMinutesRemaining,
        seconds: trueSecondsRemaining,
        ms: millisecondsRemaining
    }   
}

const displayCountdownString = (timeRemaining) => {
    let countdownString = `${timeRemaining.minutes}m ${timeRemaining.seconds}s`

    if(timeRemaining.hours > 0 || timeRemaining.days > 0) {
        countdownString = `${timeRemaining.hours}h ${countdownString}`
    }

    if(timeRemaining.days > 0) {
        countdownString = `${timeRemaining.days}d ${countdownString}`
    }

    console.clear();
    if(!(process.env.OBS_WEBSOCKET_ADDRESS && process.env.OBS_WEBSOCKET_PASSWORD)) {
        console.log("OBS connection info not found - please update your .env per the README");
    }
    if(timezonesCounted > 0) {
        console.log(`Happy New Year, ${timezones[timezonesCounted-1].split("/")[1]}!`)
    }
    console.log(`${countdownString} until New Year in ${timezones[timezonesCounted].split("/")[1]}!`);

    if(lessThanTenSecondsToGo(timeRemaining)) {
        console.log("COUNTDOWN: %o", timeRemaining.seconds);
    }
}

const thereIsAnotherTimezone = () => {
    return timezones[timezonesCounted+1] != null;
}

const tenSecondsToGo = (timeRemaining) => {
    return timeRemaining.days <= 0 && timeRemaining.hours <= 0 && timeRemaining.minutes <= 0 && timeRemaining.seconds == 10;
}

const lessThanTenSecondsToGo = (timeRemaining) => {
    return timeRemaining.days <= 0 && timeRemaining.hours <= 0 && timeRemaining.minutes <= 0 && timeRemaining.seconds <= 10;
}

const countdownHasReachedZero = (timeRemaining) => {
    return timeRemaining.ms <= 0;
}

const countdownHasNotReachedZero = (timeRemaining) => {
    return !countdownHasReachedZero(timeRemaining);
}

const trackNextTimezone = () => {
    console.log("Happy New Year to %o", timezones[timezonesCounted]);
    timezonesCounted++;
}

const countdown = () => {
    setTimeout(() => {
        const timeRemaining = calculateTimeRemaining();
        
        if(tenSecondsToGo(timeRemaining)) {
            displayCountdownString(timeRemaining);
            if(process.env.OBS_WEBSOCKET_ADDRESS) {
                new Action(obs).happyNewYear(
                    process.env.OBS_ALERT_SCENE,
                    process.env.OBS_ALERT_SOURCE,
                    parseInt(process.env.OBS_ALERT_DURATION)
                );
            } else {
                console.log("OBS connection info not found - please update your .env")
            }
        } else if(countdownHasNotReachedZero(timeRemaining)) {
            displayCountdownString(timeRemaining);
        } else if (thereIsAnotherTimezone()) {
            trackNextTimezone();
            console.log("Next timezone to celebrate NYE: %o", timezones[timezonesCounted]);
        } else {
            return;
        }

        countdown();
    }, 1000)
}

countdown();