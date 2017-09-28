import { ACNooks } from './acnooks';
import { ACNPC } from './acnpc';
import { ACDigItem } from './acdigitem';
import { ACItem, ACItemTypes } from './acitem';

export enum ACPlayerLocation {
    Map = 1,
    Shop = 2,
    House = 3,
}

export enum ACPlayerDirection {
    North = 1,
    East = 2,
    South = 3,
    West = 4,
}

export class ACPlayer {
    protected name: string = "";
    protected hair: number;
    protected face: number;
    protected bells: number;
    protected items: ACItem[];
    protected equipment: ACItem;

    protected clothing: ACItem;
    protected hat: ACItem;
    protected acreLetter: number;
    protected acreNumber: number;
    protected acreSquareX: number;
    protected acreSquareY: number;
    protected location: ACPlayerLocation;
    protected direction: ACPlayerDirection;

    protected readonly maxCols = 16;
    protected readonly maxRows = 16;

    constructor() {
        this.acreLetter = 1;
        this.acreNumber = 1;
        this.acreSquareX = 1;
        this.acreSquareY = 1;
        this.direction = ACPlayerDirection.East;
        this.bells = 2000;
        this.location = ACPlayerLocation.Map;

        this.items = new Array(18);

        let item = new ACItem();
        item.Name = "Dummy";
        item.Description = "This is a dummy item";
        item.Type = ACItemTypes.Unknown;

  //      let item2 = new ACItem();
   //     item2.Name = "Shovel";
    //    item2.Type = ACItemTypes.Shovel;

        this.items[0] = item;

     //   this.items[1] = item2;

    }

    public getPockets(): ACItem[] {
        return this.items;
    }

    get Bells(): number {
        return this.bells;
    }

    set Bells(value:number) {
        this.bells = value;
    }

    get Equipment(): ACItem {
        return this.equipment;
    }

    set Equipment(value: ACItem) {
        this.equipment = value;
    }

    get Direction(): ACPlayerDirection {
        return this.direction;
    }

    set Direction(direction: ACPlayerDirection) {
        this.direction = direction;
    }

    get AcreSquareX(): number {
        return this.acreSquareX;
    }

    set AcreSquareX(value: number) {
        this.acreSquareX = value;
    }

    get AcreSquareY(): number {
        return this.acreSquareY;
    }

    set AcreSquareY(value: number) {
        this.acreSquareY = value;
    }

    set Items(value:any) {
        this.items = value;
    }

    public getAcre(): string {
        let letters: string[] = ["0", "A", "B", "C", "D", "E", "F"];

        return letters[this.acreLetter] + this.acreNumber;
    }

    get Name(): string {
        return this.name;
    }

    set Name(value:string) {
        this.name = value;
    }

