var fs = require('fs');

export class Logger {
	
	folder:string = __dirname + '/../data/logs/';
	constructor(folder:string='') {

		folder = folder == '' ? this.folder : folder;

		this.folder = folder;
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