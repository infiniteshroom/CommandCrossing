import { ACDigItem } from '../world/acdigitem';
import { ACTree } from '../world/actee';
import { NookScene } from './nook.scene';
import { DialogComponent } from '../component/dialog.component';
import { ACNPC } from '../world/acnpc';
import { ACItem, ACItemTypes } from '../world/acitem';
import { Music } from '../common/music';
import { AlertComponent } from '../component/alert.component';
import { PocketsScene } from './pockets.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';

import * as charm from 'charm';


export class TownScene extends BaseScene {

    tick = 0;
    alert: AlertComponent = null;
    dialog: DialogComponent = null;


    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;
        this.alert = new AlertComponent("This is a messagebox you should not see this", "MJL");
        this.dialog = new DialogComponent("", "");
        this.dialog.Visible = false;
        this.alert.Visible = false;
    };

    private renderHud(): string {
        let dayNo = ("0" + (new Date().getDate())).slice(-2);
        let monthNo = ("0" + (new Date().getMonth())).slice(-2);

        let hourNo = ("0" + (new Date().getHours())).slice(-2);
        let minuteNo = ("0" + (new Date().getMinutes())).slice(-2);

        let time = "pm";

        let acre = this.world.Player.getAcre();

        return `\n(${dayNo}).(${monthNo}) (${hourNo}):(${minuteNo}) ${time} (${acre})`;
    }

    draw(): void {
        super.draw();

        process.stderr.write('\x1B[?25l');
        this.world.Town.renderViewPoint(this.world.Player.getAcre(), this.screen);

        this.alert.draw(this.screen);
        this.dialog.draw(this.screen);

        this.screen.write(this.renderHud());

        this.screen.position(<number>this.world.Player.AcreSquareX, this.world.Player.AcreSquareY);
        this.screen.write("$");

        this.renderTool();


        this.tick++;
    }

    processInput(key: any): void {
        super.processInput(key);
        this.alert.processInput(key);
        this.dialog.processInput(key);

        if (!this.alert.Visible && !this.dialog.Visible) {
            //move up
            if (key == '\u001B\u005B\u0041') {
                this.world.Player.Direction = ACPlayerDirection.North;
                this.world.Player.move(this.world.Town.MapItems, this.world.Town.MapNPC);
                //player.playEffect("/home/mark/Documents/sites/commandCrossing/music/effects/walking.wav");
            }

            //move right
            if (key == '\u001B\u005B\u0043') {
                this.world.Player.Direction = ACPlayerDirection.East;
                this.world.Player.move(this.world.Town.MapItems, this.world.Town.MapNPC)
                //player.playEffect("/home/mark/Documents/sites/commandCrossing/music/effects/walking.wav");
            }

            //move down
            if (key == '\u001B\u005B\u0042') {
                this.world.Player.Direction = ACPlayerDirection.South;
                this.world.Player.move(this.world.Town.MapItems, this.world.Town.MapNPC)
                //player.playEffect("/home/mark/Documents/sites/commandCrossing/music/effects/walking.wav");
            }

            //move left
            if (key == '\u001B\u005B\u0044') {
                this.world.Player.Direction = ACPlayerDirection.West;
                this.world.Player.move(this.world.Town.MapItems, this.world.Town.MapNPC)
                //player.playEffect("/home/mark/Documents/sites/commandCrossing/music/effects/walking.wav");
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
    

                else if(item.Type != ACItemTypes.Rock) {

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

        super.music(player);
        Music.stopAll();

        Music.playOverWorldMusic(new Date().getHours().toString());

    }


    renderTool() {

        let playerTool: ACItem = this.world.Player.Equipment === undefined ? new ACItem() : this.world.Player.Equipment;

        let tool = '';
        let direction = this.world.Player.Direction;

        if (playerTool.Type == ACItemTypes.Shovel) {
            if (direction == ACPlayerDirection.North) {
                tool = '^';
                this.screen.position(<number>this.world.Player.AcreSquareX, this.world.Player.AcreSquareY - 1);
            }

            if (direction == ACPlayerDirection.East) {
                tool = '>';
                this.screen.position(<number>this.world.Player.AcreSquareX + 1, this.world.Player.AcreSquareY);
            }

            if (direction == ACPlayerDirection.South) {
                tool = 'v'
                this.screen.position(<number>this.world.Player.AcreSquareX, this.world.Player.AcreSquareY + 1);
            }

            if (direction == ACPlayerDirection.West) {
                tool = '<';
                this.screen.position(<number>this.world.Player.AcreSquareX - 1, this.world.Player.AcreSquareY);
            }
        }


        if (playerTool.Type == ACItemTypes.Axe) {
            if (direction == ACPlayerDirection.North) {
                tool = '▲';
                this.screen.position(<number>this.world.Player.AcreSquareX, this.world.Player.AcreSquareY - 1);
            }

            if (direction == ACPlayerDirection.East) {
                tool = '►';
                this.screen.position(<number>this.world.Player.AcreSquareX + 1, this.world.Player.AcreSquareY);
            }

            if (direction == ACPlayerDirection.South) {
                tool = '▼'
                this.screen.position(<number>this.world.Player.AcreSquareX, this.world.Player.AcreSquareY + 1);
            }

            if (direction == ACPlayerDirection.West) {
                tool = '◀';
                this.screen.position(<number>this.world.Player.AcreSquareX - 1, this.world.Player.AcreSquareY);
            }
        }

        //TODO: rod, net

        this.screen.write(tool);
    }

}