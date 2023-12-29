module.exports = class Action {
    constructor(obsCon, eventInfo = {}) {
        this.obsCon = obsCon;
        console.log("eventInfo: %o", eventInfo);
        console.log("eventInfo.scene: %o", eventInfo.scene);
        this.scene = eventInfo.scene;
        this.source = eventInfo.source;
        this.duration = eventInfo.duration;
    }

    happyNewYear() {
        console.log("Happy new year!");
        this.#timedSourceDisplay();
    }

    #timedSourceDisplay() {
        this.obsCon?.obs
        .call("GetSceneItemId", {
            "sceneName": this.scene,
            "sourceName": this.source,
        })
        .then( (data) => {
            this.obsCon.obs
            .call("SetSceneItemEnabled", {
            "sceneName": this.scene,
            "sceneItemId": data.sceneItemId,
            "sceneItemEnabled": true,
            })
        })
        .then(
            setTimeout(() => {
            this.obsCon.obs
            .call("GetSceneItemId", {
                "sceneName": this.scene,
                "sourceName": this.source,
            })
            .then( (data) => {
                this.obsCon.obs
                .call("SetSceneItemEnabled", {
                "sceneName": this.scene,
                "sceneItemId": data.sceneItemId,
                "sceneItemEnabled": false,
                })
            })
            }, this.seconds(this.duration))
        )
        .catch((err) => {
            console.log({ Error: err });
        });
  };
}