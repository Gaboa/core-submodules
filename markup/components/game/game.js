import jsonp from 'jsonp';
import { Observable, Subject } from 'rxjs';

export default class Game extends PIXI.Application {

    constructor(width, height, options) {
        // Initialize
        super(width, height, options);
        document.querySelector('#game').appendChild(this.view);
        window.game = this;

        // Config
        this.width = width;
        this.height = height;
        this.aspectRatio = width / height;
        this.res = options.res;
        this.device = options.device;

        // Add keyboard streams
        this.setupBasicStreams();
        this.addKeyboardStreams();

        // Add audio module
        this.audio = new AudioModule();

        // Add request module
        this.request = new RequestModule({
            url: 'https://devservice.bossgs.org/backdevtest/SlotService.svc',
            device: this.device
        });

        // Resize handler
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();

        // Set 30 FPS
        this.ticker._tick = (time) => {
            this.ticker._requestId = null;

            if (time - this.ticker.lastTime > 30) {

                if (this.ticker.started) {
                    // Invoke listeners now
                    this.ticker.update(time);
                    // Listener side effects may have modified ticker state.
                    if (this.ticker.started && this.ticker._requestId === null) {
                        this.ticker._requestId = requestAnimationFrame(this.ticker._tick.bind(this));
                    }
                }

            } else {

                this.ticker._requestId = requestAnimationFrame(this.ticker._tick.bind(this));

            }

        };

        // Logout after tab closing
        window.addEventListener('beforeunload', () => {
            this.request.sendLogout();
        });

        // Settings params
        this.side = 'left';
        this.isFast = false;
        this.isAutoTransition = false;
        this.isSavedAuto = true;

        this.isSound = true;
        this.isEffects = true;
        this.isMusic = true;
        this.lastVolume = 50;

        // Fullscreen for mobiles
        this.view.addEventListener('click', (event) => {
            if (!document.webkitCurrentFullScreenElement && this.device === 'mobile') {
                this.enterFullscreen();
            }
        });

    }

    checkCurrencySymbol(str) {
        switch (str) {
            case 'USD':
                this.currencySymbol = '$';
                break;
            case 'cns':
                this.currencySymbol = '$';
                break;
            case 'EUR':
                this.currencySymbol = '€';
                break;
            case 'UAH':
                this.currencySymbol = '₴';
                break;
            case 'RUB':
                this.currencySymbol = '₽';
                break;
            default:
                this.currencySymbol = `${str}`;
        }
    }

    setupBasicStreams() {
        // Setup basic streams
        this.init$ = new Subject(); // Init stream
        this.enter$ = new Subject(); // Enter this stream
        this.roll$ = new Subject(); // Roll stream
        this.ready$ = new Subject(); // Ready stream
        this.win$ = new Subject(); // Win stream (when we could play another roll)
        this.start$ = new Subject(); // Start of roll
        this.end$ = new Subject(); // End of roll
        this.sound$ = new Subject(); // Sound stream
    }

    addKeyboardStreams() {
        this.keyboard = {};
        this.keyboard.enabled = true;

        this.keyboard.$ = Observable.fromEvent(document, 'keyup').pluck('code');
        this.keyboard.enter$ = this.keyboard.$
            .map(next => String(next).toLowerCase())
            .filter(next => next === 'enter');
    }

    changeLevelTo(Level) {
        this.level = new Level();
    }

    preload(arr, baseUrl, onComplete) {
        if (baseUrl) {
            this.loader.baseUrl = baseUrl;
        }
        arr.forEach((element) => {
            this.loader.add(element);
        });
        this.loader.load(onComplete);
    }

    handleError(message) {
        document.querySelector('.popup__text').innerHTML = message;
        document.querySelector('#popup').classList.remove('closed');
        document.querySelector('#darkness').classList.remove('closed');
    }

    // Fullscreen and resize
    enterFullscreen(div = '#game') {
        let element = document.querySelector(div);
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }

    cancelFullscreen(div = 'canvas') {
        let element = document.querySelector(div);
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

    resize() {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        let scaleX = windowWidth / this.width;
        let scaleY = windowHeight / this.height;

        this.scale = Math.min(scaleX, scaleY);
        this.view.style.transform = `scale(${this.scale}, ${this.scale})`;
    }

}

export class RequestModule {

