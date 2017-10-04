import { ACBBSItem } from './acbbsitem';
import { ACNooks } from './acnooks';
import { ACShop } from './acshop';
import { ACPlayerDirection } from './acplayer';
import { ACItem } from './acitem';

import * as charm from 'charm';

export enum ACTerrainType {
    Grass = 3,
    Beach = 4,
    River = 5,
    RiverEdge = 6,
    Hole = 7,
    Exit = 8,
    Floor = 9,
}

export enum ACSeason {
    Spring = 0,
    Summer = 1,
    Autumn = 2,
    Winter = 3,
}



export class ACTown {
    protected name: string = '';
    protected clock: Date = new Date();
    protected mapItems: any = {};
    protected mapTerrian: any = {};
    protected mapNPC: any = {};
    protected bbsItems:ACBBSItem[] = [];

    protected shops:ACShop[] = [];

    constructor() {
        this.shops['nooks'] = new ACNooks();


        let item:ACBBSItem = new ACBBSItem();
        item.PlayerName = "Mark";
        item.CreatedOn = new Date();
        item.Message = "Hello world welcome to my new entry on the bullet board";
        
        let item2:ACBBSItem = new ACBBSItem();
        item2.Message = "Hello world 2";
        item2.PlayerName = "Mark";
        item2.CreatedOn = new Date();
        this.bbsItems.push(item);
        this.bbsItems.push(item2);

    }

    public renderViewPoint(arce: string, screen: charm.CharmInstance) {

        //render terrian
       // screen.write('═══════════════');

        let count = 0;
        let season:ACSeason = this.getSeason();


        for (var i in this.mapTerrian[arce]) {

            if (count % 16 === 0 && count != 0) {
                screen.write("\n");
            }

            //If item/npc exists render instead of terrian
            let item = this.mapItems[arce][i];
            let npc = this.mapNPC[arce][i];

            if(npc != null) {
                screen.foreground(npc.Color);
                screen.write(npc.getSymbol());
                screen.foreground("white");
            }

            else if(item != null) {
                   screen.write(item.getSymbol());
            }

            else {
                //Terrian checks
                
                if(this.mapTerrian[arce][i] == ACTerrainType.Beach) {
                    screen.foreground("yellow");
                    screen.write("░");
                    screen.foreground("white");
                }

                else if(this.mapTerrian[arce][i] == ACTerrainType.River) {
                    screen.foreground("blue");
                    screen.write("▓");
                    screen.foreground("white");
                }
                
                else {

                    if(season == ACSeason.Summer || season == ACSeason.Spring) {
                        screen.foreground("green");
                    }

                    else if(season == ACSeason.Winter) {
                        screen.foreground("white");
                    }

                    else if(season == ACSeason.Autumn) {
                        screen.foreground(210);
                    }
                    screen.write("▒");
                    screen.foreground("white");
                }
            }
            count++;
        }

       // screen.write('\n═══════════════');

       /*@ - You   ! - NPC
0 - Hole  & - Item
X - Dig   ? - Tree
^ - Shop   ▒ - Grass
▓ - Water  ░ - Sand*/
        let key = ``;

        screen.write("\n" + key);



    }

    //Max items allowed to drop from a tree is 3.
    public dropItemsFromTree(acre:string, x: number, y:number, items:ACItem[]) {

        for(let i = 0; i < items.length; i++) {
            if(i == 0) {
                //drop directly in front of tree
                this.mapItems[acre][((y - 1) * 16) + (x - 1)] = items[i]; 
                
            }

            if(i == 1) {
                //drop directly to right of tree
                x += 2;
                y -= 1;
                this.mapItems[acre][((y - 1) * 16) + (x - 1)] = items[i]; 
            }

            if(i == 2) {
                //drop directly left of tree
                x -= 2;
                y -= 1;
                this.mapItems[acre][((y - 1) * 16) + (x - 1)] = items[i]; 
                
            }
        }
    }

    get Name(): string {
        return this.name;
    }

    set Name(name: string) {
        this.name = name;
    }

    get Clock(): Date {
        return this.clock;
    }

    get MapItems():any {
        return this.mapItems;
    }

    get MapNPC():any {
        return this.mapNPC;
    }

    get MapTerrian(): any {
        return this.mapTerrian;
    }
    
    set MapItems(value:any) {
        this.mapItems = value;
    }

    set MapNPC(value:any) {
        this.mapNPC = value;
    }

    set MapTerrian(value:any) {
        this.mapTerrian = value;
    }

    get BBSItems():ACBBSItem[] {
        return this.bbsItems;
    }

    set BBSItems(value:ACBBSItem[]) {
        this.bbsItems = value;
    }

    getShop(name:string) {
        return this.shops[name];
    }


    getSeason():ACSeason {
        let month:number = new Date().getMonth();


        if(month == 11 || month == 0 || month == 1) {
            return ACSeason.Winter;
        }

        if(month == 2 || month == 3 || month == 4) {
            return ACSeason.Spring;
        }

        if(month == 5 || month == 6 || month == 7) {
            return ACSeason.Summer;
        }

        if(month == 8 || month == 9 || month == 10) {
            return ACSeason.Autumn;
        }
    }


}