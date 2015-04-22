module simple {

    export class BitmapFramesData {
        public fps: number;               // 幀速
        public textures: egret.Texture[];  // 幀位图
    }

    export class BitmapFrame extends egret.Bitmap {
        public get framesData() {
            return this._framesData;
        }

        public set framesData(data: BitmapFramesData) {
            if (data != this._framesData) {
                this.doSetFramesData(data);
                this.doSetCurrentFrame(this._currentFrame);
            }
        }

        public get currentFrame() {
            return this._currentFrame;
        }

        public set currentFrame(frame: number) {
            this.doSetCurrentFrame(Math.floor(frame));
        }

        public constructor(private _framesData: BitmapFramesData, private _currentFrame: number = 0) {
            super(null);
            this.doSetFramesData(_framesData);
            this.doSetCurrentFrame(_currentFrame);
        }

        doSetFramesData(data: BitmapFramesData) {
            this._framesData = data;
        }

        doSetCurrentFrame(frame: number) {
            this.texture = null;
            this._currentFrame = frame;
            if (this._framesData && this._framesData.textures && this._framesData.textures.length > 0) {
                if (this._currentFrame >= 0 && this._currentFrame < this._framesData.textures.length) {
                    this.texture = this._framesData.textures[this._currentFrame];
                }
            }
        }
    }

    export class BitmapAnimation extends BitmapFrame {
        private _beginTimer: number;
        private _endTimer: number;
        private _isPlaying: boolean;

        public frameRate: number;
        public totalFrames: number;
        public get isPlaying(): boolean {
            return this._isPlaying;
        }

        public static EVENT_STOPPED = "stopped";
        public static EVENT_COMPLETED = "completed";

        public constructor(aFramesData: BitmapFramesData) {
            super(aFramesData, 0);
            this._isPlaying = false;
            this.doSetFramesData(aFramesData);
        }

        public play(playTimes: number = 1): void {
            this._resetAnimation();
            if (!this.frameRate || !this.framesData.textures || this.framesData.textures.length <= 0) {
                return;
            }
            this._isPlaying = true;
            this._beginTimer = egret.getTimer() / 1000/0;
            this._endTimer = this._beginTimer + playTimes * this.totalFrames / this.frameRate;
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }

        public stop(): void {
            this._resetAnimation();
            this.dispatchEvent(new egret.Event(BitmapAnimation.EVENT_STOPPED));
        }

        private _completed() {
            this.stop();
            this.dispatchEvent(new egret.Event(BitmapAnimation.EVENT_COMPLETED));
        }

        private _resetAnimation() {
            this._isPlaying = false;
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }

        private onEnterFrame(event: egret.Event): void {
            var timer = egret.getTimer() / 1000.0;
            if (timer > this._endTimer) {
                this.currentFrame = this.totalFrames - 1;
                egret.callLater(this._completed, this);
                return;
            }
            var frame = Math.floor((timer - this._beginTimer) * this.frameRate) % this.totalFrames;
            if (frame != this.currentFrame) {
                this.currentFrame = frame;
            }
        }

        doSetFramesData(data: BitmapFramesData) {
            if (!this._isPlaying) {
                super.doSetFramesData(data);
                this.frameRate = this.framesData ? this.framesData.fps : 1;
                this.totalFrames = this.framesData ? this.framesData.textures.length : 0;
            }
        }

    }

}
