import {Howl} from 'howler';
import audioSpriteSpec from "../../assets/sounds/audiosprite/audiosprite.json";
import audioSprite from "../../assets/sounds/audiosprite/audiosprite.mp3";

export default class Audio {

    constructor(name) {
        this.name = name;
        this.id = null;
    }

    play() {
        if (this.id == null) {
            this.id = Audio.audioSprite.play(this.name, Audio.HowlerInternal);
        } else {
            Audio.audioSprite.play(this.id, Audio.HowlerInternal);
        }
        return this;
    }

    loop(loop) {
        Audio.audioSprite.loop(loop, this.id);
        return this;
    }

    fade(from, to, len) {
        Audio.audioSprite.fade(from, to, len, this.id);
        return this;
    }

    playing() {
        return Audio.audioSprite.playing(this.id);
    }

    stop() {
        Audio.audioSprite.stop(this.id, Audio.HowlerInternal);
        return this;
    }


    static load() {
        Object.keys(audioSpriteSpec.sprite).forEach(audioName => {
            Audio.sounds[audioName] = new Audio(audioName);
        });
        Audio.audioSprite = new Howl({
            src: [audioSprite],
            sprite: audioSpriteSpec.sprite,
            html5: true
        });


    }

    static play(name, loop = false) {
        if (Audio.sounds[name]) {
            Audio.sounds[name].play().loop(loop);
        } else {
            console.err(`Trying to reproduce not existing audio: "${name}". File must be in src/assets/sounds, and call the function with the name of the file without extension`);
        }
    }

    static playFadingIn(name, loop = false) {
        if (Audio.sounds[name]) {
            Audio.sounds[name].play()
                .loop(loop)
                .fade(0, Audio.FOREGROUND_VOLUME, Audio.FADE_DURATION);
        } else {
            console.err(`Trying to reproduce not existing audio: "${name}". File must be in src/assets/sounds, and call the function with the name of the file without extension`);
        }
    }

    static isPlaying(name) {
        if (Audio.sounds[name]) {
            return Audio.sounds[name].playing();
        } else {
            console.err(`Trying to reproduce not existing audio: "${name}". File must be in src/assets/sounds, and call the function with the name of the file without extension`);
        }
    }

    static stopFadingOut(name) {
        if (Audio.sounds[name]) {
            Audio.sounds[name].fade(Audio.FOREGROUND_VOLUME, 0, Audio.FADE_DURATION)
                .stop();
        } else {
            console.err(`Trying to reproduce not existing audio: "${name}". File must be in src/assets/sounds, and call the function with the name of the file without extension`);
        }
    }


    static fadeToBackground(name) {
        if (Audio.sounds[name]) {
            Audio.sounds[name].fade(Audio.FOREGROUND_VOLUME, Audio.BACKGROUND_VOLUME, Audio.FADE_DURATION);
        } else {
            console.err(`Trying to reproduce not existing audio: "${name}". File must be in src/assets/sounds, and call the function with the name of the file without extension`);
        }
    }

    static fadeToForeground(name) {
        if (Audio.sounds[name]) {
            Audio.sounds[name].fade(Audio.BACKGROUND_VOLUME, Audio.FOREGROUND_VOLUME, Audio.FADE_DURATION);
        } else {
            console.err(`Trying to reproduce not existing audio: "${name}". File must be in src/assets/sounds, and call the function with the name of the file without extension`);
        }
    }


}

Audio.HowlerInternal = true;
Audio.sounds = [];
Audio.BACKGROUND_VOLUME = 0.04;
Audio.FOREGROUND_VOLUME = 1;
Audio.FADE_DURATION = 800;