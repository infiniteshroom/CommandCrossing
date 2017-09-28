import { ACHouse } from '../world/achouse';
import { AlertComponent } from '../component/alert.component';
import { DialogComponent } from '../component/dialog.component';
import { TitleScene } from './title.scene';
import { Music } from '../common/music';
import { TrainScene } from './train.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';

import * as charm from 'charm';

export class PlayerHouseScene extends BaseScene {

    tick = 0;
    

    private house:ACHouse = new ACHouse();

    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;
    };

    draw(): void {
        super.draw();
        this.screen.foreground("white");

        process.stderr.write('\x1B[?25l');
        this.screen.write(`
=============================
=                           =
=                           =
=                           =
=                           =
=                           =
=============================
        `);

        
        this.tick++;


    }

    processInput(key: any): void {
        super.processInput(key);

        if (key == '\u0071') {
            process.exit(0);
            Music.stopAll();
        }
    }


    music(player:Music) {
        Music.stopAll();

    }

}