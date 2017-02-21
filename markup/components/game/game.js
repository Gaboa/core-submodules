export default class Game extends PIXI.Application {
    constructor(width, height, backgroundColor = 0x1099bb) {
        // Initialize
        super(width, height, { backgroundColor });
        document.body.appendChild(this.view);
        window.game = this;

        // Config
        this.fixedBG = true;
        this.aspectRatio = width / height;

        // Resize handler
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    }
    startLevel(Level) {
        this.stage.removeChildren();

        this.currentLevel = new Level();

        this.currentLevel.init && this.currentLevel.init();
        this.currentLevel.create && this.currentLevel.create();
        this.currentLevel.handlers && this.currentLevel.handlers();
        game.ticker.add(this.currentLevel.update.bind(this.currentLevel));
    }
    resize() {
        if (this.fixedBG) {
            let newWidth, newHeight;
            if (window.innerWidth > window.innerHeight * this.aspectRatio) {
                newHeight = window.innerHeight;
                newWidth = newHeight * this.aspectRatio;
            } else {
                newWidth = window.innerWidth;
                newHeight = newWidth / this.aspectRatio;
            }
            this.renderer.resize(newWidth, newHeight);
        } else {
            this.renderer.resize(window.innerWidth, window.innerHeight);
        }
    }
    preload(arr, baseUrl, onComplete) {
        this.loader = PIXI.loader;
        this.loader.baseUrl = baseUrl || '';
        arr.forEach((element) => {
            this.loader.add(element);
        });
        this.loader.load(onComplete);
    }
}