    public buryItem(mapItems: ACItem[], item: ACItem): void {
        let x = this.acreSquareX;
        let y = this.acreSquareY;

        if (this.Direction == ACPlayerDirection.East) {
            /* let's see if there's an npc in next square east */

            /* moving east */
            x += 2;
        }

        else if (this.Direction == ACPlayerDirection.North) {
            y -= 2;
        }

        else if (this.Direction == ACPlayerDirection.South) {
            y += 2;
        }

        else if (this.Direction == ACPlayerDirection.West) {
            x -= 2;
        }



        let mapItem: ACItem = mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)];

        if (mapItem.Type === ACItemTypes.Hole) {
            let digItem = new ACDigItem();
            digItem.Item = item;

            mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] = digItem;
        }

    }

    public digHole(mapItems: ACItem[]): any {
        let x = this.acreSquareX;
        let y = this.acreSquareY;

        if (this.Direction == ACPlayerDirection.East) {
            /* let's see if there's an npc in next square east */

            /* moving east */
            x += 2;
        }

        else if (this.Direction == ACPlayerDirection.North) {
            y -= 2;
        }

        else if (this.Direction == ACPlayerDirection.South) {
            y += 2;
        }

        else if (this.Direction == ACPlayerDirection.West) {
            x -= 2;
        }



        let item: ACItem = mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)];

        if (item !== undefined && item !== null) {
            if (item.Type == ACItemTypes.Hole) {
                mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] = null;
                return null;
            }

            else if (item.Type == ACItemTypes.Dig) {
                let digItem = <ACDigItem>item;
                mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] = null;
                return digItem.Item;
            }
        }

        let hole: ACItem = new ACItem();
        hole.Type = ACItemTypes.Hole;

        mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] = hole;

        return null;

    }

    public removeFromPockets(index: number) {
        this.items[index] = undefined;
    }

    public addToPockets(item: ACItem): number {

        let added: boolean = false;

        for (let i = 0; i < this.items.length; i++) {
            let pocketSlot = this.items[i];

            if (pocketSlot == undefined || pocketSlot == null) {
                this.items[i] = item;
                added = true;
                break;
            }
        }

        if (!added) {
            return -1;
        }

        else {
            return 0;
        }
    }

    public dropItem(index: number, mapItems: any) {
        let item: ACItem = this.items[index];

        let x: number = this.acreSquareX;
        let y: number = this.acreSquareY;


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

        mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] = item;


        this.removeFromPockets(index);
    }

    public pickup(mapItems: any): number {


        let item: ACItem = this.CheckItem(mapItems);

        if (item != null) {

            //add to pockets
            let result = this.addToPockets(item);

            let x: number = this.acreSquareX;
            let y: number = this.acreSquareY;

            //If underfoot remove item, else check square the player is moving to.
            if (mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] != null) {
                mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] = null;

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


                if (mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] != null) {
                    return mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] = null;

                }

                return result;

            }
        }

        else {
            return -2;
        }
    }

    public CheckNPC(mapNPC: any): ACNPC {

        //check if item is underfoot


        let x: number = this.acreSquareX;
        let y: number = this.acreSquareY;



        //If underfoot return item, else check square the player is moving to.
        if (mapNPC[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] != null) {
            return mapNPC[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)];

        }

        if (this.Direction == ACPlayerDirection.East) {

            //if item equipped adjust for symbol on map
            if (this.equipment != null) {
                x += 2;
            }

            else {
                x++;
            }
        }

        else if (this.Direction == ACPlayerDirection.North) {
            if (this.equipment != null) {
                y -= 2;
            }

            else {
                y--;
            }
        }

        else if (this.Direction == ACPlayerDirection.South) {
            if (this.equipment != null) {
                y += 2;
            }

            else {
                y++;
            }
        }

        else if (this.Direction == ACPlayerDirection.West) {
            if (this.equipment != null) {
                x -= 2;
            }

            else {
                x--;
            }
        }


        //covers situations where the player is moving between arcs
        try {
            if (mapNPC[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] != null) {
                return mapNPC[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)];

            }

            else {
                return null;
            }
        }

        catch (e) {
            return null;
        }
    }


    public removeItem(mapItems:any) {
        return this.CheckItem(mapItems, true);
    }

    public CheckItem(mapItems: any, remove:boolean = false): ACItem {

        //check if item is underfoot


        let x: number = this.acreSquareX;
        let y: number = this.acreSquareY;



        //If underfoot return item, else check square the player is moving to.
        if (mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] != null) {
            return mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)];

        }

        if (this.Direction == ACPlayerDirection.East) {

            //if item equipped adjust for symbol on map
            if (this.equipment != null) {
                x += 2;
            }

            else {
                x++;
            }
        }

        else if (this.Direction == ACPlayerDirection.North) {
            if (this.equipment != null) {
                y -= 2;
            }

            else {
                y--;
            }
        }

        else if (this.Direction == ACPlayerDirection.South) {
            if (this.equipment != null) {
                y += 2;
            }

            else {
                y++;
            }
        }

        else if (this.Direction == ACPlayerDirection.West) {
            if (this.equipment != null) {
                x -= 2;
            }

            else {
                x--;
            }
        }


        //covers situations where the player is moving between arcs
        try {
            if (mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] != null) {
                if(remove) {
                    mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)] = null;
                }
                return mapItems[this.getAcre()][((y - 2) * this.maxRows) + (x - 1)];

            }

            else {
                return null;
            }
        }

        catch (e) {
            return null;
        }
    }


    public move(mapItems: any, mapNPC:any): number {

        let item: ACItem = this.CheckItem(mapItems);
        let npc:ACNPC = this.CheckNPC(mapNPC);


        //if there's a hole in the way don't allow moving.
        if (item != null) {
            if (item.Type == ACItemTypes.Hole || item.Type == ACItemTypes.Nooks 
                || item.Type == ACItemTypes.Tree || item.Type == ACItemTypes.Rock
                || item.Type == ACItemTypes.Stump || item.Type == ACItemTypes.BBS)  {
                return;
            }
        }

        //if there is a npc in the way don't allow moving.
        if(npc != null) {
            return;
        }

        

        if (this.direction == ACPlayerDirection.North) {

            /* check we are not outwith the bounds of the map */
            if (this.acreSquareY == 1 && this.acreLetter == 1) {
                return -1;
            }

            if (this.acreSquareY == 1 && this.acreLetter != 1) {
                /* so we've moved forward beyond this arce */
                this.acreLetter--;

                /* we're going north so, we'll enter the arce at the bottom - x doesn't change */
                this.acreSquareY = this.maxCols;

            } else {
                this.acreSquareY--;
            }

        } else if (this.direction == ACPlayerDirection.South) {
            /* check we are not outwith the bounds of the map */
            if (this.acreSquareY == this.maxCols && this.acreLetter == 6) {
                return -1;
            }

            if (this.acreSquareY == this.maxCols && this.acreLetter != 6) {
                /* so we've moved forward beyond this arce */
                this.acreLetter++;

                /* we're going south so, we'll enter the arce at the top */
                this.acreSquareY = 1;
            } else {
                this.acreSquareY++;
            }
        }

        else if (this.direction == ACPlayerDirection.East) {
            if (this.acreSquareX == this.maxRows && this.acreNumber == 5) {
                return -1;
            }

            else if (this.acreSquareX == this.maxRows && this.acreNumber != 5) {
                this.acreNumber++;
                this.acreSquareX = 1;
            }

            else {
                this.acreSquareX++;
            }
        }

        else if (this.direction == ACPlayerDirection.West) {
            if (this.acreSquareX == 1 && this.acreNumber == 1) {
                return -1;
            }

            else if (this.acreSquareX == 1 && this.acreNumber != 1) {
                this.acreNumber--;
                this.acreSquareX = this.maxRows;
            }

            else {
                this.acreSquareX--;
            }
        }

        return 1;
    }


}