    constructor({
        url,
        device
    }) {
        this.url = url;
        this.device = device;
        this.getUrlParams();
    }

    getUrlParams(url) {

        // get query string from url (optional) or window
        let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

        // we'll store the parameters here
        let obj = {};

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            let arr = queryString.split('&');

            for (let i = 0; i < arr.length; i++) {
                // separate the keys and the values
                let a = arr[i].split('=');

                // in case params look like: list[]=thing1&list[]=thing2
                let paramNum;
                let paramName = a[0].replace(/\[\d*\]/, function (v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });

                // set parameter value (use 'true' if empty)
                let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                paramValue = paramValue.toLowerCase();

                // if parameter name already exists
                if (obj[paramName]) {
                    // convert value to array (if still string)
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    // if no array index number specified...
                    if (typeof paramNum === 'undefined') {
                        // put the value on the end of the array
                        obj[paramName].push(paramValue);
                        // if array index number specified...
                    } else {
                        // put the value at that index number
                        obj[paramName][paramNum] = paramValue;
                    }
                    // if param name doesn't exist yet, set it
                } else {
                    obj[paramName] = paramValue;
                }
            }
        }

        this.urlParams = obj;
    }

    // Requests
    send(url, stream) {
        jsonp(url, { timeout: 5000 }, (err, data) => {
            if (err) {
                game[stream].error(err.message);
            } else {
                game[stream].next(data);
            }
        });
    }

    sendInit() {
        this.sID = this.urlParams.sid || `dev_${Math.round(Math.random() * 10000)}`;
        this.mode = this.urlParams.mode || 'animals3'; // animals4   anifs3
        const initURL = `${this.url}/_Initialise/${this.sID}/${this.mode}`;
        this.send(initURL, 'init$');
    }

    sendRoll() {
        let level, value;
        if (this.device === 'desktop') {
            level = game.level.machine.balance.level.current;
            value = game.level.machine.balance.value.current * 100;
        }
        if (this.device === 'mobile') {
            level = game.level.menu.bet.level.current;
            value = game.level.menu.bet.value.current;
        }
        const rollURL = `${this.url}/_Roll/${this.sID}/${level}/${value}/0`;
        this.send(rollURL, 'roll$');
    }

    sendReady() {
        const readyURL = `${this.url}/_Ready/${this.sID}`;
        this.send(readyURL, 'ready$');
    }

    sendLogout() {
        const logoutURL = `${this.url}/_Logout/${this.sID}`;
        this.send(logoutURL, 'ready$');
    }

}

export class AudioModule {

    constructor() {

        this.addLoaderConfig();

        this.effects = [];
        this.music = [];

        this.setupStreams();

    }

    setupStreams() {
        game.sound$
            .filter(next => typeof next === 'object')
            .filter(next => typeof next.music === 'boolean')
            .subscribe(next => {
                game.isMusic = next.music;
                if (next.music) {
                    this.unmuteMusic();
                    game.sound$.next('on');
                } else {
                    this.muteMusic();
                    if (game.isEffects === false) {
                        game.sound$.next('off');
                    }
                }
            });

        game.sound$
            .filter(next => typeof next === 'object')
            .filter(next => typeof next.effects === 'boolean')
            .subscribe(next => {
                game.isEffects = next.effects;
                if (next.effects) {
                    this.unmuteEffects();
                    game.sound$.next('on');
                } else {
                    this.muteEffects();
                    if (game.isMusic === false) {
                        game.sound$.next('off');
                    }
                }
            });

        game.sound$
            .filter(next => typeof next === 'boolean')
            .subscribe(next => {
                if (next) {
                    game.isSound = true;
                    game.isMusic = true;
                    game.isEffects = true;
                    if (game.device === 'desktop') {
                        document.querySelector('#music').checked = true;
                        document.querySelector('#effects').checked = true;
                    }
                    if (game.device === 'mobile') {
                        game.level.menu.settings.music.sprite.texture = PIXI.utils.TextureCache['settings_music.png'];
                        game.level.menu.settings.effects.sprite.texture = PIXI.utils.TextureCache['settings_sound.png'];
                    }
                    this.unmute();
                } else {
                    game.isSound = false;
                    game.isMusic = false;
                    game.isEffects = false;
                    if (game.device === 'desktop') {
                        document.querySelector('#music').checked = false;
                        document.querySelector('#effects').checked = false;
                    }
                    if (game.device === 'mobile' && game.level.menu) {
                        game.level.menu.settings.music.sprite.texture = PIXI.utils.TextureCache['settings_music_off.png'];
                        game.level.menu.settings.effects.sprite.texture = PIXI.utils.TextureCache['settings_sound_off.png'];

                    }
                    this.mute();
                }
            });

        game.sound$
            .filter(next => typeof next === 'number')
            .subscribe(next => {
                game.lastVolume = next;
                this.effects.forEach(effect => effect.volume = next / 100);
                this.music.forEach(music => music.volume = next / 100);
            });
    }

