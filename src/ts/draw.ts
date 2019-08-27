/// <reference path="./gl.ts" />
/// <reference path="./assets.ts" />

function drawTexture(textureName: string, x: number, y: number, sx: number = 1, sy: number = 1): void {
  const t: Texture = TEXTURE_STORE.get(textureName);
  gl.push();
  gl.tran(x, y);
  gl.scale(sx, sy);
  gl.draw(t.atlas, 0, 0, t.w, t.h, t.u0, t.v0, t.u1, t.v1);
  gl.pop();
}

enum Align {
  LEFT,
  CENTER,
  RIGHT
}

type TextParams = {
  colour?: number,
  textAlign?: Align,
  scale?: number,
  wrap?: number
};

function drawText(text: string, x: number, y: number,
  params: TextParams = { colour: 0xFFFFFFFF, textAlign: Align.LEFT, scale: 1, wrap: 0 }): void {
  params.colour = params.colour || 0xFFFFFFFF;
  params.textAlign = params.textAlign || Align.LEFT;
  params.scale = params.scale || 1;
  params.wrap = params.wrap || 0;

  const words: string[] = text.toLowerCase().split(" ");
  const orgx: number = x;
  let offx: number = 0;
  const lineLength: number = params.wrap === 0 ? text.split("").length * 6 : params.wrap;
  let alignmentOffset: number = 0;
  if (params.textAlign === Align.CENTER) {
    alignmentOffset = ~~(-lineLength / 2);
  } else if (params.textAlign === Align.RIGHT) {
    alignmentOffset = ~~-lineLength;
  }

  gl.col(params.colour);
  for (const word of words) {
    if (params.wrap !== 0 && offx + word.length * 6 > params.wrap) {
      y += 6 * params.scale;
      offx = 0;
    }
    for (const letter of word.split("")) {
      const t: Texture = TEXTURE_STORE.get(letter);
      x = orgx + offx;

      gl.push();
      gl.tran(x, y);
      gl.scale(params.scale, params.scale);
      gl.draw(t.atlas, alignmentOffset, 0, t.w, t.h, t.u0, t.v0, t.u1, t.v1);
      gl.pop();
      offx += 6 * params.scale;
    }
    offx += 6 * params.scale;
  }
  gl.col(0xFFFFFFFF);
}

function drawLine(start: V2, end: V2, color: number = 0xFFFFFFFF): void {
  let dx: number = Math.abs(end.x - start.x);
  let dy: number = Math.abs(end.y - start.y);
  let x: number = start.x;
  let y: number = start.y;
  let n: number = 1 + dx + dy;
  const xInc: number = (start.x < end.x ? 1 : -1);
  const yInc: number = (start.y < end.y ? 1 : -1);
  let e: number = dx - dy;
  dx *= 2;
  dy *= 2;
  gl.col(color);
  while (n > 0) {
    drawTexture("solid", x, y);
    if (e > 0) {
      x += xInc;
      e -= dy;
    } else {
      y += yInc;
      e += dx;
    }
    n -= 1;
  }
  gl.col(0xFFFFFFFF);
}
