import * as charm from 'charm';
import { Logger } from './../common/logger';

export class AlertComponent {
    private pages: string[][];
    private text: string;
    private subject: string;
    private pageNo = 0;
    private visible: boolean = true;
    private color:string = "red";

    private textColor:any = null;

    private readonly maxLineLength: number = 41;
    private readonly linesPerPage: number = 2;

    public onComplete = null;
    

    constructor(text: string, subject: string, color:string='red', textColor=null) {
        this.text = text;
        this.subject = subject;
        this.pages = this.getPages();

        this.color = color;
        this.pageNo = 0;

        this.textColor = textColor;

    }

    get Visible():boolean {
        return this.visible;
    }
    set Visible(vis:boolean) {
        this.visible = vis;
    }

    private getMaxPages(): number {
        return this.pages.length;
    }
    private getPages(): string[][] {
        let words: string[] = this.text.split(' ');
        let lineNo = 0;
        let lines: string[] = [];

        for (let i = 0; i < words.length; i++) {
            let word = words[i];

            lines[lineNo] = lines[lineNo] === undefined ? "" : lines[lineNo];

            if ((word.length + 1) + lines[lineNo].length > this.maxLineLength) {
                lineNo++;
            }

            else if(word.indexOf("\n") != -1) {
                lineNo++;
            }

            if(word.indexOf("\n") == -1) {
                lines[lineNo] = lines[lineNo] === undefined ? "" : lines[lineNo];
                lines[lineNo] += " " + word;
            }
        }

        let pageNo = 0;
        let lineCount = 0;
        let pages: string[][] = [];

        //create pages from lines
        for (var i in lines) {
            let line = lines[i];

            pages[pageNo] = pages[pageNo] === undefined ? [] : pages[pageNo];

            pages[pageNo][lineCount] = line.trim();



            if (this.linesPerPage - 1 === lineCount) {
                lineCount = 0;
                pageNo++;
            }

            else {
                lineCount++;
            }
        }
        return pages;
    }

    private padString(text: string, length: number): string {

        let paddingLen = length - text.length;
        if (text.length < length) {
            for (let i = 1; i <= paddingLen; i++) {
                text += " ";
            }
        }

        return text;
    }

    public processInput(key) {
        if (key == 'z') {
            this.pageNo++;
        }
    }

    public draw(screen: charm.CharmInstance) {



        if (this.pageNo + 1 > this.getMaxPages()) {

            if(this.onComplete != null) {
                this.onComplete();
            }
            
            this.visible = false;
        }

        if (this.visible) {

            let page = this.pages[this.pageNo];




            let lineOne = page[0] === undefined ? "" : page[0];
            let lineTwo = page[1] === undefined ? "" : page[1];

            lineOne = this.padString(lineOne, this.maxLineLength);
            lineTwo = this.padString(lineTwo, this.maxLineLength);

            screen.erase("down");

            if(this.subject != "") {
                screen.write("\n----------\n");
                screen.write("-");
                screen.foreground(<charm.CharmColor>this.color);
                screen.write(this.subject);
                screen.foreground("white");
                screen.write("-\n");
                screen.write("----------\n");
            }
        
            screen.write(`==============================================\n`);
            screen.write("=");
            if(this.textColor != null) {
                screen.foreground(<charm.CharmColor>this.textColor);
            }
            
            screen.write(` ${lineOne}  `);
            screen.foreground("white");

            screen.write("=\n");

            screen.write("=");
            if(this.textColor != null) {
                screen.foreground(<charm.CharmColor>this.textColor);
            }
            
            screen.write(` ${lineTwo}▼ `);
            screen.foreground("white");
            screen.write("=\n");


            screen.write(`==============================================`);

        }

        else {
            screen.erase('down');
        }
    }
}