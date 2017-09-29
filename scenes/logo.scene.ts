import { TitleScene } from './title.scene';
import { Music } from '../common/music';
import { TownScene } from './town.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';

import * as charm from 'charm';

export class LogoScene extends BaseScene {

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
        
        var data = fs.readFileSync(__dirname + '/../data/nintendo');

        this.screen.foreground("blue");
        this.screen.write(data);
        this.screen.foreground("white");
        this.tick++;

        if(this.tick > 70) {
            SceneManager.set(new TitleScene(this.screen,this.world));
        }

    }

    processInput(key: any): void {
        super.processInput(key);

        if (key == '\u0071') {
            process.exit(0);
            Music.stopAll();
        }

        else {
            SceneManager.set(new TitleScene(this.screen,this.world));
        }
    }


    music(player:Music) {

        super.music(player);
        Music.stopAll();

        Music.playMusic("/home/mark/Documents/sites/commandCrossing/music/nintendo.mp3");

    }

}