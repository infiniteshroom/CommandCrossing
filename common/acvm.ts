export enum vmOpcodes {
    //Misc
    VM_STRING_NULL_TERM = 0x00,
    VM_MAGIC_SIG = 0xAB,
    VM_DEBUG = 0XFF,

    //Lang structs
    VM_IF = 0x01,
    VM_ELSE = 0x02,
    VM_ENDIF = 0x03,
    VM_SET_VAR = 0x04,
    VM_PUSH_STACK = 0x05,
    VM_POP_STACK = 0x06,
    VM_REG_A = 0x07,
    VM_REG_B = 0x08,
    VM_REG_C = 0x09,
    VM_MOV = 0x0A,

    //functions
    VM_SAY_DIALOG = 0x20,
    VM_BUY_ITEM = null,
    VM_SELL_ITEM = null,
    VM_WRITE = 0x21,
}

export enum vmInterrupts {
    input = 0,
    draw = 1,
    //require information from the acworld. Should read stack to check.
    world = 2,
}




export class ACVM {
    private readonly MAX_STACK: number = 128;
    private stackSize: number = 0;
    private stack: any[] = [];
    private tokenizer: VMTokenizer = null;
    private registers: any = {
        A: 0,
        B: 0,
        C: 0,
    }

    public static fontTable = {
        "A": 0x7A,
        "B": 0x7B,
        "C": 0x7C,
        "D": 0x7C,
        "E": 0x7D,
        "F": 0x7E,
        "G": 0x7F,
        "H": 0x80,
        "I": 0x81,
        "J": 0x82,
        "K": 0x83,
        "L": 0x84,
        "M": 0x85,
        "N": 0x86,
        "O": 0x87,
        "P": 0x88,
        "Q": 0x89,
        "R": 0x8A,
        "S": 0x8B,
        "T": 0x8C,
        "U": 0x8D,
        "V": 0x8E,
        "W": 0x8F,
        "X": 0x90,
        "Y": 0x91,
        "Z": 0x92,
        "a": 0x60,
        "b": 0x61,
        "c": 0x62,
        "d": 0x63,
        "e": 0x64,
        "f": 0x65,
        "g": 0x66,
        "h": 0x67,
        "i": 0x68,
        "j": 0x69,
        "k": 0x6A,
        "l": 0x6B,
        "m": 0x6C,
        "n": 0x6D,
        "o": 0x6E,
        "p": 0x6F,
        "q": 0x70,
        "r": 0x71,
        "s": 0x72,
        "t": 0x73,
        "u": 0x74,
        "v": 0x75,
        "w": 0x76,
        "x": 0x77,
        "y": 0x78,
        "z": 0x79,

        //symbols
        ",": 0x00,
        ":": 0x01,
        "/": 0x02,
        "\\": 0x03,
        "!": 0x04,
        "£": 0x05,
        "$": 0x06,
        "%": 0x07,
        "&": 0x08,
        "*": 0x09,
        "(": 0x0A,
        ")": 0x0B,
        ".": 0x0C,
        "'": 0x0D,
        "#": 0x0E,
        '-': 0x0F,
        "+": 0x10,
        "=": 0x11,
        "@": 0x12,
    }

    public onInterrupt: any = null;

    constructor(data:Uint8Array) {
        this.tokenizer = new VMTokenizer(data);

    }


    private pushOpcode() {
        //if push grab next token as value to push to stack and consume
        let data: string = "";
        let terminated: boolean = false;

        while (!terminated) {

            this.tokenizer.next();
            let token = this.tokenizer.consume();

            if (token != vmOpcodes.VM_STRING_NULL_TERM) {
                let fontKey = Object.keys(ACVM.fontTable).filter((key) => { return ACVM.fontTable[key] === token })[0];

                if (fontKey === undefined) {
                    data += token;
                }

                else {
                    data += fontKey;
                }
            }

            else {
                terminated = true;
            }
        }


        this.push(data);

    }

    private raiseInterrupt(interrupt: vmInterrupts) {
        if (this.onInterrupt != null) {
            return this.onInterrupt(interrupt, this.stack, this.registers);
        }

        else {
            return null;
        }
    }

    private write() {
        let text: string = this.pop();
        console.log(text);
    }

    execute() {

        let token = this.tokenizer.consume();

        if (token != vmOpcodes.VM_MAGIC_SIG) {

            return;
        }

        this.tokenizer.next();

        while (!this.tokenizer.isEnd()) {

            token = this.tokenizer.consume();
            switch (token) {
                case vmOpcodes.VM_PUSH_STACK:
                    this.pushOpcode();
                    break;
                case vmOpcodes.VM_WRITE:
                    this.write();
                    break;
                case vmOpcodes.VM_DEBUG:
                    console.log([
                        'Stack',
                        this.stack,
                    ]);
                    console.log([
                        "Registers",
                        this.registers,
                    ])
                    break;
                case vmOpcodes.VM_SET_VAR:
                    console.log('Not implemented either mov to register or push to stack');
                    break;

                case vmOpcodes.VM_SAY_DIALOG:
                    this.push('saydialog');
                    this.raiseInterrupt(vmInterrupts.world);
                    break;

            }

            this.tokenizer.next();
        }
    }
    push(value: any) {
        this.stack.push(value);
    }

    pop(): any {
        return this.stack.pop();
    }


}


export class VMTokenizer {
    private tokens: Uint8Array = null;
    private pointer = 0;

    constructor(data: Uint8Array) {

        this.tokens = data;
    }

    next(amount: number = 1) {
        this.pointer = this.pointer + amount;
    }

    prev(amount: number = 1) {
        this.pointer = this.pointer - amount;
    }

    consume() {
        return this.tokens[this.pointer];
    }

    isEnd() {
        return this.pointer >= this.tokens.length;
    }

    getTokens() {
        return this.tokens;
    }

    getPos() {
        return this.pointer;
    }
}

export class ACVMAssembler {
    private tokens:any = {
        //misc
        "🍂": vmOpcodes.VM_MAGIC_SIG,
        "\\0": vmOpcodes.VM_STRING_NULL_TERM,
        "debug": vmOpcodes.VM_DEBUG,
        
        //lang structs
        "push": vmOpcodes.VM_PUSH_STACK,

        //functions
        "write": vmOpcodes.VM_WRITE,
        "setvar": vmOpcodes.VM_SET_VAR,
        "saydialog":vmOpcodes.VM_SAY_DIALOG,
    }

 
    public getByteCode(program:string): Uint8Array {
        program = program.split(" ").join("\n");


        let words:string[] = program.split('\n');
        let bytecode:Uint8Array = new Uint8Array(50);

        let count:number = 0;

        for(let i = 0; i < words.length;i++) {
            let word:string = words[i];

            if(word.trim() != "" && word.trim() != '\n') {

                if(this.tokens[word] !== undefined) {
                    bytecode[count] = this.tokens[word];
                    count++;
                }

                else {

                    //assume literal 

                    let letters:string[] = word.split('');

                    for(let i = 0; i < letters.length;i++) {
                        bytecode[count] = ACVM.fontTable[letters[i]];
                        count++;
                    }

                    
                }
                
            }

            
        }
        return bytecode;
    }
}