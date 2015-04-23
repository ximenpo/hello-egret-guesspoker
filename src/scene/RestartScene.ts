
class RestartScene extends egret.gui.SkinnableComponent {
    public constructor() {
        super();
        this.touchEnabled   = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClick, this, true, 0);
    }

    public static EVENT_TOUCHED = "touched";

    public partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
    }

    public childrenCreated() {
    }

    private _onClick(event: egret.TouchEvent): void {
        this.dispatchEvent(new egret.Event(RestartScene.EVENT_TOUCHED));
    }
}
