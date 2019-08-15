import { Texture, TEXTURE_STORE } from "./assets";
import * as gl from "./gl";

export enum Align {
  LEFT,
  CENTER,
  RIGHT
}

export function drawText(text: string, x: number, y: number, textAlign: Align = Align.LEFT, scale: number = 1, wrap: number = 0): void {
  const words: string[] = text.toLowerCase().split(" ");
  const orgx: number = x;
  let offx: number = 0;
  const lineLength: number = wrap === 0 ? text.split("").length * 6 : wrap;
  let alignmentOffset: number = 0;
  if (textAlign === Align.CENTER) {
    alignmentOffset = ~~(-lineLength / 2);
  } else if (textAlign === Align.RIGHT) {
    alignmentOffset = ~~-lineLength;
  }

  for (const word of words) {
    if (wrap !== 0 && offx + word.length * 6 > wrap) {
      y += 6 * scale;
      offx = 0;
    }
    for (const letter of word.split("")) {
      const t: Texture = TEXTURE_STORE.get(letter);
      x = orgx + offx;

      gl.push();
      gl.tran(x, y);
      gl.scale(scale, scale);
      gl.draw(t.atlas, alignmentOffset, 0, t.w, t.h, t.u0, t.v0, t.u1, t.v1);
      gl.pop();
      offx += 6 * scale;
    }
    offx += 6 * scale;
  }
}
