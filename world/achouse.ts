import { ACNPC } from './acnpc';
import { ACPlayer, ACPlayerDirection } from './acplayer';
import { ACTerrainType } from './actown';
import { ACItem, ACItemTypes } from './acitem';

import * as charm from 'charm';

export enum ACShopTiles {
    Exit = 0,
    Floor = 1,
    Wall = 2
}

export class ACHouse {
    protected name: string = "";
    protected mapItems: any = {};
    protected mapTerrian: any = {};
    protected mapNPC: any = {};

    protected readonly MAXTILES = 112;

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

            //set player/Nooks position 
            this.playerX = 12;
            this.playerY = 7;
            this.Direction = ACPlayerDirection.North;


        this.mapTerrian = [
            ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Exit,ACShopTiles.Exit,ACShopTiles.Exit,ACShopTiles.Exit,ACShopTiles.Exit,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,
        ];

    }

    get MapItems():ACItem[] {
        return this.mapItems;
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

    public pickup(player:ACPlayer): number {
        
        let x = this.playerX;
        let y = this.playerY;
        
        let direction = this.direction;

        let item: ACItem = this.checkItem(x, y, direction);

        if (item != null) {

            //add to pockets
            let result = player.addToPockets(item);

            //If underfoot remove item, else check square the player is moving to.
            if (this.mapItems[((y - 2) * 16) + (x - 1)] != null) {
                this.mapItems[((y - 2) * 16) + (x - 1)] = null;

            }

            else {

                if (this.Direction == ACPlayerDirection.East) {

                    x++;
                
                }

                else if (this.Direction == ACPlayerDirection.North) {
                    y--;
                }

                else if (this.Direction == ACPlayerDirection.South) {
                    y++;
                }

                else if (this.Direction == ACPlayerDirection.West) {
                    x--;
                }


                if (this.mapItems[((y - 2) * 16) + (x - 1)] != null) {
                    return this.mapItems[((y - 2) * 16) + (x - 1)] = null;

                }

                return result;

            }
        }

        else {
            return -2;
        }
            }

    public dropItem(item:ACItem) {

        let x = this.playerX;
        let y = this.playerY;
    
        if (this.Direction == ACPlayerDirection.East) {

            x++;
        }

        else if (this.Direction == ACPlayerDirection.North) {
            y--;
        }

        else if (this.Direction == ACPlayerDirection.South) {
            y++;
        }

        else if (this.Direction == ACPlayerDirection.West) {
            x--;
        }

        this.mapItems[((y - 2) * 16) + (x - 1)] = item.__clone();
    }

    public moveItem(x:number, y:number, newX:number, newY:number) {
        let item = this.mapItems[((y - 2) * 16) + (x - 1)];

        item = item.__clone();

        this.mapItems[((y - 2) * 16) + (x - 1)] = null;        
        
        this.mapItems[((newY - 2) * 16) + (newX - 1)] = item;    

    }

    public addItem(x:number, y:number, item:ACItem) {
        this.mapItems[((y - 2) * 16) + (x - 1)] = item;
    }

    public checkItem(x: number, y: number, direction: ACPlayerDirection, remove:boolean=false) {
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

        let tile:ACItem = this.mapItems[((y - 2) * 16) + (x - 1)]; 

        if(remove && tile != null) { 
            this.mapItems[((y - 2) * 16) + (x - 1)] = null;

            let newTile = tile.__clone();
            return newTile;
        }

        else {
            return tile;
        }
    }


    public playerMove(checks:boolean = true) {
        //move up
        let item: ACItem = this.checkItem(this.playerX, this.playerY, this.direction);
       
        if(item != null && checks) {
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

    set MapItems(value:ACItem[]) {
        this.mapItems = value;
    }


}