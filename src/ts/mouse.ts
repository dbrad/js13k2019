/// <reference path="./v2.ts" />
/// <reference path="./events.ts" />

namespace mouse {
  export const position: V2 = { x: 400, y: 225 };
  export const over: Map<number, SceneNode> = new Map();
  export let inputDisabled: boolean = true;
  let mouseDown: boolean = false;

  export function initialize(canvas: HTMLCanvasElement): void {
    canvas.addEventListener("click", (event: MouseEvent) => {
      if (document.pointerLockElement === null) {
        canvas.requestPointerLock();
      } else if (!inputDisabled) {
        emit("mouseclick", V2.copy(position));
      }
    });

    canvas.addEventListener("mousedown", () => {
      if (!inputDisabled) {
        mouseDown = true;
        emit("mousedown", V2.copy(position));
      }
    });

    canvas.addEventListener("mouseup", () => {
      if (!inputDisabled) {
        mouseDown = false;
        emit("mouseup", V2.copy(position));
      }
    });

    const MOUSEMOVE_POLLING_RATE: number = 1000 / 60;
    let now: number;
    let then: number = 0;
    let timer: number = 0;
    function updatePosition(e: MouseEvent): void {
      now = performance.now();
      const delta: number = now - then;
      timer += delta;
      then = now;
      position.x += e.movementX;
      position.y += e.movementY;
      if (position.x >= 800) {
        position.x = 800 - 1;
      }
      if (position.y >= 349) {
        position.y = 349 - 1;
      }
      if (position.x < 0) {
        position.x = 0;
      }
      if (position.y < 0) {
        position.y = 0;
      }
      if (timer >= MOUSEMOVE_POLLING_RATE) {
        timer = 0;
        emit("mousemove", V2.copy(position), mouseDown);
      }
    }

    document.addEventListener("pointerlockchange", () => {
      if (document.pointerLockElement === canvas) {
        document.addEventListener("mousemove", updatePosition, false);
        inputDisabled = false;
      } else {
        document.removeEventListener("mousemove", updatePosition, false);
        inputDisabled = true;
      }
    }, false);
  }
}
