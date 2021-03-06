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

        let newItems:ACItem[] = [];

        for(var i in this.items) {
            newItems.push(this.items[i].__clone());
        }
        //clone all items;
        return newItems;
    }

    set Items(value:ACItem[]) {
        this.items = value;
    }
}