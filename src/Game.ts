class Game extends simple.Game{
    public constructor(root:egret.DisplayObjectContainer){
        super(root);
    }

    start(){
      var bitmap: egret.Bitmap = new egret.Bitmap();
      bitmap.texture = RES.getRes("shuffle-cards.0");
      this.gameLayer.addChild(bitmap);
    }
}
