module.exports = class Action {
    constructor(obsCon) {
        this.obsCon = obsCon
    }

    async happyNewYear(scene, source, duration) {
        this.#timedSourceDisplay(this.obsCon, scene, source, duration);
    }

    #timedSourceDisplay = (obsCon, scene, source, duration) => {
        this.obsCon?.obs
        .call("GetSceneItemId", {
            "sceneName": scene,
            "sourceName": source,
        })
        .then( (data) => {
            this.obsCon?.obs
            .call("SetSceneItemEnabled", {
            "sceneName": scene,
            "sceneItemId": data.sceneItemId,
            "sceneItemEnabled": true,
            })
        })
        .then(
            setTimeout(() => {
            this.obsCon?.obs
            .call("GetSceneItemId", {
                "sceneName": scene,
                "sourceName": source,
            })
            .then( (data) => {
                this.obsCon?.obs
                .call("SetSceneItemEnabled", {
                "sceneName": scene,
                "sceneItemId": data.sceneItemId,
                "sceneItemEnabled": false,
                })
            })
            }, duration * 1000)
        )
        .catch((err) => {
            console.error("Actions Error: %o", err);
        });
  };
}