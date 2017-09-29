import { ACNPC } from '../world/acnpc';
import { ACWorld } from '../world/acworld';

export class Dialog {
    private world:ACWorld = null;
    private npc:ACNPC = null;
    private name:string = '';

    private dialog:any = {};

    constructor(name:string, npc:ACNPC, world:ACWorld) {
        this.world = world;
        this.name = name;
        this.npc = npc;

        var fs = require('fs');
        
        let data = fs.readFileSync(__dirname + '/../data/text/' + this.name + ".json");
        this.dialog = JSON.parse(data);
    }

    getRandomDialog(type:string) {
        let typeArray = this.dialog[type];
        let dialog = typeArray[Math.floor(Math.random()*typeArray.length)];

        return this.replaceAllKeyWords(dialog);
    }

    private replaceAllKeyWords(text:string) {
        text = text.split("{catchphrase}").join(this.npc.Catchphrase);
        text = text.split("{player}").join(this.world.Player.Name);
        text = text.split("{town}").join(this.world.Town.Name);
        text = text.split("{name}").join(this.npc.Name);

        return text;
    }
}