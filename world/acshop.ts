import { ACNPC } from './acnpc';
import { ACPlayerDirection } from './acplayer';
import { ACTerrainType } from './actown';
import { ACItem } from './acitem';

import * as charm from 'charm';

export enum ACShopTiles {
    Exit = 0,
    Floor = 1,
    Wall = 2
}

export class ACShop {
    protected name: string = "";
    protected mapItems: any = {};
    protected mapTerrian: any = {};
    protected mapNPC: any = {};
    protected openingTime: Date;
    protected closingTime: Date;

    protected readonly MAXTILES = 112;

    protected npc:ACNPC = new ACNPC();
    protected npcX:number = 0;
    protected npcY:number = 0;

    protected direction:ACPlayerDirection = ACPlayerDirection.North;
    protected playerX:number = 0;
    protected playerY:number = 0;

    protected shopSymbols: any = {
        "Exit": "▒",
        "Floor": "░",
        "Wall": "=",
    }

    constructor() {
        this.mapItems = new Array(this.MAXTILES);
        this.mapNPC = new Array(this.MAXTILES);
        this.mapTerrian = new Array(this.MAXTILES);

        this.mapItems.fill(null, 0, this.MAXTILES);
        this.mapNPC.fill(null, 0, this.MAXTILES);
        this.mapTerrian.fill(null, 0, this.MAXTILES);
    }

    get NPC():ACNPC {
        return this.npc;
    }

    get NpcX():number {
        return this.npcX;
    }

    set NpcX(value:number) {
        this.npcX = value;
    }

    get NpcY():number {
        return this.npcY;
    }

    set NpcY(value:number) {
        this.npcY = value;
    }


    get PlayerX():number {
        return this.playerX;
    }

    set PlayerX(value:number) {
        this.playerX = value;
    }

    get PlayerY():number {
        return this.playerY;
    }

    set PlayerY(value:number) {
        this.playerY = value;
    }


    get Direction():ACPlayerDirection {
        return this.direction;
    }

    set Direction(value:ACPlayerDirection) {
        this.direction = value;
    }

    public checkTile(x: number, y: number) {
        let tile = this.mapTerrian[((y - 2) * 16) + (x - 1)];
        return tile;
    }

    public checkItem(x: number, y: number, direction: ACPlayerDirection) {
        if (direction == ACPlayerDirection.East) {

            x++;
        }

        else if (direction == ACPlayerDirection.North) {
            y--;
        }

        else if (direction == ACPlayerDirection.South) {
            y++;
        }

        else if (direction == ACPlayerDirection.West) {
            x--;
        }


        let tile = this.mapItems[((y - 2) * 16) + (x - 1)];
        return tile;
    }


    public checkNpc(x: number, y: number, direction: ACPlayerDirection) {
        if (direction == ACPlayerDirection.East) {

            x++;
        }

        else if (direction == ACPlayerDirection.North) {
            y--;
        }

        else if (direction == ACPlayerDirection.South) {
            y++;
        }

        else if (direction == ACPlayerDirection.West) {
            x--;
        }


       return x == this.npcX && y == this.npcY;
    }

    public playerMove() {
        //move up

        if(this.checkNpc(this.playerX, this.playerY, this.direction)) {
           return;
        }

        if (this.Direction == ACPlayerDirection.North) {
            this.PlayerY--;
        }

        //move right
        else if (this.Direction == ACPlayerDirection.East) {
            this.PlayerX++;
            
        }

        //move down
        else if (this.Direction == ACPlayerDirection.South) {
            this.PlayerY++;
        }

        //move left
        else if (this.Direction == ACPlayerDirection.West) {
            this.PlayerX--;
        }
            
    }


    public render(screen: charm.CharmInstance): void {
        let view: string = '';
        for (let i = 0; i < this.mapTerrian.length; i++) {
            if (i % 16 === 0) {
                screen.write("\n");
            }

            //If item exists render instead of terrian
            let item = this.mapItems[i];

            if (item != null) {
                screen.write(item.getSymbol());
            }


            else {
                if (this.mapTerrian[i] == ACShopTiles.Exit) {
                    screen.foreground("red");

                    screen.write(this.shopSymbols["Exit"]);
                    screen.foreground("white");
                }

                else if (this.mapTerrian[i] == ACShopTiles.Floor) {
                    screen.foreground(243);
                    screen.write(this.shopSymbols["Floor"]);
                    screen.foreground("white");
                }

                else {
                    screen.foreground("white");
                    screen.write(this.shopSymbols["Wall"]);
                    screen.foreground("white");
                }
            }

        }
    }


}