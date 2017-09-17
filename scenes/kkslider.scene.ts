import { AlertComponent } from '../component/alert.component';
import { DialogComponent } from '../component/dialog.component';
import { TitleScene } from './title.scene';
import { Music } from '../common/music';
import { TownScene } from './town.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';

import * as charm from 'charm';

export class KKSliderScene extends BaseScene {

    tick = 0;
    stage = 0;
    
    private alert:AlertComponent = new AlertComponent("So, you've decided to move out? Get your own place? See the world? That's groovy. Who needs someone telling you what to do all the time? You can do what you want when you want, where you want. Yeah living on your own, being free. It feels great...But living by yourself can be a real drag, too. Still if you've got some really tight friends somewhere nearby, then you know it'll all work out.Yeah, man. Friends are far out.", "K.K", "green");
    private dialog:DialogComponent = new DialogComponent("", "K.K" ,[]);

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
        
        var data = fs.readFileSync('/home/mark/Documents/sites/commandCrossing/data/kk');

        this.screen.write(data);

        this.alert.draw(this.screen);

        if(this.alert.Visible == false && this.stage == 0) {
            this.dialog = new DialogComponent("Oh. I guess I'm kind of rambiling. my bad. So are you ready to hop on that train and go for a ride?", "K.K", ["I'm ready to go!", "Before I go.."], "green");
            this.dialog.Visible = true;
            this.stage++;
            this.dialog.onChoice = (choice:number) => {
                if(choice == 0) {
                    this.alert = new AlertComponent("Oh! I almost forgot you'll enjoy your time in the world of Command Crossing more if you get some friends to come here, too. Yeah, it would be really cool if a lot of your friends came to visit your town. Later.", "K.K", "green");
                    this.alert.Visible = true;
                    this.stage++;
                }

                else {
                 
                    SceneManager.set(new TitleScene(this.screen, this.world));
                }
            };
        }

        if(this.alert.Visible == false && this.stage == 2) {
            SceneManager.set(new TownScene(this.screen, this.world));
        }

        this.dialog.draw(this.screen);
        this.tick++;


    }

    processInput(key: any): void {
        super.processInput(key);
        this.alert.processInput(key);

        this.dialog.processInput(key);

        if (key == '\u0071') {
            process.exit(0);
            Music.stopAll();
        }
    }


    music(player:Music) {

        super.music(player);
        Music.stopAll();

        Music.playMusic("/home/mark/Documents/sites/commandCrossing/music/kk-intro.mp3");

    }

}