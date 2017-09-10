export enum ACItemTypes
{
    Unknown = 0,
    Fossil = 1,
    Fish = 2,
    Bug = 3,
    Flower = 4,
    Fruit = 5,
    Tool = 6,
    Painting = 7,
    Song = 8,
    Furniture = 9,
    Paper = 10,
    Shell = 11,
    Gyroid = 12,
    Umbrellas = 13,
    Hat = 14,
    Eyewear = 15,
    Wigs = 16,
    Bells = 17,
    Shirt = 18,
    Hole = 19,
    Dig = 20,
    Tree = 21,
    Shovel = 22,
    FishingRod = 23,
    BugNet = 24,
    Axe = 25,
    Sold = 26,
    Nooks = 27,
    Rock = 28,
}

export class ACItem {
    protected name:string;
    protected description:string;
    protected price:number;
    protected type:ACItemTypes;

    protected symbols:any = {
        "Unknown":"␦",
        "Fossil" :"⌬",
        "Fish":"℺",
        "Bug":"␦",
        "Flower":"⚘",
        "Fruit":"␦",
        "Tool":"⚒",
        "Painting":"▓",
        "Song":"♪",
        "Furniture":"☙",
        "Paper":"☲",
        "Shell":"␦",
        "Gyroid":"\ud83d\ude35",
        "Umbrellas":"⚘",
        "Hat":"▧",
        "Eyewear":"▧",
        "Wigs":"▧",
        "Bells":"☆",
        "Shirt":"▧",
        "Hole":"O",
        "Dig":"X",
        "Tree":"🌳",
        "Sold": "☒",
        "Nooks": "🍂",
        "Rock": "●",
        "Shovel": "⚒",
        "FishingRod": "⚒",
        "BugNet":"⚒",
        "Axe": "⚒",
    }

    get Name():string {
        return this.name;
    }

    set Name(name:string) {
        this.name = name;
    }

    get Description():string {
        return this.description;
    }

    set Description(text:string) {
        this.description = text;
    }

    get Price():number {
        return this.price;
    }

    set Price(price:number) {
        this.price = price;
    }

    get Type():ACItemTypes {
        return this.type;
    }

    set Type(type:ACItemTypes) {
        this.type = type;
    }

    getSymbol():string  {
        let typeName = ACItemTypes[this.type]
        return this.symbols[typeName];
    }
}