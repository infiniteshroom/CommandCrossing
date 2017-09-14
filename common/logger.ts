var fs = require('fs');

export class Logger {
	
	folder:string = '/home/mark/Documents/sites/commandCrossing/data/logs/';
	constructor(folder:string='') {

		folder = folder == '' ? this.folder : folder;

		this.folder = folder;

	//	if(!fs.existsSync(this.getLogName())) {
		//	fs.writeSync(this.getLogName(), "");
	//	}
	}

	writeToLog(type:string, message:string):void {

		fs.appendFileSync(this.getLogName(), "["+type.toUpperCase()+"] " + message + "\n");
	}

	private getLogName():string {
		return this.folder + 'log ' + this.getCurrentDate() + ".log";
	}
	private getCurrentDate():string {
		return new Date().toJSON().slice(0,10);
	}
}