    addLoaderConfig() {
        // Set default loading mechanism for sound file extensions to use XHR
        let Resource = PIXI.loaders.Resource;
        Resource.setExtensionLoadType('wav', Resource.LOAD_TYPE.XHR);
        Resource.setExtensionLoadType('mp3', Resource.LOAD_TYPE.XHR);
        Resource.setExtensionLoadType('ogg', Resource.LOAD_TYPE.XHR);
        Resource.setExtensionLoadType('webm', Resource.LOAD_TYPE.XHR);

        // Set default loading type for sound file extensions to be arraybuffer
        Resource.setExtensionXhrType('wav', Resource.XHR_RESPONSE_TYPE.BUFFER);
        Resource.setExtensionXhrType('mp3', Resource.XHR_RESPONSE_TYPE.BUFFER);
        Resource.setExtensionXhrType('ogg', Resource.XHR_RESPONSE_TYPE.BUFFER);
        Resource.setExtensionXhrType('webm', Resource.XHR_RESPONSE_TYPE.BUFFER);
    }

    mute() {
        PIXI.audioManager.mute();
        this.music.muted = true;
        this.effects.muted = true;
    }

    unmute() {
        PIXI.audioManager.unmute();
        this.music.muted = false;
        this.effects.muted = false;
    }

    playMusic(name, volume = game.lastVolume / 100, loop = true, fade = true) {
        let music = PIXI.audioManager.getAudio(`${name}_sound`);
        music.loop = loop;
        music.volume = volume;

        if (this.music.length) {
            if (fade) {
                let timeline = new TimelineLite();
                timeline
                    .set(music, { volume: 0 })
                    .to(this.music[0], 0.3, { volume: 0,
                        onComplete: () => {
                            this.music[0].stop();
                            this.music.shift();
                            this.music.push(music);
                            music.play();
                        }
                    })
                    .to(music, 0.3, { volume });
            }
        } else {
            music.play();
            if (fade) {
                music.volume = 0;
                this.music.push(music);
                TweenMax.to(music, 0.75, { volume });
            }
        }

        if (this.music.muted) {
            music.muted = true;
        }

    }

    muteMusic() {
        this.music.muted = true;
        this.music.forEach(music => music.muted = true);
    }

    unmuteMusic() {
        this.music.muted = false;
        this.music.forEach(music => music.muted = false);
    }

    playEffect(name, volume = game.lastVolume / 100) {
        let effect = PIXI.audioManager.getAudio(name);
        effect.volume = volume;
        effect.name = name;
        if (this.effects.muted) {
            effect.muted = true;
        }
        effect.play();

        this.effects.push(effect);
        effect.on('end', event => this.effects.splice(this.effects.indexOf(effect), 1));
        effect.on('stop', event => this.effects.splice(this.effects.indexOf(effect), 1));
    }

    stopEffect(name) {
        this.effects
            .filter(effect => effect.name === name)
            .forEach(effect => effect.stop());
    }

    muteEffects() {
        this.effects.muted = true;
        this.effects.forEach(effect => effect.muted = true);
    }

    unmuteEffects() {
        this.effects.muted = false;
        this.effects.forEach(effect => effect.muted = false);
    }

}
