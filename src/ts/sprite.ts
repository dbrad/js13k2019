/// <reference path="./scene-node.ts" />
/// <reference path="./assets.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./v2.ts" />

function* Interpolator(duration: number, easingFn: (t: number) => number = (t: number) => t): IterableIterator<number> {
  const start: number = yield 0;
  let now: number = start;
  while (now - start < duration) {
    const val: number = easingFn((now - start) / duration);
    now = yield val;
  }
  if (now - start >= duration) {
    return 1;
  }
}

function movement(origin: V2, destination: V2, duration: number): any {
 // TODO: return a function that uses an Interpolator to get from origin to dest
}

type Frame = {
  textureName: string;
  duration: number;
};

class Sprite extends SceneNode {
  private interp: any = null;
  private frames: Frame[];
  private scale: V2;
  constructor(frames: Frame[], position: V2, scale: V2) {
    super();
    this.frames = frames;
    this.positon = V2.copy(position);
    this.size = V2.copy(scale);
  }

  public moveTo(v2: V2): void {
    // TODO: want to kick off a linear interp for movement
  }

  public destroy(): void {
    // TODO: atte,pt to prep sprite for GC
  }
  public progress: number = 0;
  public loop: boolean = false;
  get currentFrame(): Frame {
    if (this.duration === 0) {
      return this.frames[0];
    } else {
      let totalDuration: number = 0;
      for (const frame of this.frames) {
        totalDuration += frame.duration;
        if (this.progress <= totalDuration) {
          return frame;
        }
      }
      return this.frames[this.frames.length - 1];
    }
  }

  private durationTimer: number = -1;
  get duration(): number {
    if (this.durationTimer === -1) {
      this.durationTimer = 0;
      for (const frame of this.frames) {
        this.durationTimer += frame.duration;
      }
    }
    return this.durationTimer;
  }

  public update(delta: number): void {
    // TODO: interp movement
    if (this.duration === 0) {
        return;
    } else {
        this.progress += delta;
        if (this.progress > this.duration) {
            if (this.loop) {
                this.progress = 0;
            } else {
                this.progress = 0;
            }
        }
    }
  }

  public draw(delta: number): void {
    drawTexture(this.currentFrame.textureName, this.positon.x, this.positon.y, this.size.x, this.size.y);
  }
}
