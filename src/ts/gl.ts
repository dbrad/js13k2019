let gl: WebGLRenderingContext;
let width: number;
let height: number;

// xy + uv + argb
const VERTEX_SIZE: number = (4 * 2) + (4 * 2) + (4);
const MAX_BATCH: number = 10922;
const VERTICES_PER_QUAD: number = 6;
const VERTEX_DATA_SIZE: number = VERTEX_SIZE * MAX_BATCH * 4;
const INDEX_DATA_SIZE: number = MAX_BATCH * (2 * VERTICES_PER_QUAD);

const vertexData: ArrayBuffer = new ArrayBuffer(VERTEX_DATA_SIZE);
const vPositionData: Float32Array = new Float32Array(vertexData);
const vColorData: Uint32Array = new Uint32Array(vertexData);
const vIndexData: Uint16Array = new Uint16Array(INDEX_DATA_SIZE);

const mat: Float32Array = new Float32Array([1, 0, 0, 1, 0, 0]);
const stack: Float32Array = new Float32Array(60);

let indexBuffer: WebGLBuffer;
let vertexBuffer: WebGLBuffer;
let count: number = 0;
let stackp: number = 0;
let currentTexture: WebGLTexture = null;
let vertexAttr: number;
let textureAttr: number;
let colourAttr: number;
let c: number = 0xFFFFFFFF; // AABBGGRR

export function init(canvas: HTMLCanvasElement): void {
  width = canvas.width;
  height = canvas.height;
  gl = canvas.getContext("webgl");

  function compileShader(source: string, type: number): WebGLShader {
    const glShader: WebGLShader = gl.createShader(type);
    gl.shaderSource(glShader, source);
    gl.compileShader(glShader);
    return glShader;
  }

  function createShaderProgram(vsSource: string, fsSource: string): WebGLProgram {
    const program: WebGLProgram = gl.createProgram();
    const vShader: WebGLShader = compileShader(vsSource, gl.VERTEX_SHADER);
    const fShader: WebGLShader = compileShader(fsSource, gl.FRAGMENT_SHADER);
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    return program;
  }

  function createBuffer(bufferType: number, size: number, usage: number): WebGLBuffer {
    const buffer: WebGLBuffer = gl.createBuffer();
    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, size, usage);
    return buffer;
  }

  const shader: WebGLShader = createShaderProgram(
    `precision lowp float;attribute vec2 v,t;attribute vec4 c;varying vec2 uv;varying vec4 col;uniform mat4 m;void main() {gl_Position = m * vec4(v, 1.0, 1.0);uv = t;col = c;}`,
    `precision lowp float;varying vec2 uv;varying vec4 col;uniform sampler2D s;void main() {gl_FragColor = texture2D(s, uv) * col;}`
  );

  indexBuffer = createBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndexData.byteLength, gl.STATIC_DRAW);
  vertexBuffer = createBuffer(gl.ARRAY_BUFFER, vertexData.byteLength, gl.DYNAMIC_DRAW);

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  gl.useProgram(shader);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  for (let indexA: number = 0, indexB: number = 0; indexA < MAX_BATCH * VERTICES_PER_QUAD; indexA += VERTICES_PER_QUAD, indexB += 4) {
    vIndexData[indexA + 0] = indexB;
    vIndexData[indexA + 1] = indexB + 1;
    vIndexData[indexA + 2] = indexB + 2;
    vIndexData[indexA + 3] = indexB + 0;
    vIndexData[indexA + 4] = indexB + 3;
    vIndexData[indexA + 5] = indexB + 1;
  }

  gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, vIndexData);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  vertexAttr = gl.getAttribLocation(shader, "v");
  textureAttr = gl.getAttribLocation(shader, "t");
  colourAttr = gl.getAttribLocation(shader, "c");

  gl.enableVertexAttribArray(vertexAttr);
  gl.vertexAttribPointer(vertexAttr, 2, gl.FLOAT, false, VERTEX_SIZE, 0);
  gl.enableVertexAttribArray(textureAttr);
  gl.vertexAttribPointer(textureAttr, 2, gl.FLOAT, false, VERTEX_SIZE, 8);
  gl.enableVertexAttribArray(colourAttr);
  gl.vertexAttribPointer(colourAttr, 4, gl.UNSIGNED_BYTE, true, VERTEX_SIZE, 16);
  gl.uniformMatrix4fv(gl.getUniformLocation(shader, "m"), false, new Float32Array([2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 1, 1, -1, 1, 0, 0]));
  gl.activeTexture(gl.TEXTURE0);
}

