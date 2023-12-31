// Use .env file for local environment variables
require('dotenv').config()
// Package: https://github.com/obs-websocket-community-projects/obs-websocket-js
// Docs: https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md
if(process.env.OBS_WEBSOCKET_ADDRESS) {
  const OBSWebSocket = require('obs-websocket-js').default;
  const obs = new OBSWebSocket();

  obs
    .connect(
      process.env.OBS_WEBSOCKET_ADDRESS,
      process.env.OBS_WEBSOCKET_PASSWORD
    )
    .then(() => {
      console.log(`OBSCon is connected to OBS... have a great stream!`);
    })
    .catch((err) => {
      console.log(`OBSCon could not connect to OBS!`);
      // Promise convention dicates you have a catch on every chain.
      console.log({ obs_websocket_error: err });
    });

  // You must add this handler to avoid uncaught exceptions.
  obs.on("error", (err) => {
    console.error("OBS Websocket Error (obs-connector):", err);
  });

  module.exports.obs = obs;
} else {
  console.log("OBS connection info not found - please update your .env per the README");
}
