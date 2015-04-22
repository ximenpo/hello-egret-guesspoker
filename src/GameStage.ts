class GameStage extends simple.GameStage {
    private _pokerSprites: egret.SpriteSheet;
    private _pokerFramesData: simple.BitmapFramesData;

    private _npcSprites: egret.SpriteSheet;
    private _npcFramesData: simple.BitmapFramesData;

    public constructor(root: egret.DisplayObjectContainer) {
        super(root);
        this.initResources();
    }

    private initResources() {
        this._pokerSprites = RES.getRes("shuffle-cards");
        {
            var data = new simple.BitmapFramesData();
            data.fps = 10;
            data.textures = new Array<egret.Texture>();
            for (var i: number = 0; i < 12; ++i) {
                data.textures.push(this._pokerSprites.getTexture("" + i))
            }
            this._pokerFramesData = data;
        }

        this._npcSprites = RES.getRes("npc");
        {
            var data = new simple.BitmapFramesData();
            data.fps = 10;
            data.textures = new Array<egret.Texture>();
            for (var i: number = 0; i < 8; ++i) {
                data.textures.push(this._npcSprites.getTexture("" + i))
            }
            this._npcFramesData = data;
        }
    }

    private _guiMessage: ShowMessageScene;
    run() {
        this._doShuffleCards();
        this._guiMessage = new ShowMessageScene();
        this.guiLayer.addElement(this._guiMessage);
        this._guiMessage.visible = false;
    }

    private _imgShuffle: simple.BitmapAnimation;
    private _doShuffleCards() {
        if (!this._imgShuffle) {
            var img = new simple.BitmapAnimation(this._pokerFramesData);
            this.gameLayer.addChild(img);
            this._imgShuffle = img;
        }

        var img = this._imgShuffle;
        img.anchorX = 0.5;
        img.anchorY = 0.5;
        img.x = this.stage.stageWidth / 2;
        img.y = this.stage.stageHeight / 2;

        egret.Tween.removeTweens(img);
        var tw = egret.Tween.get(img);
        tw.call(img.play, img, [2]);
        simple.TweenService.wait_event(tw, img, simple.BitmapAnimation.EVENT_COMPLETED);
        tw.wait(200);
        tw.to({ y: img.height * 2 / 3, scaleX: 0.8, scaleY: 0.8}, 800, egret.Ease.sineInOut);
        tw.call(this._doDealCard, this);
    }

    private _imgDealCard: egret.Bitmap;
    private _doDealCard() {
        if (!this._imgDealCard) {
            var img = new egret.Bitmap();
            img.texture = RES.getRes("poker-back");
            this.gameLayer.addChild(img);
            this._imgDealCard = img;
        }

        var img = this._imgDealCard;
        img.anchorX = 0.5;
        img.anchorY = 0.5;
        img.x = this.stage.stageWidth / 2;
        img.y = img.height * 2/3;

        egret.Tween.removeTweens(img);
        var tw = egret.Tween.get(img);
        tw.to({ y: this.stage.stageHeight / 2, scaleX: 1.2, scaleY: 1.2}, 800, egret.Ease.bounceOut);
        tw.call(this._doShowMessage, this, ["给你三次机会，如果能猜中数字的话 ..."]);
    }

    private _imgNPC: simple.BitmapFrame;
    private _doShowMessage(msg: string) {
        if (!this._imgNPC) {
            var img = new simple.BitmapFrame(this._npcFramesData);
            this.gameLayer.addChild(img);
            this._imgNPC = img;
        }

        var img = this._imgNPC;
        img.anchorX = 0.5;
        img.anchorY = 0.5;
        img.x = -img.width;
        img.y = this.stage.stageHeight / 3;
        img.currentFrame = Math.ceil(Math.random() * 10000) % this._npcFramesData.textures.length;

        egret.Tween.removeTweens(img);
        var tw = egret.Tween.get(img);
        tw.to({ x: img.width / 2 }, 800, egret.Ease.sineIn);
        tw.call(this._doShowGUIMessage, this, [msg]);
    }

    private _doShowGUIMessage(msg: string) {
        console.log("_doShowGUIMessage");
        this._guiMessage.ctrlMessage.text = msg;
        this._guiMessage.visible = true;
    }
}
