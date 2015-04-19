class GameUI {
    //游戏场景层，游戏场景相关内容可以放在这里面。
    private _gameLayer: egret.DisplayObjectContainer;
    //GUI的组件必须都在这个容器内部,UIStage会始终自动保持跟舞台一样大小。
    private _guiLayer:  egret.gui.UIStage;
    //游戏特效层，位于GUI层之上的效果都放在这里面。
    private _effectsLayer: egret.DisplayObjectContainer;

    public  get gameLayer(){
        return  this._gameLayer;
    }

    public  get guiLayer(){
        return  this._guiLayer;
    }

    public  get effectsLayer(){
        return  this._effectsLayer;
    }

    public  constructor(private _root: egret.DisplayObjectContainer){
        //super();
        this._gameLayer = new egret.DisplayObjectContainer();
        this._root.addChild(this._gameLayer);

        this._guiLayer = new egret.gui.UIStage();
        this._root.addChild(this._guiLayer);

        this._effectsLayer = new egret.DisplayObjectContainer();
        this._root.addChild(this._effectsLayer);
        //var bitmap: egret.Bitmap = new egret.Bitmap();
        //bitmap.texture = RES.getRes("bgImage");
        //this.gameLayer.addChild(bitmap);


        //var showcase:Showcase = new Showcase();
        //在GUI范围内一律使用addElement等方法替代addChild等方法。
        //Within GUI scope, addChild methods should be replaced by addElement methods.
        //this.guiLayer.addElement(showcase);
    }

}
