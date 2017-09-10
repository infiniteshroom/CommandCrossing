import { ACItem, ACItemTypes } from './acitem';
export class ACDigItem extends ACItem {
    private item:ACItem;

    constructor() {
        super();
        this.Type = ACItemTypes.Dig;
    }

    get Item():ACItem {
        return this.item;
    }

    set Item(value:ACItem) {
        this.item = value;
    }
}