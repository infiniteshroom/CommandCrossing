//This a template for implementing components...
import * as charm from 'charm';
export class BlankComponent {

    private visible:boolean = false;

    constructor(text: string) {
        this.visible = false;
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

    }
}