class GameStage extends simple.GameStage {
    private _pokerSprites: egret.SpriteSheet;
    private _pokerFramesData: simple.BitmapFramesData;

    private _cardsData: Array<any> = [];

    private _cardNumber: number;
    private _remainTimes: number;

    public constructor(root: egret.DisplayObjectContainer) {
        super(root);
        this._cardNumber = 0;
        this._remainTimes = 0;
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
        tw.call(this._doShowMessage, this, ["有三次机会，如果能猜中数字的话 ..."]);
        tw.wait(3000);
        tw.call(this._doShowMessage, this, ["游戏开始，请猜猜这张牌的数字 ..."]);
        tw.wait(500);
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

        ctrl.ctrlLogo.source =  "npc." + Math.ceil(Math.random() * 10000) % 8;
        ctrl.ctrlMessage.text = msg;
        ctrl.enabled = true;
        ctrl.visible = true;
    }

    private _doInitCards() {
        this._cardNumber = Math.floor(Math.random() * 10000) % 14;
        this._remainTimes = 3;
        this._guiMessage.ctrlList.enabled = true;
        this._guiMessage.ctrlList.dataProvider = new egret.gui.ArrayCollection(this._cardsData);
    }

    private _doOnCardSelected(evt: egret.Event) {
        var ret = Number(this._guiMessage.ctrlList.selectedIndex) + 1 - this._cardNumber;
        if (Math.abs(ret) < 0.1) {
            this._doGameEnd(true);
            return;
        }

        this._remainTimes--;
        if (this._remainTimes < 1) {
            this._doGameEnd(false);
            return;
        }

        var tip = (ret < 0) ? "还有机会，猜大点儿呗 ..." : "小一点试试哇 ～～";
        egret.callLater(this._doShowMessage, this, [tip]);
    }

    private _restartScene: RestartScene;
    private _doGameEnd(is_succeed: boolean) {
        this._guiMessage.ctrlList.enabled = false;
        egret.callLater(this._doShowMessage, this, [is_succeed ? "恭喜你，答对啦～～" : "没猜出来涅？再来一把呗～"]);

        egret.callLater(this._doShowRestart, this);
    }

    private _doShowRestart() {
        if (null == this._restartScene) {
            var scene = new RestartScene();
            scene.enabled = false;
            scene.visible = false;
            scene.addEventListener(RestartScene.EVENT_TOUCHED, this._doRestartGame, this);
            egret.gui.PopUpManager.addPopUp(scene, true);
            this._restartScene = scene;
            egret.callLater(this._doShowRestart, this);
            return;
        }

        this._restartScene.enabled = true;
        this._restartScene.visible = true;
    }

    private _doRestartGame(evt: egret.TouchEvent) {
        egret.gui.PopUpManager.removePopUp(this._restartScene);
        this._restartScene = null;

        this.gameLayer.removeChild(this._imgDealCard);
        this._imgDealCard = null;

        this._guiMessage.enabled = false;
        this._guiMessage.visible = false;
        this._guiMessage.ctrlList.dataProvider = null;
        egret.callLater(this._doShuffleCards, this);
    }
}
