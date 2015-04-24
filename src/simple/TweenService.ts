module simple {

    class TweenService_ResumeAnimation {
        public constructor(private _tween: egret.Tween, private _target: egret.EventDispatcher, private _event: string) {
        }

        public _resumeTween() {
            if (this._tween) {
                this._tween.setPaused(false);
            }
            if (this._target) {
                this._target.removeEventListener(this._event, this._resumeTween, this);
            }
        }
    }

    export class TweenService{
        public static wait_event(tw: egret.Tween, obj: egret.EventDispatcher, evt: string) {
            var svc = new TweenService_ResumeAnimation(tw, obj, evt);
            obj.addEventListener(evt, svc._resumeTween, svc);

            tw.pause();
        }
    }
}
