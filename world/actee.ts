import { ACItem, ACItemTypes } from './acitem';

export class ACTree extends ACItem {
    protected items:ACItem[] = [];

    constructor() {
        super();
        this.Type = ACItemTypes.Tree;
        this.price = 1;
        this.Name = "Tree";
    }

    public shake():ACItem[] {
        let items = this.items;

        this.items = null;
//🍎, 🍐, 🍒, 🍊. 🍍
        return items;
    }

    get Items():ACItem[] {
        return this.items;
    }

    set Items(value:ACItem[]) {
        this.items = value;
    }
}