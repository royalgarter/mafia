class Timer {
    constructor(game, fn) {
        this.game = game;
         this.elapsed = '0.0';
         this.fn = fn;
         this.paused = false;
         this.start = new Date().getTime();
         this.loop = setInterval(() => {
             if (this.paused == false) {
           let time = new Date().getTime() - this.start;
           this.elapsed = Math.floor(time / 100) / 10;
           fn(this);
             }
         }, 100);
    }

    get seconds() {
       return Math.round(this.elapsed);
    }

    get minutes() {
        return Math.round((this.seconds % 3600) / 60)
    }

    get timeleft() {
       let secsleft = this.game.phases.current.duration - this.seconds;
       let mins = Math.floor(secsleft / 60);
        return {
            seconds: secsleft - mins * 60,
            minutes: mins
        }
    }
    

    reset() {
        clearInterval(this.loop);
        this.elapsed = '0.0';
        this.start = new Date().getTime();
        this.loop = setInterval(() => {
            if (this.paused == false) {
          let time = new Date().getTime() - this.start;
          this.elapsed = Math.floor(time / 100) / 10;
          this.fn(this);
            }
        }, 100);
    }

    clearLoop() {
        clearInterval(this.loop);
    }

}

module.exports = Timer;