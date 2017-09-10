import { SceneInterface } from './scene.interface';
export class SceneManager {
    private static scene:SceneInterface = null;

    public static set(scene:SceneInterface) {
        this.scene = scene;
    }

    public static get(): SceneInterface {
        return this.scene;
    }
}