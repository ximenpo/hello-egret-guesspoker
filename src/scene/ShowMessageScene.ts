
class ShowMessageScene extends egret.gui.SkinnableComponent {
    public constructor() {
        super();
        this.skinName = "skins.scene.ShowMessageSkin";
    }

    public ctrlMessage: egret.gui.Label;

    public childrenCreated() {
    }

    public partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
    }
}