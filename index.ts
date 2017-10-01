#!/usr/bin/env node


import { PlayerHouseScene } from './scenes/playerhouse.scene';

import { BBSScene } from './scenes/bbs.scene';

import { KKSliderScene } from './scenes/kkslider.scene';

import { ACVM, ACVMAssembler, vmInterrupts } from './common/acvm';


import { LogoScene } from './scenes/logo.scene';


import { NookScene } from './scenes/nook.scene';

import { TrainScene } from './scenes/train.scene';


import { TitleScene } from './scenes/title.scene';

import { TownScene } from './scenes/town.scene';


import { ACWorld } from './world/acworld';

import { SceneInterface } from './common/scene/scene.interface';

import { SceneManager } from './common/scene/scenemanager';

import { Logger } from './common/logger';
 
import * as charm from 'charm';

/* 

        let program:string = `🍂
        push tom nook
        push helloworld \\0
        saydialog
        `;
        
        let asm:ACVMAssembler = new ACVMAssembler();
        let bytecode = asm.getByteCode(program);

            
        let vm:ACVM = new ACVM(bytecode);
        vm.onInterrupt = (i:vmInterrupts, stack:any[], register:any) => {
           if(i == vmInterrupts.world) {
               let method = stack.pop();               
               if(method == 'saydialog') {
                   let message = stack.pop();
                   this.alert = new AlertComponent(message, "Tom Nook");
                   this.alert.Visible = true;
               }
           }
        };
        vm.execute();*/

let logger = new Logger();
//logger.writeToLog("Info", "Test");

let cli = charm();

cli.pipe(process.stdout);
cli.reset();

let world:ACWorld = new ACWorld();
world.load();

SceneManager.set(new LogoScene(cli, world));

var iv = setInterval(function () {
    let scene:SceneInterface = SceneManager.get();

    scene.draw();
}, 40);

