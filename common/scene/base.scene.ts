import { Music } from '../music';
import { ACTown } from '../../world/actown';
import { ACWorld } from '../../world/acworld';
import { SceneInterface } from './scene.interface';
import * as charm from 'charm';

export class BaseScene implements SceneInterface {
    protected screen:charm.CharmInstance;
    protected world:ACWorld;

    constructor(screen:charm.CharmInstance, world:ACWorld) {
        this.world = world;

        this.screen = screen;
        this.screen.reset();

        var stdin = process.stdin;

        // without this, we would only get streams once enter is pressed
        stdin.setRawMode(true);

        // resume stdin in the parent process (node app won't quit all by itself
        // unless an error or process.exit() happens)
        stdin.resume();

        // i don't want binary, do you?
        stdin.setEncoding( 'utf8' );
        // on any data into stdin
        stdin.removeAllListeners("data");

        stdin.on( 'data', (key) => {
            this.processInput(key);
        });

        let player:Music = new Music();

        this.music(player);


}
    
    draw(): void {
        this.screen.position(0,0);
        
    }
    
    processInput(key:any): void {

    }

    music(player:any) {

    }
}