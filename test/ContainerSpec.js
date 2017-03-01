import * as PIXI from 'pixi.js';
import Game from '../markup/components/game/game';
import Sprite from '../markup/components/sprite/sprite';
import Container from '../markup/components/container/container';

describe('Container class', () =>  {
    let container, containerWithParent, child;
    let handlersSpy, logicSpy, pauseSpy, resumeSpy;

    before(() => {
        container = new Container();
        containerWithParent = new Container(container);

        PIXI.utils.TextureCache['test'] = new PIXI.RenderTexture.create(50, 50);
        child = new Sprite({
            texture: 'test',
            container: containerWithParent
        });

        handlersSpy = chai.spy.on(child, 'addHandlers');
        logicSpy = chai.spy.on(child, 'addLogic');
        pauseSpy = chai.spy.on(child, 'pause');
        resumeSpy = chai.spy.on(child, 'resume');
    });

    it('default container should not have parent', () => {
        expect(container.parent).to.be.not.ok;
    });

    it('should have child after adding it', () => {
        expect(containerWithParent.children[0]).to.be.equal(child);
    });

    it('should have parent if we give this param', () => {
        expect(containerWithParent.parent).to.be.an('object');
    });

    it('should call addLogic method of its children', () => {
        containerWithParent.addHandlers();
        expect(handlersSpy).to.be.called.once;
    });

    it('should call addLogic method of its children', () => {
        containerWithParent.addLogic();
        expect(logicSpy).to.be.called.once;
    });

    it('should call pause method of its children', () => {
        containerWithParent.pause();
        expect(pauseSpy).to.be.called.once;
    });

    it('should call resume method of its children', () => {
        containerWithParent.resume();
        expect(resumeSpy).to.be.called.once;
    });

    it('should remove all its children and remove itself from parent container', () => {
        containerWithParent.destroy();
        expect(containerWithParent.parent).to.be.not.ok;
        expect(containerWithParent.children).to.be.empty;
    });

});
