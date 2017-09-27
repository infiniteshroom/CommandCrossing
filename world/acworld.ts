import { ACTree } from './actee';
import { ACNPC } from './acnpc';
import { ACItem, ACItemTypes } from './acitem';
import { ACDigItem } from './acdigitem';
import { ACPlayer } from './acplayer';
import { ACTown, ACTerrainType} from './actown';

import { Logger } from './../common/logger';

import { SerializationHelper } from './../common/utils';



export class ACWorld {
    protected town:ACTown = new ACTown();
    protected player:ACPlayer = new ACPlayer();
    protected debug:boolean = false;

    //DBs
    protected villagers:any = {};
    protected items:any = {};

    protected logger:Logger = new Logger();

    public load():void {

        this.loadVillagers();

        this.town.Name = "";
        //this.player.name
        let item = new ACItem();
        item.Name = "Nooks Cranny";
        item.Type = ACItemTypes.Nooks;
        this.town.MapItems["A2"][13] = item;


        let dummy:ACItem = new ACItem();
        dummy.Name = "dummy";
        dummy.Type = ACItemTypes.Apple;
        dummy.Price = 300;

        let dummy2:ACItem = new ACItem();
        dummy2.Name = "dummy";
        dummy2.Type = ACItemTypes.Apple;
        dummy2.Price = 300;

        let dummy3:ACItem = new ACItem();
        dummy3.Name = "dummy";
        dummy3.Type = ACItemTypes.Apple;
        dummy3.Price = 300;



        let treeItem = new ACTree();
        treeItem.Items = [dummy, dummy2, dummy3];

        let rockItem = new ACItem();
        rockItem.Type = ACItemTypes.Rock;

        let bbsitem = new ACItem();
        bbsitem.Type = ACItemTypes.BBS;
        

        this.town.MapItems["A1"][35] = treeItem;
        this.town.MapItems["A1"][70] = rockItem;
        this.town.MapItems["A2"][20] = bbsitem;

        this.town.MapNPC["A1"][5] = this.villagers["Bob"];
        this.town.MapNPC["A2"][3] = this.villagers["Alfonso"];

    }

    //loads in all villagers from json db
    private loadVillagers() {
        let fs = require('fs');

        let data = fs.readFileSync('/home/mark/Documents/sites/commandCrossing/data/animals.json');

        let villagers = JSON.parse(data);

        for(let i = 0; i < villagers.length; i++) {
            let villager = villagers[i];

            let npc: ACNPC = new ACNPC();
            npc.Animal = villager.animal;
            npc.Catchphrase = villager.catchphrase;
            npc.Color = villager.color;
            npc.Personality = villager.personality;
            npc.Name = villager.name;
            npc.DOB = villager.dob;

            this.villagers[villager.name] = npc;

        }
    }

    get Town(): ACTown {
        return this.town;        
    }

    get Player():ACPlayer {
        return this.player;
    }

    get Logger():Logger {
        return this.logger;
    }

    //Used for testing Nooks
    getRandomShopItems(): ACItem[] {

        let item:ACItem = new ACItem();
        item.Name = "Yellow Flower";
        item.Type = ACItemTypes.Flower;
        
        let toolItem:ACItem = new ACItem();
        toolItem.Name = "Shovel";
        toolItem.Type = ACItemTypes.Shovel;

        let axeItem:ACItem = new ACItem();
        toolItem.Name = "Axe";
        toolItem.Type = ACItemTypes.Axe;

        let uitem = new ACItem();
        uitem.Type = ACItemTypes.Unknown;
        uitem.Name = "DUMMY";

        let fitem = new ACItem();
        fitem.Type = ACItemTypes.Furniture;
        fitem.Name = "Modern Desk";

        let citem = new ACItem();
        citem.Type = ACItemTypes.Shirt;
        citem.Name = "8-Ball shirt";

        let umbitem = new ACItem();
        umbitem.Type = ACItemTypes.Umbrellas;
        umbitem.Name = "UMB";

        return [uitem, uitem, axeItem, axeItem, item,item,item,fitem,citem, umbitem];
    }

    hasSave() {
        var fs = require('fs');

        let saveData = fs.readFileSync("/home/mark/Documents/sites/commandCrossing/data/saves/data.json");

        saveData = JSON.parse(saveData);

        if(saveData.town.name != undefined) {
            return true;
        } 

        return false;
    }

    //TODO: tweak as save game changes...
    loadGame():void {
        
        //TODO: support more than one player...
        var fs = require('fs');
        let saveData = fs.readFileSync("/home/mark/Documents/sites/commandCrossing/data/saves/data.json");

        saveData = JSON.parse(saveData);

        let player:any = saveData.players[0];

        this.town.Name = saveData.town.name;

        this.town.MapTerrian = saveData.town.terrian;
        this.town.MapItems = this.fixMapArrays(saveData.town.items, "item");


        this.town.MapNPC = this.fixMapArrays(saveData.town.npcs, "npc");

        let nooks:any = this.town.getShop("nooks");
        nooks.MapItems = this.fixItemsArray(saveData.town.nooks.items);

        this.player.Name = player.name;
        this.player.Bells = player.bells;
        this.player.Items = this.fixItemsArray(player.items);

    }

    /*
        The following functions are used to fix issues with typescript parsed json not
        retaining class information
    */
    fixMapArrays(data:any, type:string) {
        for(let i in data) {
            let acre = i;

            for(let item in data[acre]) {
                switch(type) {
                    case 'item':

                    if(data[acre][item] != undefined) {

                        if(data[acre][item].type == ACItemTypes.Tree) {
                            data[acre][item] = (<any>Object).assign(new ACTree(), data[acre][item]);

                            //set items for tree
                            let items = data[acre][item].items;
                            let itemsFixed:ACItem[] = [];

                            for(var iItem in items) {
                                itemsFixed.push(<ACItem>(<any>Object).assign(new ACItem(), items[iItem]));
                            }

                            data[acre][item].items = itemsFixed;


                        }

                        else if(data[acre][item].type == ACItemTypes.Dig) {
                            data[acre][item] = (<any>Object).assign(new ACDigItem(), data[acre][item]);
                            data[acre][item].item  = <ACItem>(<any>Object).assign(new ACItem(), data[acre][item].item);
                        }

                        else {
                             data[acre][item] = (<any>Object).assign(new ACItem(), data[acre][item]);
                        }
                    }

                    break;

                    case 'npc':

                    if(data[acre][item] != undefined) {
                        data[acre][item] = (<any>Object).assign(new ACNPC(), data[acre][item]);
                    }

                    break;

                }
            } 
        }

        return data;
    }

    fixItemsArray(data:any) {
        for(let i in data) {

           if(data[i] == "null" || data[i] === null) {
                data[i] = undefined;
            }

            if(data[i] != undefined) { 
              data[i] = (<any>Object).assign(new ACItem(), data[i]);
            }
        }

        return data;
    }


    //TODO: add data for saving as needed
    saveGame(): void {
        let saveData = {
            town: {
               name: this.town.Name,
               terrian: this.town.MapTerrian,
               items: this.fixMapArrays(this.town.MapItems, "item"),
               npcs: this.town.MapNPC,
               nooks: {
                   items: this.town.getShop("nooks").MapItems
               }

            },

            players: [
                {
                    name: this.Player.Name,
                    bells: this.Player.Bells,
                    items: this.Player.getPockets(),
                }
            ],
        }

        var fs = require('fs');
        fs.writeFileSync("/home/mark/Documents/sites/commandCrossing/data/saves/data.json", JSON.stringify(saveData));
    }
}