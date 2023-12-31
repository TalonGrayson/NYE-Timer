# NYE Timer

## Contents
- [About NYE Timer](#about-nye-timer)
- [Getting Started](#getting-started)
- [Gotchas](#gotchas)
- [Customisation](#customisation)
    - [Target DateTime](#target-datetime)
    - [OBS](#obs)
    - [Adding Timezones](#adding-timezones)
    - [Counting down based on your timezone](#counting-down-based-on-your-timezone)

## About NYE Timer

This is a lightweight NodeJS app which solves a very specific problem...

For the past few years I've run a New Year's Eve stream on Twitch, in which I drink a shot for each timezone which hits midnight, essentially ringing in the new year for everyone between London and Honolulu*.

As you might imagine, keeping track of the time, which timezone is next, and updating timers, alerts, or anything else related to reminding me to drink gets progressively more difficult the ~~drunker~~ longer the stream goes on.

The solution (for me) is this app. It will countdown from the current (UK) time to Earth's next midnight. At 10 seconds to midnight, it will tell OBS (via websocket) to show a source - which will be audible to me and the audience - before continuing the track the time. At midnight, it will switch to the next listed timezone.

**I have never made it as far as Honolulu*

## Getting Started
*This assumes you have NodeJS already*

- `git clone https://github.com/TalonGrayson/NYE-Timer.git`
- `npm i`
- `npm run start`

The app runs in [nodemon](https://www.npmjs.com/package/nodemon)

## Gotchas

There's really only one I can think of, which is that the [Luxon](https://www.npmjs.com/package/luxon) package relies on your system's timezones to work. I'm running this on a Raspberry Pi, so the array of timezones has been tailored to match the timezones supported by Raspberry Pi OS Lite (a port of Debian Bookworm).

If you run this on a system which doesn't support the same timezones, you'll want to edit the array to match. In my case, I found the supported timezones in `usr/share/zoneinfo`, but YMMV.

## Customisation
Whilst this was designed to be a NYE Timer, it could be used to countdown to any time in one or many timezones, in chronological order. With that in mind, I didn't want to have to deploy code every time I wanted the target time to change, so some bits have been added to `.env` to aid that.

### Target DateTime
- Update the `.env`, setting `TARGET_DATETIME` using the format: `%Y-%m-%dT%H:%M:%S`, (e.g., `2069-09-19T13:00:00` for 1pm on International Talk Like a Pirate Day, 2069)
- Restart the app

### OBS
- To plug this into your OBS, add a `.env` file and populate it based on `.env-sample`
- If you don't, the app will still run, you'll just get some extra console logging telling you to update your `.env`
- With OBS connection info set, you can also tell the app which source to trigger:
    - Update the `.env`, setting the `OBS_ALERT_SCENE` to the scene in which the alert's source lives
    - Update the `.env`, setting the `OBS_ALERT_SOURCE` to the alert's source
    - Update the `.env`, setting the `OBS_ALERT_DURATION` to the alert's duration
    - Duration doesn't need to be exact, it just lets OBS know when to hide the alert again

### Adding Timezones
*This assumes you've read the [Gotchas](#gotchas) section*
- Update the `timezones` array to your liking. List them in chronological order.

### Counting down based on your timezone
- Update the `.env`, setting `MY_TIMEZONE` to use your timezone. This timezone does not need to appear in the `timezones` array, unless you want to countdown towards it at some point (which in most cases, you probably do).

I haven't made the 10 second countdown customisable (yet), but if you're familiar with JS, that will be easy to do in code.