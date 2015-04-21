module simple{

export  class GameStage extends egret.EventDispatcher {
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

    public static EVENT_GAME_STARTED  = "";

    /**
     *  构造函数
     */
    public  constructor(private _root: egret.DisplayObjectContainer){
        super();

        this._gameLayer = new egret.DisplayObjectContainer();
        this._root.addChild(this._gameLayer);

        this._guiLayer = new egret.gui.UIStage();
        this._root.addChild(this._guiLayer);

        this._effectsLayer = new egret.DisplayObjectContainer();
        this._root.addChild(this._effectsLayer);

        egret.callLater(this.start, this);
    }

    // 游戏启动入口
    start() {
        // game start logic. overridable.
    }
}

}
