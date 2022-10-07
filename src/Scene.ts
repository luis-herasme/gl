import { GameObject } from './GameObject';

export class Scene {
    private gameObjects: GameObject[] = [];

    addGameObject(gameObject: GameObject) {
        this.gameObjects.push(gameObject);
    }

    draw() {
        this.gameObjects.forEach((gameObject) => {
            gameObject.draw();
        });
    }
}
