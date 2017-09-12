import * as charm from 'charm';
export class MenuComponent {

    private visible: boolean = true;
    private choices:string[] = [];
    private selectedChoice:number = 0;

    private readonly minOptionLength = 9;

    public onChange = null;

    constructor(choices:string[]=[]) {
        this.visible = false;
        this.choices = choices;
    }

    get Visible():boolean {
        return this.visible;
    }
    set Visible(vis:boolean) {
        this.visible = vis;
    }

    public processInput(key) {
       //move up
        if (key == '\u001B\u005B\u0041') {
            if(this.selectedChoice > 0) {
                this.selectedChoice--;
            }
        }

        //move down
        if (key == '\u001B\u005B\u0042') {
            if(this.selectedChoice < this.choices.length - 1) {
                this.selectedChoice++;
            }
        }

        if(key == 'z') {

            if(this.onChange != null) {
                this.onChange(this.selectedChoice, this.choices[this.selectedChoice]);
            }

            this.visible = false;
        }
        

    }

    public draw(screen: charm.CharmInstance) {
        screen.erase("down");
        
        if(this.visible) {
            screen.write("\n\n==============\n");

            for(var i in this.choices) {

                let choice = this.padOption(this.choices[i]);
                let caret = " ";

                if(parseInt(i) == this.selectedChoice) {
                    caret = "▶";
                }

                screen.write(`= ${caret} ${choice} =\n`);
            }

            screen.write("==============");
        }

        

    }

    private padOption(option:string):string {

        if(option.length < this.minOptionLength) {
            let diff = this.minOptionLength - option.length;

            for(var i = 1; i <= diff; i++) {
                option += " ";
            }
        }

        return option;
    }
}