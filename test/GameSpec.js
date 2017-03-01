import * as PIXI from 'pixi.js';
import Game from '../markup/components/game/game';

describe('Game class', () => {
    let game, Level;
    let initSpy, createSpy, updateSpy;
    let removeLevelSpy, removeStageSpy;

    before(() => {
        game = new Game(500, 500);

        initSpy = chai.spy();
        createSpy = chai.spy();
        updateSpy = chai.spy();
        removeLevelSpy = chai.spy();
        removeStageSpy = chai.spy.on(game.stage, 'removeChildren');

        Level = class {
            constructor() {}
            init() { initSpy() }
            create() { createSpy() }
            update() { updateSpy() }
        };

    });

    it('should start new level', () => {
        game.startLevel(Level);
        expect(initSpy).to.have.been.called.once;
        expect(createSpy).to.have.been.called.once;
        expect(updateSpy).to.have.been.called;
    });

    it('should clean stage or level', () => {
        game.startLevel(Level);
        expect(removeStageSpy).to.have.been.called;

        game.currentLevel = {
            removeLevel: removeLevelSpy
        };
        game.startLevel(Level);
        expect(removeLevelSpy).to.have.been.called.once;
    });

    it('should change preload baseUrl', () => {
        let addSpy = chai.spy.on(game.loader, 'add');
        game.preload([{name: 'someName', url: 'someUrl'}], 'someBaseUrl');
        expect(game.loader.baseUrl).to.be.equal('someBaseUrl');
        expect(addSpy).to.have.been.called.once;
    });

});
