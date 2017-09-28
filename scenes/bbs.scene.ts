import { TownScene } from './town.scene';
import { EntryComponent } from '../component/entry.component';
import { ACBBSItem } from '../world/acbbsitem';
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

export enum BBSMode {
    view = 0,
    create = 1,
}
export class BBSScene extends BaseScene {

    tick = 0;
    items:ACBBSItem[] = [];
    selected:number = 0;

    newMessage:string = '';

    readonly maxLen:number = 38;

    mode:BBSMode = BBSMode.view;

    private acceptedSymbols:string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVW!$£?#%*+=&^() ";

    protected dialog:DialogComponent = new DialogComponent("","");


    constructor(screen: charm.CharmInstance, world: ACWorld) {
        super(screen, world);
        this.screen = screen;
        this.world = world;
        this.items = this.world.Town.BBSItems;

        this.dialog.Visible = false;

        
    };

    draw(): void {
        super.draw();

        process.stderr.write('\x1B[?25l');
        
        if(this.mode == BBSMode.create) {
            this.drawCreate();
            this.dialog.draw(this.screen);
        }

        else {
            this.drawView();
        }

    }

    protected drawView() {
        let count = this.getCountOfItems();
        let current = this.getCurrentNo();
        let pagerstring = current + "/" + count;

        let item:ACBBSItem = this.getCurrentItem();

        let playerName = item.PlayerName;

        let date = item.CreatedOn.toDateString();

        let message = item.Message;
        

        this.screen.write(`
================================================================
=                             [0]                        ${pagerstring} =
=      0000000000000000000000000000000000000000000000000       =
=      0   By ${playerName}                 ${date}   0       =
=      0                                               0       =
=      0                                               0       = 
=      0                                               0       =
=      0                                               0       =
= <--  0                                               0  -->  =
=      0                                               0       =
=      0                                               0       =
=      0                                               0       =
=      0000000000000000000000000000000000000000000000000       =
=                                    [Quit - Q]  [Write - X]   =
================================================================
        `);

        //Message block 
        this.screen.position(7, 12); //38


        let lines:string[] = this.getLines(message);

        for(let i = 0; i< lines.length; i++) {
            this.screen.position(12, 7 + i);
            this.screen.write(lines[i]);
        } 

    }

    protected drawCreate() {
        let playerName:string = this.world.Player.Name;
        let date = new Date().toDateString();
        this.screen.write(`
================================================================
=                        Compose Message                       =
=      0000000000000000000000000000000000000000000000000       =
=      0   By ${playerName}                 ${date}   0       =
=      0                                               0       =
=      0                                               0       = 
=      0                                               0       =
=      0                                               0       =
=      0                                               0       =
=      0                                               0       =
=      0                                               0       =
=      0                                               0       =
=      0000000000000000000000000000000000000000000000000       =
=                                   [Quit - Q]  [Save - Enter] =
================================================================        
        `);

        this.screen.position(7, 12); 

        let lines:string[] = this.getLines(this.newMessage);
        
        for(let i = 0; i< lines.length; i++) {
            this.screen.position(12, 7 + i);
            this.screen.write(lines[i]);
        }    

                
        this.screen.position(0, 18);
        this.screen.erase("down");

    }

    processInput(key: any): void {
        super.processInput(key);
        this.dialog.processInput(key);


        if(this.dialog.Visible) {
            return;
        }

        if(this.mode == BBSMode.view) {
            //move right
            if (key == '\u001B\u005B\u0043') {
                if(this.selected < this.items.length -1) {
                    this.selected++;
                }
            }


            //move left
            if (key == '\u001B\u005B\u0044') {
                if(this.selected != 0) {
                    this.selected--;
                }
            }

            if(key == 'x') {
                this.mode = BBSMode.create;
            }
        }

        else if(this.mode == BBSMode.create) {

            //Enter key
            if(key.charCodeAt(0) == 13) {
                let playerName:string = this.world.Player.Name;
                let date = new Date();

                this.dialog = new DialogComponent("Is this correct?", "", ["Yes", "No"]);
                this.dialog.Visible = true;
                this.dialog.onChoice = (choice:number) => {
                    if(choice == 1) {
                        this.mode = BBSMode.view;
                        this.screen.erase("screen");
                        this.newMessage = '';
                    }

                    else {

                        let newItem:ACBBSItem = new ACBBSItem();
                        newItem.CreatedOn = date;
                        newItem.Message = this.newMessage;
                        newItem.PlayerName = playerName;
        
                        this.items.push(newItem);
        
                        this.selected = this.items.length - 1;
        
                        this.mode = BBSMode.view;

                        this.newMessage = '';

                        this.world.Town.BBSItems = this.items;
                        this.screen.erase("screen");
                    }
                }

            }

            //backspace
            else if(key.charCodeAt(0) === 127) {
                this.newMessage = this.newMessage.substr(0, this.newMessage.length - 1);
            }


            else if(this.acceptedSymbols.indexOf(key)) {

                this.newMessage += key;
            }
        }

        if (key == '\u0071') {
            SceneManager.set(new TownScene(this.screen, this.world));
        }
    }


    music(player:Music) {

    }

    getCurrentItem() {
        return this.items[this.selected];
    }

    getCurrentNo() {
        let current:string = (this.selected + 1).toString();
        
        current = parseInt(current) < 10 ? "0" + current : current;

        return current;
    }

    getCountOfItems() {
        let count:string = this.items.length.toString();

        count = parseInt(count) < 10 ? "0" + count : count;

        return count;
    }

    getLines(message:string) {
        let lines: string[] = [];
        let words: string[] = message.split(' ');
        let lineNo = 0;
        
        for (let i = 0; i < words.length; i++) {
            let word = words[i];

            lines[lineNo] = lines[lineNo] === undefined ? "" : lines[lineNo];

            if ((word.length + 1) + lines[lineNo].length > this.maxLen) {
                lineNo++;
            }

            else if(word.indexOf("\n") != -1) {
                lineNo++;
            }

            if(word.indexOf("\n") == -1) {
                lines[lineNo] = lines[lineNo] === undefined ? "" : lines[lineNo];
                lines[lineNo] += " " + word;
            }
        }

        return lines;
    }

}