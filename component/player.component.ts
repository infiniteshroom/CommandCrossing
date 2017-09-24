import * as charm from 'charm';
import { ACWorld } from '../world/acworld';

import { ACPlayerDirection } from '../world/acplayer';
import { ACItem, ACItemTypes } from '../world/acitem';

export class PlayerComponent {

    private visible:boolean = false;
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
         //move up
        if (key == '\u001B\u005B\u0041') {
            this.world.Player.Direction = ACPlayerDirection.North;
            this.world.Player.move(this.world.Town.MapItems, this.world.Town.MapNPC);
            //player.playEffect("/home/mark/Documents/sites/commandCrossing/music/effects/walking.wav");
        }

        //move right
        if (key == '\u001B\u005B\u0043') {
            this.world.Player.Direction = ACPlayerDirection.East;
            this.world.Player.move(this.world.Town.MapItems, this.world.Town.MapNPC)
            //player.playEffect("/home/mark/Documents/sites/commandCrossing/music/effects/walking.wav");
        }

        //move down
        if (key == '\u001B\u005B\u0042') {
            this.world.Player.Direction = ACPlayerDirection.South;
            this.world.Player.move(this.world.Town.MapItems, this.world.Town.MapNPC)
            //player.playEffect("/home/mark/Documents/sites/commandCrossing/music/effects/walking.wav");
        }

        //move left
        if (key == '\u001B\u005B\u0044') {
            this.world.Player.Direction = ACPlayerDirection.West;
            this.world.Player.move(this.world.Town.MapItems, this.world.Town.MapNPC)
            //player.playEffect("/home/mark/Documents/sites/commandCrossing/music/effects/walking.wav");
        }
    }

    public draw(screen: charm.CharmInstance) {
        screen.position(<number>this.world.Player.AcreSquareX, this.world.Player.AcreSquareY);
        screen.write("$");
        this.renderTool(screen);
    }


       renderTool(screen: charm.CharmInstance) {

        let playerTool: ACItem = this.world.Player.Equipment === undefined ? new ACItem() : this.world.Player.Equipment;

        let tool = '';
        let direction = this.world.Player.Direction;

        if (playerTool.Type == ACItemTypes.Shovel) {
            if (direction == ACPlayerDirection.North) {
                tool = '^';
                screen.position(<number>this.world.Player.AcreSquareX, this.world.Player.AcreSquareY - 1);
            }

            if (direction == ACPlayerDirection.East) {
                tool = '>';
                screen.position(<number>this.world.Player.AcreSquareX + 1, this.world.Player.AcreSquareY);
            }

            if (direction == ACPlayerDirection.South) {
                tool = 'v'
                screen.position(<number>this.world.Player.AcreSquareX, this.world.Player.AcreSquareY + 1);
            }

            if (direction == ACPlayerDirection.West) {
                tool = '<';
                screen.position(<number>this.world.Player.AcreSquareX - 1, this.world.Player.AcreSquareY);
            }
        }


        if (playerTool.Type == ACItemTypes.Axe) {
            if (direction == ACPlayerDirection.North) {
                tool = '▲';
                screen.position(<number>this.world.Player.AcreSquareX, this.world.Player.AcreSquareY - 1);
            }

            if (direction == ACPlayerDirection.East) {
                tool = '►';
                screen.position(<number>this.world.Player.AcreSquareX + 1, this.world.Player.AcreSquareY);
            }

            if (direction == ACPlayerDirection.South) {
                tool = '▼'
                screen.position(<number>this.world.Player.AcreSquareX, this.world.Player.AcreSquareY + 1);
            }

            if (direction == ACPlayerDirection.West) {
                tool = '◀';
                screen.position(<number>this.world.Player.AcreSquareX - 1, this.world.Player.AcreSquareY);
            }
        }

        //TODO: rod, net

        screen.write(tool);
    }
}