import { ACNPC } from './acnpc';
import { ACItem, ACItemTypes } from './acitem';
import { ACPlayer } from './acplayer';
import { ACTown } from './actown';

export class ACWorld {
    protected town:ACTown = new ACTown();
    protected player:ACPlayer = new ACPlayer();
    protected debug:boolean = false;

    //DBs
    protected villagers:any = {};
    protected items:any = {};

    public load():void {

        this.loadVillagers();

        this.town.Name = "Nintendo Land";
        //this.player.name
        let item = new ACItem();
        item.Name = "Dummy item";
        item.Type = ACItemTypes.Fossil;
        this.town.MapItems["A1"][3] = item;

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

    //Used for testing Nooks
    getRandomShopItems(): ACItem[] {

        let item:ACItem = new ACItem();
        item.Name = "Yellow Flower";
        item.Type = ACItemTypes.Flower;
        
        let toolItem:ACItem = new ACItem();
        toolItem.Name = "Shovel";
        toolItem.Type = ACItemTypes.Shovel;

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

        return [uitem, uitem, toolItem, toolItem, item,item,item,fitem,citem, umbitem];
    }
}