export function createTexture(image: HTMLImageElement): WebGLTexture {
  const texture: WebGLTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

export function col(colourHex: number): void {
  c = colourHex;
}

export function bkg(r: number, g: number, b: number): void {
  gl.clearColor(r, g, b, 1);
}

export function cls(): void {
  gl.clear(gl.COLOR_BUFFER_BIT);
}

export function tran(x: number, y: number): void {
  mat[4] = mat[0] * x + mat[2] * y + mat[4];
  mat[5] = mat[1] * x + mat[3] * y + mat[5];
}

export function scale(x: number, y: number): void {
  mat[0] = mat[0] * x;
  mat[1] = mat[1] * x;
  mat[2] = mat[2] * y;
  mat[3] = mat[3] * y;
}

export function rot(r: number): void {
  const sr: number = Math.sin(r);
  const cr: number = Math.cos(r);

  mat[0] = mat[0] * cr + mat[2] * sr;
  mat[1] = mat[1] * cr + mat[3] * sr;
  mat[2] = mat[0] * -sr + mat[2] * cr;
  mat[3] = mat[1] * -sr + mat[3] * cr;
}

export function push(): void {
  stack[stackp + 0] = mat[0];
  stack[stackp + 1] = mat[1];
  stack[stackp + 2] = mat[2];
  stack[stackp + 3] = mat[3];
  stack[stackp + 4] = mat[4];
  stack[stackp + 5] = mat[5];
  stackp += 6;
}

export function pop(): void {
  stackp -= 6;
  mat[0] = stack[stackp + 0];
  mat[1] = stack[stackp + 1];
  mat[2] = stack[stackp + 2];
  mat[3] = stack[stackp + 3];
  mat[4] = stack[stackp + 4];
  mat[5] = stack[stackp + 5];
}

export function draw(texture: WebGLTexture, x: number, y: number, w: number, h: number, u0: number, v0: number, u1: number, v1: number): void {
  const x0: number = x;
  const y0: number = y;
  const x1: number = x + w;
  const y1: number = y + h;
  const x2: number = x;
  const y2: number = y + h;
  const x3: number = x + w;
  const y3: number = y;
  const mat0: number = mat[0];
  const mat1: number = mat[1];
  const mat2: number = mat[2];
  const mat3: number = mat[3];
  const mat4: number = mat[4];
  const mat5: number = mat[5];
  const argb: number = c;

  if (texture !== currentTexture || count + 1 >= MAX_BATCH) {
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertexData);
    gl.drawElements(4, count * VERTICES_PER_QUAD, gl.UNSIGNED_SHORT, 0);
    count = 0;
    if (currentTexture !== texture) {
      currentTexture = texture;
      gl.bindTexture(gl.TEXTURE_2D, currentTexture);
    }
  }

  let offset: number = count * VERTEX_SIZE;

  // Vertex Order
  // Vertex Position | UV | ARGB
  // Vertex 1
  vPositionData[offset++] = x0 * mat0 + y0 * mat2 + mat4;
  vPositionData[offset++] = x0 * mat1 + y0 * mat3 + mat5;
  vPositionData[offset++] = u0;
  vPositionData[offset++] = v0;
  vColorData[offset++] = argb;

  // Vertex 2
  vPositionData[offset++] = x1 * mat0 + y1 * mat2 + mat4;
  vPositionData[offset++] = x1 * mat1 + y1 * mat3 + mat5;
  vPositionData[offset++] = u1;
  vPositionData[offset++] = v1;
  vColorData[offset++] = argb;

  // Vertex 3
  vPositionData[offset++] = x2 * mat0 + y2 * mat2 + mat4;
  vPositionData[offset++] = x2 * mat1 + y2 * mat3 + mat5;
  vPositionData[offset++] = u0;
  vPositionData[offset++] = v1;
  vColorData[offset++] = argb;

  // Vertex 4
  vPositionData[offset++] = x3 * mat0 + y3 * mat2 + mat4;
  vPositionData[offset++] = x3 * mat1 + y3 * mat3 + mat5;
  vPositionData[offset++] = u1;
  vPositionData[offset++] = v0;
  vColorData[offset++] = argb;

  if (++count >= MAX_BATCH) {
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertexData);
    gl.drawElements(4, count * VERTICES_PER_QUAD, gl.UNSIGNED_SHORT, 0);
    count = 0;
  }
}

export function flush(): void {
  if (count === 0) {
    return;
  }
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, vPositionData.subarray(0, count * VERTEX_SIZE));
  gl.drawElements(4, count * VERTICES_PER_QUAD, gl.UNSIGNED_SHORT, 0);
  count = 0;
}
