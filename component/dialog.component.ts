import * as charm from 'charm';
export class DialogComponent {

    private pages: string[][];
    private text: string;
    private subject: string;
    private pageNo = 0;
    private visible: boolean = true;
    private color: string = "red";

    private choices: string[] = [];
    private selectedOption = 0;
    private isMenuVisible = false;

    private readonly maxLineLength: number = 41;
    private readonly linesPerPage: number = 2;

    public onChoice = null;

    constructor(text: string, subject: string, choices: string[] = ['Yes', 'No'], color: string = 'red') {
        this.text = text;
        this.subject = subject;
        this.pages = this.getPages();
        this.color = color;
        this.choices = choices;

        this.visible = false;
    }

    set Visible(vis: boolean) {
        this.visible = vis;
    }

    get Visible():boolean {
        return this.visible;
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

            else if (word.indexOf("\n") != -1) {
                lineNo++;
            }

            if (word.indexOf("\n") == -1) {
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
        if (key == 'z' && !this.isMenuVisible) {

            this.pageNo++;
        }

        if (this.isMenuVisible) {

            //move up
            if (key == '\u001B\u005B\u0041') {
                this.selectedOption = 0;
            }

            //move down
            if (key == '\u001B\u005B\u0042') {
                this.selectedOption = 1;
            }

            if(key == 'z') {
                
                if(this.onChoice != null) {
                    this.onChoice(this.selectedOption);
                }

                this.isMenuVisible = false;
                this.visible = false;
            }
        }
    }

    public draw(screen: charm.CharmInstance) {



        if (this.visible) {
            let page = this.pages[this.pageNo];

            let lineOne = page[0] === undefined ? "" : page[0];
            let lineTwo = page[1] === undefined ? "" : page[1];

            lineOne = this.padString(lineOne, this.maxLineLength);
            lineTwo = this.padString(lineTwo, this.maxLineLength);

            screen.erase("down");

            if (this.subject != "") {
                screen.write("\n----------\n");
                screen.write("-");
                screen.foreground(<charm.CharmColor>this.color);
                screen.write(this.subject);
                screen.foreground("white");
                screen.write("-\n");
                screen.write("----------\n");
            }

            screen.write(`==============================================
= ${lineOne}   =                               
= ${lineTwo} ▼ =
===============================================\n`);

            if (this.pageNo + 1 == this.getMaxPages()) {

                let selectedOptionOne = ' ';
                let selectedOptionTwo = ' ';

                if (this.selectedOption == 0) {
                    selectedOptionOne = '▶';
                }

                if (this.selectedOption == 1) {
                    selectedOptionTwo = '▶';
                }
                let acceptOption = this.choices[0];
                let cancelOption = this.choices[1];
                screen.write(`---------
- ${selectedOptionOne} ${acceptOption}    -
- ${selectedOptionTwo} ${cancelOption}    -
--------`);

                this.isMenuVisible = true;
            }

        }

        else {
            screen.erase('down');
        }
    }
}