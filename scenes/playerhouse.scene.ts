import { HousePocketsScene } from './housepockets.scene';
import { ACItem, ACItemTypes } from '../world/acitem';
import { TownScene } from './town.scene';
import { ACHouse, ACShopTiles } from '../world/achouse';
import { AlertComponent } from '../component/alert.component';
import { DialogComponent } from '../component/dialog.component';
import { TitleScene } from './title.scene';
import { Music } from '../common/music';
import { TrainScene } from './train.scene';
import { SceneManager } from '../common/scene/scenemanager';
import { ACPlayerDirection } from './../world/acplayer';
import { ACWorld } from './../world/acworld';
import { BaseScene } from './../common/scene/base.scene';

import * as charm from 'charm';

export class PlayerHouseScene extends BaseScene {

    tick = 0;

    

    private house:ACHouse = null;

    private dragObject:any = null;

    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;

        this.house = this.world.Player.House;
    };

    draw(): void {
        super.draw();
        this.screen.foreground("white");

        process.stderr.write('\x1B[?25l');
        this.house.render(this.screen);



        this.screen.position(this.house.PlayerX, this.house.PlayerY);
        this.screen.write("$");     
        this.tick++;


    }

    processInput(key: any): void {
        super.processInput(key);

        if(key == 'x') {
            let item = this.house.checkItem(this.house.PlayerX, this.house.PlayerY, this.house.Direction);

            if(item != null && this.dragObject == null) {
                let x = this.house.PlayerX;
                let y = this.house.PlayerY;

                let direction = this.house.Direction;

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

                this.dragObject = {
                    x: x,
                    y: y,
                    direction: this.house.Direction,
                }
            }

            else {
                this.dragObject = null;
            }
        }

        
  
        
        if(this.dragObject === null) {
            if(key == 'e') {
                SceneManager.set(new HousePocketsScene(this.screen, this.world));
            }

            if(key == 'z') {
                let item = this.house.checkItem(this.house.PlayerX, this.house.PlayerY, this.house.Direction);

                if(item !== null) {
                    this.house.pickup(this.world.Player);
                }
            }
            //move up
            if (key == '\u001B\u005B\u0041') {
                this.house.Direction = ACPlayerDirection.North;
                this.house.playerMove();

            }

            //move right
            if (key == '\u001B\u005B\u0043') {
                this.house.Direction = ACPlayerDirection.East;
                this.house.playerMove();
            }

            //move down
            if (key == '\u001B\u005B\u0042') {
                this.house.Direction = ACPlayerDirection.South;         
                this.house.playerMove();

                //if underneath exit tile - load back up town
                if (this.house.checkTile(this.house.PlayerX, this.house.PlayerY) == ACShopTiles.Exit) {

                    //if leaving play overworld theme
                    Music.stopAll();
                    Music.playOverWorldMusic(new Date().getHours().toString());

                    SceneManager.set(new TownScene(this.screen, this.world));
                }
            }

            //move left
            if (key == '\u001B\u005B\u0044') {
                this.house.Direction = ACPlayerDirection.West;
                this.house.playerMove();
            }
        }

        else {

            if(key == '\u001B\u005B\u0041') {
                this.house.Direction = ACPlayerDirection.North;
                this.house.moveItem(this.dragObject.x, this.dragObject.y, this.dragObject.x, this.dragObject.y - 1);
                this.house.playerMove(false);

                this.dragObject.y = this.dragObject.y - 1;
            }

            if(key == '\u001B\u005B\u0043') {
                this.house.Direction = ACPlayerDirection.East;
                this.house.moveItem(this.dragObject.x, this.dragObject.y, this.dragObject.x + 1, this.dragObject.y);
                this.house.playerMove(false);

                this.dragObject.x = this.dragObject.x + 1;
            }


            if(key == '\u001B\u005B\u0042') {
                this.house.Direction = ACPlayerDirection.South;
                this.house.moveItem(this.dragObject.x, this.dragObject.y, this.dragObject.x, this.dragObject.y + 1);
                this.house.playerMove(false);

                this.dragObject.y = this.dragObject.y + 1;
               
            }

            if(key == '\u001B\u005B\u0044') {
                this.house.Direction =  ACPlayerDirection.West;
                this.house.moveItem(this.dragObject.x, this.dragObject.y, this.dragObject.x - 1, this.dragObject.y);
                this.house.playerMove(false);

                this.dragObject.x = this.dragObject.x - 1;
            }
        }

        if (key == '\u0071') {
            process.exit(0);
            Music.stopAll();
        }
    }


    music(player:Music) {
        Music.stopAll();

    }

}