import { DialogComponent } from '../component/dialog.component';
import { ACVM, ACVMAssembler, vmInterrupts } from '../common/acvm';
import { AlertComponent } from '../component/alert.component';
import { Music } from '../common/music';
import { ACShopTiles } from '../world/acshop';
import { ACNooks } from '../world/acnooks';
import { ACItem, ACItemTypes } from '../world/acitem';
import { TownScene } from './town.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';

import * as charm from 'charm';

export class NookScene extends BaseScene {

    tick = 0;
    playerx = 12;
    playery = 7;
    direction: ACPlayerDirection = ACPlayerDirection.North;
    nookx = 12;
    nooky = 6;

    follow: boolean = false;

    private nookShop: ACNooks = new ACNooks();
    private alert: AlertComponent = new AlertComponent("Welcome! Do come in! Have a look around, hm? Feel free to browse, but try not to carouse! Ho ho!", "Tom Nook");
    private dialog: DialogComponent = new DialogComponent("", "", []);

    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;
        this.alert.Visible = true;
    };


    showBuyItemDialog(item: ACItem): void {

        if(item.Type == ACItemTypes.Sold) {
            return;
        }

        this.dialog = new DialogComponent("That is a " + item.Name.toString() + " The price is " + item.Price + " bells \n It's a steal at that price! Would you like it?" , "Tom Nook", ["I'll buy it", "Nevermind.."]);
        this.dialog.onChoice = (option:number) => {

                if(option == 0) {

                    if(this.world.Player.Bells < item.Price) {
                        this.alert = new AlertComponent("Uh-oh! This is awkard..I'm afraid you, uh...don't have enough money! I'm so sorry! I can't sell it to you", "Tom Nook");
                        this.alert.Visible = true; 
                    }

                    else {
                        if(this.world.Player.getPockets().length === 18) {
                            this.alert = new AlertComponent("Hm, it appears your pockets are full. I'm so sorry! But you must remove something before I can sell this to you.", "Tom Nook");
                        }

                        this.world.Player.Bells = this.world.Player.Bells - item.Price;
                        item.Type = ACItemTypes.Sold;

                        this.alert = new AlertComponent("Thanks much!", "Tom Nook");
                        this.alert.Visible = true;
                    }
                }

                else {
                    //follow back for not buying item.
                    this.alert = new AlertComponent("No..? You're Sure? Well, no matter! Feel free to keep browsing, hm?", "Tom Nook");
                    this.alert.Visible = true;
                }
        };

        this.dialog.Visible = true;
    }
    draw(): void {

        this.followPlayer();
        super.draw();

        process.stderr.write('\x1B[?25l');

        this.nookShop.render(this.screen);
        this.screen.write(`\n--------------
- `+ this.world.Player.Bells + ` Bells -
--------------\n`);

        this.alert.draw(this.screen);
        this.dialog.draw(this.screen);
        /*
        this.screen.write(`
☲ - Paper	☙ - Furniture
⚒ - Tool	☂ - Umbrellas
⚘ - Flower	▧ - Clothing
▒ - Exit 	␦ - Unknown
! - Tom Nook	00 - ATM
        `);*/

        this.screen.position(this.playerx, this.playery);
        this.screen.write("$");

        this.screen.position(this.nookx, this.nooky);
        this.screen.write("!");


        this.tick++;

    }

    processInput(key: any): void {
        super.processInput(key);


        if (!this.alert.Visible && !this.dialog.Visible) {
            //move up
            if (key == '\u001B\u005B\u0041') {
                this.playery--;
                this.direction = ACPlayerDirection.North;

            }

            //move right
            if (key == '\u001B\u005B\u0043') {
                this.playerx++;
                this.direction = ACPlayerDirection.East;
            }

            //move down
            if (key == '\u001B\u005B\u0042') {
                this.playery++;
                this.direction = ACPlayerDirection.South;

                //if underneath exit tile - load back up town
                if (this.nookShop.checkTile(this.playerx, this.playery) == ACShopTiles.Exit) {
                    SceneManager.set(new TownScene(this.screen, this.world));
                }
            }

            //move left
            if (key == '\u001B\u005B\u0044') {
                this.playerx--;
                this.direction = ACPlayerDirection.West;
            }

            if (key == 'x') {
                let item = this.nookShop.checkItem(this.playerx, this.playery, this.direction);

                if (item !== undefined && item != null) {
                    this.showBuyItemDialog(item);
                }
            }
        }


        this.alert.processInput(key);
        this.dialog.processInput(key);

        if (key === 'q') {
            process.exit(-1);
        }


    }
    followPlayer() {

        if (this.playery == this.nooky && this.follow === false) {
            this.follow = true;
        }

        if (this.follow) {
            if (this.tick % 15 == 0) {
                if (this.nookx > this.playerx - 1) {

                    this.nookx--;
                }

                if (this.nookx < this.playerx + 1) {
                    this.nookx++;
                }

                if (this.nooky > this.playery - 1) {
                    this.nooky--;
                }

                if (this.nooky < this.playery + 1) {
                    this.nooky++;
                }

            }
        }



    }

    facePlayer() {


    }


    music(player: Music) {

        super.music(player);
        Music.stopAll();

        Music.playMusic("/home/mark/Documents/sites/commandCrossing/music/nook.mp3");

    }

}