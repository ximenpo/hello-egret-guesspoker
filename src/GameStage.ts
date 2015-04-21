class GameStage extends simple.GameStage{
    public constructor(root:egret.DisplayObjectContainer){
        super(root);
    }

    start(){
      var sheet : egret.SpriteSheet = RES.getRes("shuffle-cards");
      var data  = new simple.BitmapFramesData();
      data.fps  = 10;
      data.textures = new Array<egret.Texture>();
      for(var i : number = 0; i < 12; ++i){
          data.textures.push(sheet.getTexture("" + i))
      }
      var bitmap= new simple.BitmapAnimation(data);
      this.gameLayer.addChild(bitmap);
      bitmap.play(2);

      bitmap.addEventListener(simple.BitmapAnimation.EVENT_COMPLETED, this.onShuffleEnd, this);
    }

    private onShuffleEnd(event:egret.Event){
        console.log("completed!");
    }
}
