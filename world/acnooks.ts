import { ACPlayer, ACPlayerDirection, ACPlayerLocation } from './acplayer';
import { ACShop, ACShopTiles } from './acshop';
import { ACItem, ACItemTypes } from './acitem';

export enum ACShopEvent {
    SellItems = 1,
}

export class ACNooks extends ACShop {

    protected itemsToSell:number[] = [];
    protected events:any[] = [];

    get ItemsToSell():number[] {
        return this.itemsToSell;
    }

    set ItemsToSell(value:number[]) {
        this.itemsToSell = value;
    }

    addEvent(value:ACShopEvent) {
        this.events.push(value);
    }

    get Events():any {
        return this.events;
    }

    constructor() {
        super();
        this.name = "Nooks Cranny";
        this.openingTime = new Date(0,0,0,8,0,0);
        this.closingTime = new Date(0,0,0,22,0,0);

        this.mapTerrian = [
            ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Exit,ACShopTiles.Exit,ACShopTiles.Exit,ACShopTiles.Exit,ACShopTiles.Exit,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Floor,ACShopTiles.Wall,
            ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,ACShopTiles.Wall,
        ];

        this.setRandItems();

        //set player/Nooks position 
        this.playerX = 12;
        this.playerY = 7;
        this.Direction = ACPlayerDirection.North;
        this.npcX = 12;
        this.npcY = 6;

    }

    private setRandItems() {
        let item:ACItem = new ACItem();
        item.Name = "Yellow Flower";
        item.Type = ACItemTypes.Flower;
        item.Price = 350;
        
        let toolItem:ACItem = new ACItem();
        toolItem.Name = "Shovel";
        toolItem.Type = ACItemTypes.Shovel;
        toolItem.Price = 500;

        let toolItem2:ACItem = new ACItem();
        toolItem2.Name = "Axe";
        toolItem2.Type = ACItemTypes.Axe;
        toolItem2.Price = 500;


        let uitem = new ACItem();
        uitem.Type = ACItemTypes.Unknown;
        uitem.Name = "DUMMY";
        uitem.Price = -1;

        let fitem = new ACItem();
        fitem.Type = ACItemTypes.Furniture;
        fitem.Name = "Modern Desk";
        fitem.Price = 750;

        let citem = new ACItem();
        citem.Type = ACItemTypes.Shirt;
        citem.Name = "8-Ball shirt";
        citem.Price = 350;

        let umbitem = new ACItem();
        umbitem.Type = ACItemTypes.Umbrellas;
        umbitem.Name = "UMB";
        umbitem.Price = 400;

        let secondRow = 16 * 1;
        let thridRow = 16 * 2;
        let forthRow = 16 * 3;
        
        this.mapItems[secondRow + 1] = fitem;
        this.mapItems[thridRow + 1] = citem;
        this.mapItems[forthRow + 1] = umbitem;

        this.mapItems[thridRow + 6] = uitem;
        this.mapItems[thridRow + 8] = toolItem;
        this.mapItems[thridRow + 10] = toolItem2;

        this.mapItems[forthRow + 6] = item;
        this.mapItems[forthRow + 8] = item;
        this.mapItems[forthRow + 10] = item;
    }
}