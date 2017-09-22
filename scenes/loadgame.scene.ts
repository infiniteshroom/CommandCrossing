import { TitleScene } from './title.scene';
import { Music } from '../common/music';
import { TownScene } from './town.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';

import { LogoScene } from './logo.scene';

import { DialogComponent } from '../component/dialog.component'; 
import { AlertComponent } from '../component/alert.component';

import * as charm from 'charm';
import * as moment from 'moment';


export enum RoverLoadStates {
    Intro = 1,
    Load = 2,
}

export class LoadGameScene extends BaseScene {

    tick = 0;
    
    private dialog:DialogComponent = new DialogComponent("", "Rover", []);
    private alert:AlertComponent = new AlertComponent("", "");

    private roverLoadState:RoverLoadStates = RoverLoadStates.Intro;

    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;

        this.alert.Visible = false;

        this.roverLoadState = RoverLoadStates.Intro;
    };

    draw(): void {
        super.draw();
        this.screen.foreground("white");

        process.stderr.write('\x1B[?25l');

        var fs = require('fs');
        
        var data = fs.readFileSync('/home/mark/Documents/sites/commandCrossing/data/rover');

        this.screen.foreground("blue");
        this.screen.write(data);
        this.screen.foreground("white");

        this.dialog.draw(this.screen);
        this.alert.draw(this.screen);
        

        this.world.loadGame();

        let townName = this.world.Town.Name;
        let time:string = moment().format('MMMM Do YYYY, h:mm:ss a');

        if(!this.alert.Visible && !this.dialog.Visible) {
            switch(this.roverLoadState){
                case RoverLoadStates.Intro:
                    this.dialog = new DialogComponent(`Hey! What took you so long, dude. It's ${time} in ${townName} right now. Ready to get rolling?`, "Rover", ["Yes", "No"]);
                    this.dialog.Visible = true;
                    this.dialog.onChoice = (choice:number) => {
                        if(choice == 1) {
                            SceneManager.set(new LogoScene(this.screen, this.world));
                        }

                        else {
                            this.roverLoadState = RoverLoadStates.Load;
                        }
                    }

                break;

                case RoverLoadStates.Load:
                
                    this.alert = new AlertComponent(`All right I'm going to get things ready hold on. I'm getting ${townName} ready for you. Do not close the terminal window or power off your PC! Thanks for waiting, have a blast in ${townName}`, "Rover");
                    this.alert.Visible = true;
                    this.alert.onComplete = () => {
                        this.world.loadGame();
                        SceneManager.set(new TownScene(this.screen, this.world));
                    }
                break;


            }
        }
        
        this.tick++;

    }

    processInput(key: any): void {
        super.processInput(key);
        this.dialog.processInput(key);
        this.alert.processInput(key);

        if (key == '\u0071') {
            process.exit(0);
            Music.stopAll();
        }

    }


    music(player:Music) {

        super.music(player);
        Music.stopAll();

        Music.playMusic("/home/mark/Documents/sites/commandCrossing/music/load.mp3");

    }

}