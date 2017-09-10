import { NookScene } from './nook.scene';
import { Music } from '../common/music';
import { TownScene } from './town.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';

import * as charm from 'charm';

export class TitleScene extends BaseScene {

    tick = 0;
    


    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;
    };

    draw(): void {
        super.draw();
        this.screen.foreground("white");

        process.stderr.write('\x1B[?25l');

        var fs = require('fs');
        
        var data = fs.readFileSync('/home/mark/Documents/sites/commandCrossing/data/logo');

        this.screen.write(data);
        this.screen.write(`
\n© 2001 - 2017 Nintendo 
\nBy Mark J. Lang (Command line port)
\n\n`);

        if(this.tick % 60 === 0) {
            this.screen.erase("line");
        }

        else {
            this.screen.foreground("red");
            this.screen.write("Press Start");
        }

        this.tick++;

    }

    processInput(key: any): void {
        super.processInput(key);

        if (key == '\u0071') {
            Music.stopAll();
            process.exit(0);
        }

        else {
            SceneManager.set(new NookScene(this.screen,this.world));
        }
    }


    music(player:Music) {

        super.music(player);
        Music.stopAll();

        Music.playMusic("/home/mark/Documents/sites/commandCrossing/music/title.mp3");

    }

}