import * as charm from 'charm';
export class EntryComponent {

    private visible:boolean = false;
    private text:string = "";
    private icon:string = "";
    private caret:number = 0;
    private value:any = [];

    private readonly maxLen = 12;

    public onSubmit:any = null;

    private symbols:any = {
        "empty": "_",
        "caret": "|",
    }

    private acceptedSymbols:string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVW!$£?#%*+=&^() ";

    constructor(text: string, icon:string='?') {
        this.visible = false;
        this.text = text;
        this.icon = icon;

        for(let i = 0; i < this.maxLen; i++) {
            this.value[i] = "";
        }
    }

    set Visible(vis: boolean) {
        this.visible = vis;
    }

    get Visible():boolean {
        return this.visible;
    }

    public processInput(key) {

        //Enter key
       if(key.charCodeAt(0) == 13) {
           if(this.onSubmit != null) {
               let text:string = this.value.join('');
               this.onSubmit(text);
           }

           this.visible = false;
       }

       //backspace
       else if(key.charCodeAt(0) === 127) {

           if(this.caret > 0) {
               this.value[this.caret] = "";
               this.caret--;
           }
       }

       //move right
       else if(key == '\u001B\u005B\u0043') {
           if(this.caret < this.maxLen - 1) {
               this.caret++;
           }
       }

       //move left
       else if(key == '\u001B\u005B\u0044') {

           if(this.caret > 0) {
               this.caret--;
           }
       }

       else if(this.acceptedSymbols.indexOf(key) != -1 && this.getValueTrueLength() < this.maxLen) {
           this.value[this.caret] = key;
           this.caret++;
       }
    }

    public draw(screen: charm.CharmInstance) {
        if(this.visible) {
            this.renderEntry(screen);
        }
    }

    protected renderEntry(screen: charm.CharmInstance) {

        let icon:string = this.icon;
        let text:string = this.text;
        let entryLine:string = "";

        for(let i = 0; i < this.maxLen; i++) {
            let char:string = this.getValueChar(i);

            if(this.caret == i) {
                entryLine += this.symbols["caret"];
            }

            else if(char != "") {
                entryLine += char;
            }

            else {
                entryLine += this.symbols["empty"];
            }
        }

        screen.erase("down");
        screen.write(`
==============================================
= ${icon} ${text}                            =   
=                                            =
= ${entryLine}                               = 
=                                            =
==============================================
`);
    }

    protected getValueChar(index:number) {
        return this.value[index];
    }

    protected getValueTrueLength() {
        let count:number = 0;

        for(let i = 0; i < this.maxLen; i++) {
            let val:string = this.value[i];

            if(val != "") {
                count++;
            }
        }

        return count;
    }
}