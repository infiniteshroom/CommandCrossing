import { ACDigItem } from '../world/acdigitem';
import { ACTree } from '../world/actee';
import { NookScene } from './nook.scene';
import { DialogComponent } from '../component/dialog.component';
import { ACNPC } from '../world/acnpc';
import { ACItem, ACItemTypes } from '../world/acitem';
import { Music } from '../common/music';
import { AlertComponent } from '../component/alert.component';
import { HudComponent } from '../component/hud.component';
import { PocketsScene } from './pockets.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';
import { PlayerComponent } from './../component/player.component';

import * as charm from 'charm';


export class TownScene extends BaseScene {

    tick = 0;
    alert: AlertComponent = null;
    dialog: DialogComponent = null;
    hud: HudComponent = null;
    player: PlayerComponent = null;


    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;
        this.alert = new AlertComponent("This is a messagebox you should not see this", "MJL");
        this.dialog = new DialogComponent("", "");
        this.dialog.Visible = false;
        this.alert.Visible = false;

        this.hud = new HudComponent(this.world);
        this.player = new PlayerComponent(this.world);
    };


    draw(): void {
        super.draw();

        this.screen.erase("down");

        process.stderr.write('\x1B[?25l');
        this.world.Town.renderViewPoint(this.world.Player.getAcre(), this.screen);

        this.alert.draw(this.screen);
        this.dialog.draw(this.screen);

        this.hud.draw(this.screen);
        this.player.draw(this.screen);


        this.tick++;
    }

    processInput(key: any): void {
        super.processInput(key);
        this.alert.processInput(key);
        this.dialog.processInput(key);



        if (!this.alert.Visible && !this.dialog.Visible) {
            this.player.processInput(key);

            if(key.charCodeAt(0) == 13) {
                
                this.world.saveGame();
                this.alert = new AlertComponent("Game has been saved!", "");
                this.alert.Visible = true;
            }
        }

        //equip/items todo:enter press
        if (key == 'e') {
            SceneManager.set(new PocketsScene(this.screen, this.world));
        }

        //dig
        if (key == 'x') {
            let playerTool: ACItem = this.world.Player.Equipment === undefined ? new ACItem() : this.world.Player.Equipment;
            let npc: ACNPC = this.world.Player.CheckNPC(this.world.Town.MapNPC);
            let item:ACItem = this.world.Player.CheckItem(this.world.Town.MapItems);

            //talk to npc
            if (npc != null && !this.dialog.Visible && !this.alert.Visible)  {
                this.dialog = new DialogComponent(npc.getDialog(this.world, "Greetings") + " " +npc.getDialog(this.world, "Introductions"), npc.Name, ["Entertain me", "Nevermind"], npc.Color);
                this.dialog.onChoice = (choice:number) => {

                    //TODO: choice for doing tasks for animals???
                    if(choice == 1) {
                        this.alert = new AlertComponent(npc.getDialog(this.world,"Nevermind"), npc.Name, npc.Color);
                        this.alert.Visible = true;
                    }

                    else {
                        this.alert = new AlertComponent(npc.getDialog(this.world,"Chat"), npc.Name, npc.Color);
                        this.alert.Visible = true;                        
                    }
                }
                this.dialog.Visible = true;
            }

             if (playerTool.Type == ACItemTypes.Shovel && item == null) {
                let item: ACItem = this.world.Player.digHole(this.world.Town.MapItems);
            }


            //pickup item
            if (item != null) {

                
                if(item.Type == ACItemTypes.Nooks) {
                    SceneManager.set(new NookScene(this.screen, this.world));
                }

                else if(item.Type == ACItemTypes.Tree && playerTool.Type == ACItemTypes.Axe) {
                    let tree:ACTree = <ACTree>item;
                    let items:ACItem[] = tree.shake();

                    if(items != null) {
                        //place items on map
                        this.world.Town.dropItemsFromTree(this.world.Player.getAcre(), this.world.Player.AcreSquareX, this.world.Player.AcreSquareY -1, items);
                    }
                
                    item.Type = ACItemTypes.Stump;
                }

                else if(item.Type == ACItemTypes.Tree) {
                    //shake it
                    let tree:ACTree = <ACTree>item;
                    let items:ACItem[] = tree.shake();

                    if(items != null) {
                        //place items on map
                        this.world.Town.dropItemsFromTree(this.world.Player.getAcre(), this.world.Player.AcreSquareX, this.world.Player.AcreSquareY, items);
                    }

                }

                else if(item.Type == ACItemTypes.Stump && playerTool.Type == ACItemTypes.Shovel) {
                    let item: ACItem = this.world.Player.digHole(this.world.Town.MapItems);
                }
                

                else if(playerTool.Type == ACItemTypes.Shovel && item.Type == ACItemTypes.Dig) {
    
                    if (item != null) {

                        let digItem:ACDigItem = <ACDigItem>item;
                        this.world.Player.addToPockets(digItem.Item);

                        this.world.Player.removeItem(this.world.Town.MapItems);

                        //TDOD: remove dig x from map
                        this.alert = new AlertComponent("You found " + digItem.Item.Name, "");
                    }
                }
    

                else if(item.Type != ACItemTypes.Rock && item.Type != ACItemTypes.Dig && item.Type != ACItemTypes.Hole && item.Type != ACItemTypes.Stump) {

                    let returnCode = this.world.Player.pickup(this.world.Town.MapItems);

                    if (returnCode == -2) {

                        //TODO:may remove this should be obvious there's nothing to pickup
                        this.alert = new AlertComponent("There is nothing to pickup...", "");
                    }

                    else if (returnCode == -1) {
                        this.alert = new AlertComponent("Hmm seems your pockets are full", "");
                    }
                }
            }



        }



        //q - quit
        if (key == '\u0071') {
            let player: Music = new Music();
            Music.stopAll();
            process.exit(0);
        }
    }

    music(player: Music) {

        //super.music(player);

    }


 

}