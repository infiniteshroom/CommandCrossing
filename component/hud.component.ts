import * as charm from 'charm';

import { ACWorld } from '../world/acworld';

export class HudComponent {

    private visible:boolean = true;
    private world:ACWorld = null;

    constructor(world:ACWorld) {
        this.visible = true;
        this.world = world;
    }

    set Visible(vis: boolean) {
        this.visible = vis;
    }

    get Visible():boolean {
        return this.visible;
    }

    public processInput(key) {

    }

    public draw(screen: charm.CharmInstance) {
        let dayNo = ("0" + (new Date().getDate())).slice(-2);
        let monthNo = ("0" + (new Date().getMonth())).slice(-2);

        let hourNo = ("0" + (new Date().getHours())).slice(-2);
        let minuteNo = ("0" + (new Date().getMinutes())).slice(-2);

        let time = "pm";

        let acre = this.world.Player.getAcre();

        screen.write(`\n(${dayNo}).(${monthNo}) (${hourNo}):(${minuteNo}) ${time} (${acre})`);

    }
}