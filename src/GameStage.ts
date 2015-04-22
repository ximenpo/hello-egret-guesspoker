class GameStage extends simple.GameStage {
    private _pokerSprites: egret.SpriteSheet;
    private _pokerFramesData: simple.BitmapFramesData;
    private _twShuffle: egret.Tween;

    public constructor(root: egret.DisplayObjectContainer) {
        super(root);
        this.initResources();
    }

    private initResources() {
        this._pokerSprites = RES.getRes("shuffle-cards");
        var data = new simple.BitmapFramesData();
        data.fps = 10;
        data.textures = new Array<egret.Texture>();
        for (var i: number = 0; i < 12; ++i) {
            data.textures.push(this._pokerSprites.getTexture("" + i))
        }
        this._pokerFramesData = data;
    }

    run() {
        this._shuffleCards();
    }

    private _imgShuffle: simple.BitmapAnimation;
    private _shuffleCards() {
        if (!this._imgShuffle) {
            var img = new simple.BitmapAnimation(this._pokerFramesData);
            this.gameLayer.addChild(img);
            this._imgShuffle = img;
            img.addEventListener(simple.BitmapAnimation.EVENT_COMPLETED, this.onShuffleEnd, this);
        }

        var img = this._imgShuffle;
        img.anchorX = 0.5;
        img.anchorY = 0.5;
        img.x = this.stage.stageWidth / 2;
        img.y = this.stage.stageHeight / 2;

        var tw = egret.Tween.get(this._imgShuffle);
        tw.call(img.play, img, [2]);
        tw.pause();
        tw.wait(500);
        tw.to({ y: this.stage.stageHeight / 5 }, 1000);
        this._twShuffle = tw;
    }

    private onShuffleEnd(event: egret.Event) {
        if (this._twShuffle) {
            this._twShuffle.setPaused(false);
        }
    }
}
