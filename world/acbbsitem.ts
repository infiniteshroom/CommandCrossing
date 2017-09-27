export class ACBBSItem {
    protected playerName:string = '';
    protected message:string = '';
    protected createdOn:Date = null;

    get PlayerName():string {
        return this.playerName;
    }

    set PlayerName(value:string) {
        this.playerName = value;
    }

    get Message():string {
        return this.message;
    }

    set Message(value:string) {
        this.message = value;
    }

    get CreatedOn():Date {
        return this.createdOn;
    }

    set CreatedOn(value:Date) {
        this.createdOn = value;
    }
}