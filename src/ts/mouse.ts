/// <reference path="./v2.ts" />
/// <reference path="./events.ts" />

namespace mouse {
  const position: V2 = { x: 400, y: 225 };
  export let inputDisabled: boolean = true;
  export enum Buttons {
    Primary,
    Middle,
    Secondary
  }
  type clickHandler = (position: V2) => void;
  const handlers: Map<Buttons, clickHandler> = new Map();

  export function initialize(canvas: HTMLCanvasElement): void {
    canvas.addEventListener("click", (event: MouseEvent) => {
      if (document.pointerLockElement === null) {
        canvas.requestPointerLock();
      } else if (!inputDisabled) {
        if (handlers.has(event.button)) {
          const fn: clickHandler = handlers.get(event.button);
          fn(V2.copy(position));
        }
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
      if (position.y >= 450) {
        position.y = 450 - 1;
      }
      if (position.x < 0) {
        position.x = 0;
      }
      if (position.y < 0) {
        position.y = 0;
      }
      if (timer >= MOUSEMOVE_POLLING_RATE) {
        timer = 0;
        emit("mousemove", V2.copy(position));
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

  export function bind(button: Buttons, handler: (position: V2) => void): void {
    handlers.set(button, handler);
  }

  export function unbind(button: Buttons): void {
    handlers.delete(button);
  }

  export function unbindAll(): void {
    handlers.clear();
  }
}
