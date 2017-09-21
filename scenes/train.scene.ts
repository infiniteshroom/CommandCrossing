import { TitleScene } from './title.scene';
import { Music } from '../common/music';
import { TownScene } from './town.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';
import { EntryComponent } from './../component/entry.component';
import { AlertComponent } from './../component/alert.component';
import { DialogComponent } from './../component/dialog.component';

import * as charm from 'charm';

import * as moment from 'moment';

export class TrainScene extends BaseScene {

    tick = 0;

    roverX = 14;
    roverY = 4;

    roverSitting:boolean = false;

    
    private entry:EntryComponent = new EntryComponent("", "");
    private alert:AlertComponent = new AlertComponent("", "Rover");
    private dialog:DialogComponent = new DialogComponent("", "");


    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;
        this.alert.Visible = false;
        this.dialog.Visible = false;
    };

    draw(): void {
        super.draw();

        //do this every 20 ticks
        if(this.tick % 15 == 0 && !this.roverSitting) {
            if(this.roverY < 8) {
                this.roverY++;
            }

            if(this.roverY == 8) {
                if(this.roverX > 4) {
                    this.roverX--; 
                }
            }
        }

        //Next to player
        if(this.roverY == 8 && this.roverX == 4 && !this.dialog.Visible) {
            var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            let time:string = moment().format('MMMM Do YYYY, h:mm:ss a');
            this.dialog = new DialogComponent("Hrmmm...uh...Excuse me...Do you have a second? Could you help me out? Is it... Let's see now.. " + time + "?", "Rover",["That's Right", "That's wrong!"],"red");
            this.dialog.Visible = true;
            this.dialog.onChoice = (choice:number) => {
                 this.roverSitting = true;
                this.roverSittingConvo();            
            }
        }

        this.screen.write(`


=============🚪===========
| [ ][ ]          [ ][🐁]|
|                        |
| [ ][ ]          [🐂][ ]|
|                        |
| [$][ ]          [ ][ ] |
|                        |
==========================
        `);

        this.entry.draw(this.screen);
        this.dialog.draw(this.screen);
        this.alert.draw(this.screen);

        this.screen.position(<number>this.roverX, this.roverY);
        this.screen.foreground("red");
        this.screen.write("R");
        this.screen.foreground("white");
        this.tick++;

    }

    processInput(key: any): void {
        super.processInput(key);
        this.entry.processInput(key);
        this.dialog.processInput(key);
        this.alert.processInput(key);

        if(!this.entry.Visible && !this.dialog.Visible && !this.alert.Visible) {
            if (key == '\u0071') {
                process.exit(0);
                Music.stopAll();
            }
        }
    }


    music(player:Music) {

        super.music(player);
        Music.stopAll();

        Music.playMusic("/home/mark/Documents/sites/commandCrossing/music/train.mp3");

    }

    protected roverSittingConvo() {
        this.dialog = new DialogComponent("Say, thanks! you're too kind! Really, you're a big help... mya ha ha ha ha howr! So, you mind if I sit here? I promise I won't feel asleep, tumble onto you, and start drooling on your shirt!", "Rover", ["Please", "No Way!"]);
        this.dialog.Visible = true;
        this.dialog.onChoice = (choice:number) => {
            this.roverSitsDown(choice);
        };
    }

    protected roverSitsDown(choice:number) {
        //rover sits in seat :3
        this.roverY--;


        //TODO: no way!
        this.alert = new AlertComponent("Thanks again! It sure is nice meeting friendly folk on the train...You aren't a psycho right? Just kidding! Say by the way...What's your name?", "Rover");
        this.alert.Visible = true;
        this.alert.onComplete = () => {
            if(!this.entry.Visible && this.world.Player.Name == '') {
                this.entry = new EntryComponent("Enter your name.", "👤");
                this.entry.Visible = true;
                this.entry.onSubmit = (text:string) => {
                    this.roverNameConvo(text);
                }
            }
        }

    }

    protected roverNameConvo(name:string) {
        this.world.Player.Name = name;

        this.dialog = new DialogComponent(`Hrmm... well...${name}...Now THAT is an odd name. Mya ha ha howr! Not that my opinion means much. What matters is, do YOU like the name ${name}?`, "Rover", ["Isn't it cool?", "Isn't it cute?"]);
        this.dialog.Visible = true;
    }

}