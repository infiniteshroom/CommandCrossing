import { ACWorld } from './acworld';
import { Dialog } from '../common/dialog';
import { DialogComponent } from '../component/dialog.component';
import * as charm from 'charm';


export class ACNPC {
    protected name:string;
    protected color:string;
    protected animal:string;
    protected dob:Date;
    protected catchphrase:string;
    protected personality:string;

    protected animalSymbols:any = {
        Cat: "C",
        Dog: "D",
        Sheep: "S",
        Horse: "H",
        Pig: "P",
        Monkey: "M",
        Unicorn: "?",
        Alligator: "A",
        
    }

    constructor() {
        this.Name = "MissingNo";
        this.Animal = "Unicorn";
        this.Catchphrase = "¬.¬";
        this.Color = "red";
        this.DOB = new Date();
        this.personality = "Normal";
    }

    public getDialog(world:ACWorld, type:string) {
        let dialog:Dialog = new Dialog(this.personality, this, world);

        let greeting = dialog.getRandomDialog(type);


        return greeting;

    }

    get Name():string {
        return this.name;
    }

    set Name(name:string) {
        this.name = name;
    }

    get Color():string {
        return this.color;
    }

    set Color(color:string) {
        this.color = color;
    }

    get Animal():string {
        return this.animal;
    }

    set Animal(animal:string) {
        this.animal = animal;
    }

    get Catchphrase():string {
        return this.catchphrase;
    }

    set Catchphrase(catchphrase:string) {
        this.catchphrase = catchphrase;
    }

    get DOB():Date {
        return this.dob;
    }

    set DOB(date:Date) {
        this.dob = date;
    }

    get Personality():string {
        return this.personality;
    }

    set Personality(value:string) {
        this.personality = value;
    }

    getSymbol():string {
        return this.animalSymbols[this.animal];
    }
}