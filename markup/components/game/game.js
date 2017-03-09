export default class Game extends PIXI.Application {
    constructor(width, height, backgroundColor = 0x1099bb) {
        // Initialize
        super(width, height, { backgroundColor });
        document.body.appendChild(this.view);
        window.game = this;

        // Config
        this.width = width;
        this.height = height;
        this.aspectRatio = width / height;

        // Add loader
        this.loader = PIXI.loader;

        // Resize handler
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    }
    startLevel(Level) {
        if (this.currentLevel && this.currentLevel.removeLevel) {
            this.currentLevel.removeLevel();
        } else {
            this.stage.removeChildren();
        }

        this.currentLevel = new Level(this);

        this.currentLevel.create && this.currentLevel.create();
        this.currentLevel.addHandlers && this.currentLevel.addHandlers();

        this.ticker.add(this.currentLevel.addLogic, this.currentLevel);
    }
    resize() {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        let scaleX = windowWidth / this.width;
        let scaleY = windowHeight / this.height;

        let scale = Math.min(scaleX, scaleY);

        this.view.style.transform = `scale(${scale}, ${scale})`;
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
}
