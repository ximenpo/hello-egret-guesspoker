class GameStage extends simple.GameStage {
    private _pokerSprites: egret.SpriteSheet;
    private _pokerFramesData: simple.BitmapFramesData;

    private _npcSprites: egret.SpriteSheet;
    private _npcFramesData: simple.BitmapFramesData;

    private _cardsData: Array<any> = [];
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

        var cardsNumber = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        for (var i: number = 0; i < cardsNumber.length; i++) {
            this._cardsData.push({ label: cardsNumber[i] });
        }
    }

    private _guiMessage: ShowMessageScene;
    run() {
        this._doShuffleCards();
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
        tw.to({ y: img.height * 2 / 3, scaleX: 0.8, scaleY: 0.8 }, 800, egret.Ease.sineInOut);
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
        img.scaleX = 0.8;
        img.scaleY = 0.8;
        img.x = this.stage.stageWidth / 2;
        img.y = img.height * 2 / 3;

        egret.Tween.removeTweens(img);
        var tw = egret.Tween.get(img);
        tw.to({ y: this.stage.stageHeight / 2, scaleX: 1.2, scaleY: 1.2 }, 800, egret.Ease.bounceOut);
        tw.call(this._doShowMessage, this, ["给你三次机会，如果能猜中数字的话 ..."]);
        tw.wait(3000);
        tw.call(this._doShowMessage, this, ["现在，请猜猜这张牌的数字 ..."]);
        tw.call(this._doInitCards, this);
    }

    private _doShowMessage(msg: string) {
        if (null == this._guiMessage) {
            var ctrl = new ShowMessageScene();
            ctrl.addEventListener(ShowMessageScene.EVENT_CARD_SELECTED, this._doOnCardSelected, this);
            ctrl.visible = false;
            ctrl.enabled = false;
            this.guiLayer.addElement(ctrl);
            this._guiMessage = ctrl;
            egret.callLater(this._doShowMessage, this, [msg]);
            return;
        }

        var ctrl = this._guiMessage;
        if (ctrl.enabled) {
            ctrl.visible = false;
            ctrl.enabled = false;
            egret.callLater(this._doShowMessage, this, [msg]);
            return;
        }

        ctrl.ctrlLogo.source = this._npcFramesData.textures[Math.ceil(Math.random() * 10000) % this._npcFramesData.textures.length];
        ctrl.ctrlMessage.text = msg;
        ctrl.enabled = true;
        ctrl.visible = true;
    }

    private _doInitCards() {
        this._guiMessage.ctrlList.dataProvider = new egret.gui.ArrayCollection(this._cardsData);
    }

    private _doOnCardSelected(evt: egret.Event) {
        alert(Number(this._guiMessage.ctrlList.selectedIndex) + 1);
    }
}
