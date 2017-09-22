import { MenuComponent } from '../component/menu.component';
import { ACItem, ACItemTypes } from '../world/acitem';
import { TownScene } from './town.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';

import * as charm from 'charm';

export class PocketsScene extends BaseScene {

    tick = 0;
    selected = 1;

    private menu:MenuComponent = new MenuComponent();


    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;
    };

    private renderPockets() {
        let row = 0;
        let count = 1;

        let pockets = this.world.Player.getPockets();
        let equipment = this.world.Player.Equipment === undefined  ? new ACItem() : this.world.Player.Equipment; 
        

        for (let i = 1; i <= 18; i++) {

            let item = pockets[i - 1] === undefined ? new ACItem() : pockets[i - 1];

            if(equipment.Type == item.Type && item.Type != null) {
                this.screen.display("bright");
                this.screen.foreground("blue");
            }

            else if (this.selected == i) {
                this.screen.display("bright");
                this.screen.foreground("red");
            }

            else {
                this.screen.display("reset");
                this.screen.foreground("white");
            }

            if (pockets[i - 1] !== undefined) {
                let item = pockets[i - 1];
                this.screen.write("(" + item.getSymbol() + ") ");
            }

            else {
                this.screen.write("( ) ");
            }



            if (count == 6) {

                this.screen.display("reset");
                this.screen.foreground("white");
                if (row == 0) {
                    this.screen.write("    [$" + this.world.Player.Bells + "]");
                }

                if (row == 1) {
                    this.screen.write("    [Mail]");
                }

                if(row == 2 && this.world.Player.Equipment != undefined) {
                    let equipment:ACItem = this.world.Player.Equipment;
                    this.screen.write("    ["+ equipment.Name +" Equipped]");
                }

                else {
                    //TODO: fix this hack to remove right text
                    this.screen.write("                          ");
                }

                this.screen.write("\n");
                count = 0;
                row++;

            }

            count++;
        }


        this.screen.write("\n");
        this.screen.erase("line");
        
        if (pockets[this.selected - 1] !== undefined) {
            let item = pockets[this.selected - 1];

            this.screen.write("[" + item.getSymbol() + " " + item.Name + "]");
        }

        else {
            this.screen.write("[Empty]");
        }

        this.screen.display("reset");
    }

    draw(): void {
        super.draw();

        process.stderr.write('\x1B[?25l');
        this.screen.write("==== Pockets ===\n\n");
        this.renderPockets();

        //this.screen.write("\n\nU - use, E - equip, D - drop, R - remove, T - take off");

        this.menu.draw(this.screen);
        this.tick++;

    }

    processInput(key: any): void {
        super.processInput(key);

        this.menu.processInput(key);

        
        if(!this.menu.Visible) {

            if (key == '\u0071') {
                //load town again
                SceneManager.set(new TownScene(this.screen, this.world));
            }

            if (key == '\u001B\u005B\u0041') {
                if (this.selected > 6) {
                    this.selected -= 6;
                }
            }
            if (key == '\u001B\u005B\u0043') {

                if (this.selected < 18) {
                    this.selected++;
                }
            }
            if (key == '\u001B\u005B\u0042') {
                if (this.selected < 13) {
                    this.selected += 6;
                }
            }
            if (key == '\u001B\u005B\u0044') {
                if (this.selected > 1) {
                    this.selected--;
                }
            }
        }   


        if(key == 'x') {
            let items: ACItem[] = this.world.Player.getPockets();
            let item = items[this.selected - 1];

            this.menu = new MenuComponent(this.getOptionsForItem(item));

            this.menu.onChange = (key:number, value:string) => {
                let items: ACItem[] = this.world.Player.getPockets();
                let item = items[this.selected - 1];

                switch(value.toLowerCase()) {
                    case 'remove':
                        this.world.Player.removeFromPockets(this.selected - 1);
                    break;

                    case 'bury':
                        this.world.Player.buryItem(this.world.Town.MapItems, item);
            
                        this.world.Player.removeFromPockets(this.selected - 1);
                    break;

                    case 'drop':
                        this.world.Player.dropItem(this.selected - 1, this.world.Town.MapItems);
                    break;

                    case 'equip':
                        let itemType:number = item.Type;
            
                        //Lower end of types are equipment 
                        if(itemType >= 22) {
                            this.world.Player.Equipment = item;
                        }
                    break;

                    case 'unequip':
                        this.world.Player.Equipment = undefined;
                    break;
                }
            }

            this.menu.Visible = true;
        }

    }

    private getOptionsForItem(item:ACItem):string[] {
        let options = ["Use", "Remove", "Drop"];


        if(this.world.Player.Equipment != null) {
            if((item.Type == ACItemTypes.Shovel || item.Type == ACItemTypes.Axe) && this.world.Player.Equipment.Name == item.Name) {
                options.push("Unequip");
            }

            if(this.world.Player.Equipment.Type == ACItemTypes.Shovel && item.Type != ACItemTypes.Shovel) {
                options.push("Bury");
            }
        }

        if((item.Type == ACItemTypes.Shovel || item.Type == ACItemTypes.Axe) && this.world.Player.Equipment == null) {
            options.push("Equip");
        }

        options.push("Cancel");

        return options;
    }

}