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

export enum RoverStates {
    Walking = 0,
    Time = 1,
    Sit = 2,
    NoSit = 3,
    Name = 4,
    LikeName = 5,
    OddName = 6,
    GirlName = 7,
    BoyName = 8,
    Town = 9,
    WhyTown = 10,
    TownNotTelling = 11,
    Stay = 12,
    NoPlace = 13,
    LeaveMeAlone = 14,
    WalkingOutside = 15,
    TalkingToNook = 16,
    WalkingInside = 17,
    Money = 18,
    Stopping = 19,
    AltStopping = 20,

}

export class TrainScene extends BaseScene {

    tick = 0;

    roverX = 14;
    roverY = 4;

    dialogInProcess:boolean = false;

    roverState:RoverStates = RoverStates.Walking;

    
    private entry:EntryComponent = new EntryComponent("", "");
    private alert:AlertComponent = new AlertComponent("", "Rover");
    private dialog:DialogComponent = new DialogComponent("", "");


    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;
        this.alert.Visible = false;
        this.dialog.Visible = false;
        this.entry.Visible = false;
    };

    draw(): void {
        super.draw();
        this.screen.erase("down");

        process.stderr.write('\x1B[?25l');

        this.updateRover();


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

    updateRover(): void {

        //Next to player
        if(this.roverY == 8 && this.roverX == 4 && this.roverState == RoverStates.Walking) {
            this.roverState = RoverStates.Time;
        }

        if(this.roverY == 8 && this.roverX == 4 && this.roverState == RoverStates.WalkingInside) {
            this.roverState = RoverStates.Money;
            this.dialogInProcess = false;
        }

        //do this every 20 ticks
        if(this.tick % 15 == 0 && this.roverState == RoverStates.Walking) {
            if(this.roverY < 8) {
                this.roverY++;
            }

            if(this.roverY == 8) {
                if(this.roverX > 4) {
                    this.roverX--; 
                }
            }
        }

         if(this.tick % 15 == 0 && this.roverState == RoverStates.WalkingOutside) {

            if(this.roverX < 14) {
                this.roverX++;
            } 

            if(this.roverX == 14) {
                if(this.roverY > 3) {
                    this.roverY--;
                }
            }
        } 

        if(this.tick % 12 == 0 && this.roverState == RoverStates.WalkingInside) {
            if(this.roverY < 8) {
                this.roverY++;
            }

            if(this.roverY == 8) {
                if(this.roverX > 4) {
                    this.roverX--; 
                }
            } 

        }

        if(this.roverY == 3 && this.roverX == 14 && this.roverState == RoverStates.WalkingOutside) {
            //state talk to nook
            this.roverState = RoverStates.TalkingToNook;
        }

        if(this.roverState != RoverStates.Walking && this.roverState != RoverStates.WalkingOutside && this.roverState != RoverStates.WalkingInside) {

            if (!this.dialogInProcess) {
                this.dialogInProcess = true;
                switch (this.roverState) {

                    case RoverStates.Time:
                    this.roverTimeDialog();
                    break;

                    case RoverStates.Sit:
                    this.roverSitDialog();
                    break;

                    case RoverStates.NoSit:
                    this.roverNoSitDialog();
                    break;

                    case RoverStates.Name:
                    this.roverNameDialog();
                    break;

                    case RoverStates.LikeName:
                    this.roverLikeNameDialog();
                    break;

                    case RoverStates.BoyName:
                    this.roverBoyNameDialog();
                    break;

                    case RoverStates.GirlName:
                    this.roverGirlNameDialog();
                    break;

                    case RoverStates.Town:
                    this.roverTownDialog();
                    break;

                    case RoverStates.WhyTown:
                    this.roverTownWhyDialog();
                    break;

                    case RoverStates.TownNotTelling:
                    this.roverTownNotTellingDialog();
                    break;

                    case RoverStates.Stay:
                    this.roverStayDialog();
                    break;

                    case RoverStates.NoPlace:
                    this.roverNoPlaceDialog();
                    break;

                    case RoverStates.LeaveMeAlone:
                    this.roverLeaveMeAloneDialog();
                    break;

                    case RoverStates.TalkingToNook:
                    this.roverTalkingToNook();
                    break;

                    case RoverStates.Money:
                    this.roverMoneyDialog();
                    break;
                   
                    case RoverStates.Stopping:
                    this.roverStoppingDialog();
                    break;

                    case RoverStates.AltStopping:
                    this.roverAltStoppingDialog();
                    break;
                }
            }
        }

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

        Music.playMusic(__dirname + "/../music/train.mp3");

    }

    protected roverTimeDialog() {
        this.dialogInProcess = true;
        
        var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let time:string = moment().format('MMMM Do YYYY, h:mm:ss a');
        this.dialog = new DialogComponent("Hrmmm...uh...Excuse me...Do you have a second? Could you help me out? Is it... Let's see now.. " + time + "?", "Rover",["That's Right", "That's wrong!"],"red");
        this.dialog.Visible = true;
        this.dialog.onChoice = (choice:number) => {
            this.roverState = RoverStates.Sit;
            this.dialogInProcess = false;          
        }

    }
    protected roverSitDialog() {
        this.dialog = new DialogComponent("Say, thanks! you're too kind! Really, you're a big help... mya ha ha ha ha howr! So, you mind if I sit here? I promise I won't feel asleep, tumble onto you, and start drooling on your shirt!", "Rover", ["Please", "No Way!"]);
        this.dialog.Visible = true;
        this.dialog.onChoice = (choice:number) => {

            if(choice == 0) {
                this.roverState = RoverStates.Name;
            }

            else {
                this.roverState = RoverStates.NoSit;
            }
            this.dialogInProcess = false;
        };
    }

    protected roverNoSitDialog() {
        this.alert = new AlertComponent("Wow, it's nice to know there are still plenty of rude people in the world. Know what? I'm going to sit here anyway. I don't even know why I'm bothering to ask this but what's your name?", "Rover");
        this.alert.Visible = true;
        this.alert.onComplete = (choice:number) => {
            if(!this.entry.Visible && this.world.Player.Name == '') {
                this.entry = new EntryComponent("Enter your name.", "👤");
                this.entry.Visible = true;
                this.entry.onSubmit = (text:string) => {
                    this.world.Player.Name = text;
                    this.roverState = RoverStates.LikeName;
                    this.dialogInProcess = false;
                }
            }
        };
    }


    protected roverNameDialog() {
        //rover sits in seat :3
        this.roverY--;


        this.alert = new AlertComponent("Thanks again! It sure is nice meeting friendly folk on the train...You aren't a psycho right? Just kidding! Say by the way...What's your name?", "Rover");
        this.alert.Visible = true;
        this.alert.onComplete = () => {
            if(!this.entry.Visible && this.world.Player.Name == '') {
                this.entry = new EntryComponent("Enter your name.", "👤");
                this.entry.Visible = true;
                this.entry.onSubmit = (text:string) => {
                    this.world.Player.Name = text;
                    this.roverState = RoverStates.LikeName;
                    this.dialogInProcess = false;
                }
            }
        }

    }

    protected roverLikeNameDialog() {

        let name = this.world.Player.Name;

        this.dialog = new DialogComponent(`Hrmm... well...${name}...Now THAT is an odd name. Mya ha ha howr! Not that my opinion means much. What matters is, do YOU like the name ${name}?`, "Rover", ["Isn't it cool?", "Isn't it cute?"]);
        this.dialog.Visible = true;
        this.dialog.onChoice = (choice:number) => {

            if(choice == 0) {
                this.roverState = RoverStates.BoyName;
            }

            else {
                this.roverState = RoverStates.GirlName;
            }

            this.dialogInProcess = false;
        }
    }

    protected roverGirlNameDialog() {
        this.dialog = new DialogComponent("You're right! Of course! What was I thinking? I think it's a very cute name for a very cute girl. I, uh, I'm sorry I said it sounded funny. Honestly.", "Rover", ["You know it!", "I'm not a girl!"]);
        this.dialog.Visible = true; 
        this.dialog.onChoice = (choice:number) => {

            if(choice == 0) {
                this.roverState = RoverStates.Town;
            }   

            else {
                this.roverState = RoverStates.BoyName;
            } 

            this.dialogInProcess = false;
        };

    }

    protected roverBoyNameDialog() {
        this.dialog = new DialogComponent("Oh, I'm sorry! Did I say it was odd? It's not odd! It's a great name for a boy! Really it's uh...It's a really great name. Mya ha ha ha ha ha howr!", "Rover", ["You know it!", "I'm not a boy!"]);
        this.dialog.Visible = true; 
        this.dialog.onChoice = (choice:number) => {
            if(choice == 0) {
                this.roverState = RoverStates.Town;
            }   

            else {
                this.roverState = RoverStates.GirlName;
            } 
            
            this.dialogInProcess = false;
        };
    }

    protected roverTownDialog() {
        this.alert = new AlertComponent("By the way...if you don't mind me asking..where are you headed?", "Rover");
        this.alert.Visible = true;
        this.alert.onComplete = () => {

            if(!this.entry.Visible && this.world.Town.Name == '') {
                this.entry = new EntryComponent("Enter Destination", "💼");
                this.entry.Visible = true;
                this.entry.onSubmit = (text:string) => {
                    this.world.Town.Name = text;
                    this.roverState = RoverStates.WhyTown;
                    this.dialogInProcess = false;
                }
            }
        }
    }



    protected roverTownWhyDialog() {
        let townName = this.world.Town.Name;
        this.dialog = new DialogComponent(`Hey! I know that place! ${townName} is one of my favorite vacation spots! So what are you going to ${townName} for?`, "Rover", ["I'm moving", "What's it to ya?"]);
        this.dialog.Visible = true;
        this.dialog.onChoice = (choice:number) => {
            
            if(choice == 0) {
                this.roverState = RoverStates.Stay;
            }

            else {
                this.roverState = RoverStates.TownNotTelling;
            }
            this.dialogInProcess = false;

        }
        
    }

    protected roverTownNotTellingDialog() {
        this.dialog = new DialogComponent("Fine, fon't tell me! Be like that! I don't care! I know you're moving, though. I can see it in your eyes! So what are you going to ${townName} for?","Rover", ["Don't know yet.", "Leave me alone!"]);
        this.dialog.Visible = true;
        this.dialog.onChoice = (choice:number) => {

            if(choice == 0) {
               this.roverState = RoverStates.NoPlace;
            }

            else {
                this.roverState = RoverStates.LeaveMeAlone;
            }

            this.dialogInProcess = false;
        }
    }

    protected roverStayDialog() {
        this.dialog = new DialogComponent("Hrmm...Moving, huh? I hate moving. Pack boxes, unpack boxes. It never ends. Say! Where's your new place?","Rover", ["Don't know yet.", "Leave me alone!"]);
        this.dialog.Visible = true;
        this.dialog.onChoice = (choice:number) => {
            
            if(choice == 0) {
               this.roverState = RoverStates.NoPlace;
            }

            else {
                this.roverState = RoverStates.LeaveMeAlone;
            }
            this.dialogInProcess = false;
        }
    }

    protected roverLeaveMeAloneDialog() {
        let townName = this.world.Town.Name;

        
        this.alert = new AlertComponent(`Don't...Don't tell me...You haven't found a place to live yer?!? Mya ha howr! Of course you have! Who..WHATT?!? You haven't?!? You can't just show up with no place to live! We'd better find you a pad, and fast! Oh! Of Course Duh! A good friend of mine runs the shop in ${townName}. Let me give him a ring! You wait right here!`, "Rover");
        this.alert.Visible = true;
        this.alert.onComplete = () => {
            this.roverState = RoverStates.WalkingOutside;
          
            this.dialogInProcess = false;
        }
    }

    protected roverNoPlaceDialog() {

        let townName = this.world.Town.Name;
        this.alert = new AlertComponent(`What?!? You don't know yet? Are you out of your tree? Well we obviously need to find a place to live!!!....oh wait! Boy, am I dense! This buddy of mine runs the shop in ${townName}! Let me give him a jingle! This'll take me two seconds, wait here OK?`, "Rover");
        this.alert.Visible = true;
        this.alert.onComplete = () => {
            this.roverState = RoverStates.WalkingOutside;
          
            this.dialogInProcess = false;
        }
    }

    protected roverTalkingToNook() {
        let townName = this.world.Town.Name;
        let name = this.world.Player.Name;

        this.alert = new AlertComponent(`Beep Beep Boop Beep! ... Hey there, Nook!...It's me! So what's the good word? You raking in the bells? ..uh-huh...Yeah. Ohh, that's rough! Brutal! Well, it's a crazy world! Anyway,as I was saying, I have someone here who wants to move to ${townName}! Oh, yeah, completely! But the poor thing still hasn't found a place to live it's sort of a tight spot...The kid's name? Why?..Oh. It's ${name}..umm, yeah. Yeah. today. So, think you can help out?...oh? Oh, really?..Uh-huh...I see. Oh, OK! Cool!...Yeah, I'll pass the word on..So we'll catch up later.Riight. Thanks a lot. See ya, Nook, my man! Bye..`, "Rover", "Red", 240);
        this.alert.Visible = true;
        this.alert.onComplete = () => {

            this.roverState = RoverStates.WalkingInside;

            //Investigate this: For some reason we need to clear down alert here :/
            this.alert = new AlertComponent("","");
            this.dialogInProcess = false;
        }
    }

    protected roverMoneyDialog() {
        this.dialogInProcess = true;
        this.dialog = new DialogComponent("OK I'm back miss me mya! Well, good news for you! It sounds like my bubby has some brand-new houses for sale, dirt cheap! The work's all done, but he hasn't been able to rent them. He wants to unload them, so he's willing to take a loss. You have money right!", "Rover", ["Oh, Yeah!", "Just a little..."]);
        this.dialog.Visible = true;
        this.dialog.onChoice = (choice:number) => {
            if(choice == 0) {
                this.roverState = RoverStates.AltStopping;
            }

            else {
                this.roverState = RoverStates.Stopping;
            }

            this.dialogInProcess = false;
        }
    }

    protected roverAltStoppingDialog() {
        let townName = this.world.Town.Name;


        this.alert = new AlertComponent(`Then you'll be just fine! Wow..a brand-new house! Nothing like it in the world! Maybe I'll move in, too.. Oh! Looks like we're about to pull into ${townName}. Did I mention I love this place? Remember, things are never as bad as they seem. Honestly! Good luck and all that! Maybe we'll run into each other again sometime. Well good-bye :)`, "Rover");
        this.alert.Visible = true;

        this.alert.onComplete = () => {

            Music.stopAll();
            Music.playOverWorldMusic(new Date().getHours().toString());

            SceneManager.set(new TownScene(this.screen, this.world));
        }
    }

    protected roverStoppingDialog() {
        let townName = this.world.Town.Name;

        this.alert = new AlertComponent(`Oh, really? No wonder you look so helpless. But don't worry! These things have a way of working out! They say money makes the world go 'round. And what goes around, comes around!...wait I've confused myself. Oh! Looks like we're about to pull into ${townName}. Did I mention I love this place? Remember, things are never as bad as they seem. Honestly! Good luck and all that! Maybe we'll run into each other again sometime. Well good-bye :)`, "Rover");
        this.alert.Visible = true;

        this.alert.onComplete = () => {

            Music.stopAll();
            Music.playOverWorldMusic(new Date().getHours().toString());

            SceneManager.set(new TownScene(this.screen, this.world));
        }
    }

}