export class Music {
    private static effect:any = null;
    private static music:any = null;

    private static exec = require("child_process").exec;

    private static musicIsPlaying:boolean = false;

    public static playOverWorldMusic(time:string) {

        this.stopAll();
        this.playMusic(__dirname + "/../music/overworld/"+ time +".mp3");
    
    }

    public static playMusic(file:string) {
        //TODO: fade in/fade out
        this.music = this.exec("cvlc " + file + " --input-title-format ac_music --loop").unref();
        this.musicIsPlaying = true;
    }

    public playEffect(file:string) {

           
    }

    public static stopAll() {
        this.exec('killall -9 vlc').unref();
        this.musicIsPlaying = false;
    }
}