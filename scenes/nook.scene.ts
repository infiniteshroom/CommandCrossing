import { SellItemsScene } from './sellitems.scene';
import { DialogComponent } from '../component/dialog.component';
import { ACVM, ACVMAssembler, vmInterrupts } from '../common/acvm';
import { AlertComponent } from '../component/alert.component';
import { Music } from '../common/music';
import { ACShopTiles } from '../world/acshop';
import { ACNooks, ACShopEvent } from '../world/acnooks';
import { ACItem, ACItemTypes } from '../world/acitem';
import { TownScene } from './town.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';

import * as clone from 'deep-clone-ts';

import * as charm from 'charm';

export class NookScene extends BaseScene {

    tick = 0;
    follow: boolean = false;

    private nookShop: ACNooks = null;
    private alert: AlertComponent = new AlertComponent("","");
    private dialog: DialogComponent = new DialogComponent("", "", []);

    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;

        //On entering unquip items
        this.world.Player.Equipment = undefined;

        this.nookShop = this.world.Town.getShop('nooks');

        //check for events
        let event:ACShopEvent = this.nookShop.Events.pop();

        if(event == undefined || event == null) {
            this.alert = new AlertComponent("Welcome! Do come in! Have a look around, hm? Feel free to browse, but try not to carouse! Ho ho!", "Tom Nook");
            this.alert.Visible = true;
        }

        //We came from the sell items pockets screen
        else if(event == ACShopEvent.SellItems) {
            this.alert.Visible = false;

            //gets items and bells total
            let pockets:ACItem[] = this.world.Player.getPockets();

            let bellTotal:number = 0;

            for(var i in this.nookShop.ItemsToSell) {

                let pocketId:number = this.nookShop.ItemsToSell[i];

                bellTotal += pockets[pocketId].Price;
            }

            this.dialog = new DialogComponent("I'd be willing to pay "+bellTotal+" bells. Do we have a deal?", "Tom Nook", ["I'll sell", "Never mind"]);
            this.dialog.onChoice = (choice:number) => {
                if(choice == 0) {

                    for(var i in this.nookShop.ItemsToSell) {
                        let pocketId:number = this.nookShop.ItemsToSell[i];
                        this.world.Player.removeFromPockets(pocketId);
                    }

                    this.world.Player.Bells += bellTotal;
                    this.nookShop.ItemsToSell = [];

                    //remove items from pockets and add bells to player, makes items to sell o
                    this.alert = new AlertComponent("Thanks much!", "Tom Nook");
                    this.alert.Visible = true;
                }
            }

            this.dialog.Visible = true;
        }


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

    
   

                        let cloneItem:ACItem = <ACItem>item.__clone();
                        this.world.Player.addToPockets(cloneItem);

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

        this.screen.position(this.nookShop.PlayerX, this.nookShop.PlayerY);
        this.screen.write("$");

        this.screen.position(this.nookShop.NpcX, this.nookShop.NpcY);
        this.screen.write("!");


        this.tick++;

    }

    processInput(key: any): void {
        super.processInput(key);


        if (!this.alert.Visible && !this.dialog.Visible) {
            //move up
            if (key == '\u001B\u005B\u0041') {
                this.nookShop.Direction = ACPlayerDirection.North;
                this.nookShop.playerMove();

            }

            //move right
            if (key == '\u001B\u005B\u0043') {
                this.nookShop.Direction = ACPlayerDirection.East;
                this.nookShop.playerMove();
            }

            //move down
            if (key == '\u001B\u005B\u0042') {
                this.nookShop.Direction = ACPlayerDirection.South;
                this.nookShop.playerMove();

                //if underneath exit tile - load back up town
                if (this.nookShop.checkTile(this.nookShop.PlayerX, this.nookShop.PlayerY) == ACShopTiles.Exit) {

                    //if leaving play overworld theme
                    Music.stopAll();
                    Music.playOverWorldMusic(new Date().getHours().toString());

                    SceneManager.set(new TownScene(this.screen, this.world));
                }
            }

            //move left
            if (key == '\u001B\u005B\u0044') {
                this.nookShop.Direction = ACPlayerDirection.West;
                this.nookShop.playerMove();
            }

            if (key == 'x') {
                let item = this.nookShop.checkItem(this.nookShop.PlayerX, this.nookShop.PlayerY, this.nookShop.Direction);

                if (item !== undefined && item != null) {
                    this.showBuyItemDialog(item);
                }
            }
        }

        if(!this.alert.Visible && !this.dialog.Visible && this.nookShop.checkNpc(this.nookShop.PlayerX, this.nookShop.PlayerY, this.nookShop.Direction)) {
            if(key == 'x') {
                this.dialog = new DialogComponent("Yes, yes!, What can I do for you, hm?","Tom Nook" ,["I'd like to sell", "Never mind..."]);

                this.dialog.onChoice = (chocie:number) => {
                    if(chocie == 0) {
                        //load sellitems ui
                        this.alert = new AlertComponent("Very well, then! show me what you've got, hm?", "Tom Nook");
                        SceneManager.set(new SellItemsScene(this.screen, this.world));
                    }
                };

                this.dialog.Visible = true;
            }
        }


        this.alert.processInput(key);
        this.dialog.processInput(key);

        if (key === 'q') {
            process.exit(-1);
        }


    }
    followPlayer() {

        if (this.nookShop.PlayerY == this.nookShop.NpcY && this.follow === false) {
            this.follow = true;
        }

        if (this.follow) {
            if (this.tick % 15 == 0) {
                if (this.nookShop.NpcX > this.nookShop.PlayerX - 1) {

                    this.nookShop.NpcX--;
                }

                if (this.nookShop.NpcX < this.nookShop.PlayerX + 1) {
                    this.nookShop.NpcX++;
                }

                if (this.nookShop.NpcY > this.nookShop.PlayerY- 1) {
                    this.nookShop.NpcY--;
                }

                if (this.nookShop.NpcY  < this.nookShop.PlayerY + 1) {
                    this.nookShop.NpcY++;
                }

            }
        }



    }

    music(player: Music) {

        super.music(player);
        Music.stopAll();

        Music.playMusic(__dirname + "/../music/nook.mp3");

    }

}