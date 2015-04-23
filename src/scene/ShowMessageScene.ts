
class ShowMessageScene extends egret.gui.SkinnableComponent {
    public constructor() {
        super();
        //this.skinName = "skins.scene.ShowMessageSkin";
    }

    public ctrlLogo: egret.gui.UIAsset;
    public ctrlMessage: egret.gui.Label;
    public ctrlList: egret.gui.List;

    public static EVENT_CARD_SELECTED = "selected";

    public partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
        if (instance == this.ctrlList) {
            this.ctrlList.addEventListener(egret.gui.IndexChangeEvent.CHANGE, this.onListSelectionChange, this);
        }
    }

    public childrenCreated() {
    }

    private onListSelectionChange(event: egret.gui.IndexChangeEvent): void {
        //console.log("You have selected " + this.ctrlList.selectedItem.label);
        this.dispatchEvent(new egret.Event(ShowMessageScene.EVENT_CARD_SELECTED));
    }
}
