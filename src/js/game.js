const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 450;
var gl;
(function (gl) {
    let ctx;
    let width;
    let height;
    // xy + uv + argb
    const VERTEX_SIZE = (4 * 2) + (4 * 2) + (4);
    const MAX_BATCH = 10922;
    const VERTICES_PER_QUAD = 6;
    const VERTEX_DATA_SIZE = VERTEX_SIZE * MAX_BATCH * 4;
    const INDEX_DATA_SIZE = MAX_BATCH * (2 * VERTICES_PER_QUAD);
    const vertexData = new ArrayBuffer(VERTEX_DATA_SIZE);
    const vPositionData = new Float32Array(vertexData);
    const vColorData = new Uint32Array(vertexData);
    const vIndexData = new Uint16Array(INDEX_DATA_SIZE);
    const mat = new Float32Array([1, 0, 0, 1, 0, 0]);
    const stack = new Float32Array(60);
    let indexBuffer;
    let vertexBuffer;
    let count = 0;
    let stackp = 0;
    let currentTexture = null;
    let vertexAttr;
    let textureAttr;
    let colourAttr;
    let c = 0xFFFFFFFF; // AABBGGRR
    function init(canvas) {
        width = canvas.width;
        height = canvas.height;
        ctx = canvas.getContext("webgl");
        function compileShader(source, type) {
            const glShader = ctx.createShader(type);
            ctx.shaderSource(glShader, source);
            ctx.compileShader(glShader);
            return glShader;
        }
        function createShaderProgram(vsSource, fsSource) {
            const program = ctx.createProgram();
            const vShader = compileShader(vsSource, ctx.VERTEX_SHADER);
            const fShader = compileShader(fsSource, ctx.FRAGMENT_SHADER);
            ctx.attachShader(program, vShader);
            ctx.attachShader(program, fShader);
            ctx.linkProgram(program);
            return program;
        }
        function createBuffer(bufferType, size, usage) {
            const buffer = ctx.createBuffer();
            ctx.bindBuffer(bufferType, buffer);
            ctx.bufferData(bufferType, size, usage);
            return buffer;
        }
        const shader = createShaderProgram(`precision lowp float;attribute vec2 v,t;attribute vec4 c;varying vec2 uv;varying vec4 col;uniform mat4 m;void main() {gl_Position = m * vec4(v, 1.0, 1.0);uv = t;col = c;}`, `precision lowp float;varying vec2 uv;varying vec4 col;uniform sampler2D s;void main() {gl_FragColor = texture2D(s, uv) * col;}`);
        indexBuffer = createBuffer(ctx.ELEMENT_ARRAY_BUFFER, vIndexData.byteLength, ctx.STATIC_DRAW);
        vertexBuffer = createBuffer(ctx.ARRAY_BUFFER, vertexData.byteLength, ctx.DYNAMIC_DRAW);
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
        ctx.enable(ctx.BLEND);
        ctx.useProgram(shader);
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, indexBuffer);
        for (let indexA = 0, indexB = 0; indexA < MAX_BATCH * VERTICES_PER_QUAD; indexA += VERTICES_PER_QUAD, indexB += 4) {
            vIndexData[indexA + 0] = indexB;
            vIndexData[indexA + 1] = indexB + 1;
            vIndexData[indexA + 2] = indexB + 2;
            vIndexData[indexA + 3] = indexB + 0;
            vIndexData[indexA + 4] = indexB + 3;
            vIndexData[indexA + 5] = indexB + 1;
        }
        ctx.bufferSubData(ctx.ELEMENT_ARRAY_BUFFER, 0, vIndexData);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);
        vertexAttr = ctx.getAttribLocation(shader, "v");
        textureAttr = ctx.getAttribLocation(shader, "t");
        colourAttr = ctx.getAttribLocation(shader, "c");
        ctx.enableVertexAttribArray(vertexAttr);
        ctx.vertexAttribPointer(vertexAttr, 2, ctx.FLOAT, false, VERTEX_SIZE, 0);
        ctx.enableVertexAttribArray(textureAttr);
        ctx.vertexAttribPointer(textureAttr, 2, ctx.FLOAT, false, VERTEX_SIZE, 8);
        ctx.enableVertexAttribArray(colourAttr);
        ctx.vertexAttribPointer(colourAttr, 4, ctx.UNSIGNED_BYTE, true, VERTEX_SIZE, 16);
        ctx.uniformMatrix4fv(ctx.getUniformLocation(shader, "m"), false, new Float32Array([2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 1, 1, -1, 1, 0, 0]));
        ctx.activeTexture(ctx.TEXTURE0);
    }
    gl.init = init;
    function createTexture(image) {
        const texture = ctx.createTexture();
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
        return texture;
    }
    gl.createTexture = createTexture;
    function col(colourHex) {
        c = colourHex;
    }
    gl.col = col;
    function bkg(r, g, b) {
        ctx.clearColor(r, g, b, 1);
    }
    gl.bkg = bkg;
    function cls() {
        ctx.clear(ctx.COLOR_BUFFER_BIT);
    }
    gl.cls = cls;
    function tran(x, y) {
        mat[4] = mat[0] * x + mat[2] * y + mat[4];
        mat[5] = mat[1] * x + mat[3] * y + mat[5];
    }
    gl.tran = tran;
    function scale(x, y) {
        mat[0] = mat[0] * x;
        mat[1] = mat[1] * x;
        mat[2] = mat[2] * y;
        mat[3] = mat[3] * y;
    }
    gl.scale = scale;
    function rot(r) {
        const sr = Math.sin(r);
        const cr = Math.cos(r);
        mat[0] = mat[0] * cr + mat[2] * sr;
        mat[1] = mat[1] * cr + mat[3] * sr;
        mat[2] = mat[0] * -sr + mat[2] * cr;
        mat[3] = mat[1] * -sr + mat[3] * cr;
    }
    gl.rot = rot;
    function push() {
        stack[stackp + 0] = mat[0];
        stack[stackp + 1] = mat[1];
        stack[stackp + 2] = mat[2];
        stack[stackp + 3] = mat[3];
        stack[stackp + 4] = mat[4];
        stack[stackp + 5] = mat[5];
        stackp += 6;
    }
    gl.push = push;
    function pop() {
        stackp -= 6;
        mat[0] = stack[stackp + 0];
        mat[1] = stack[stackp + 1];
        mat[2] = stack[stackp + 2];
        mat[3] = stack[stackp + 3];
        mat[4] = stack[stackp + 4];
        mat[5] = stack[stackp + 5];
    }
    gl.pop = pop;
    function draw(texture, x, y, w, h, u0, v0, u1, v1) {
        const x0 = x;
        const y0 = y;
        const x1 = x + w;
        const y1 = y + h;
        const x2 = x;
        const y2 = y + h;
        const x3 = x + w;
        const y3 = y;
        const mat0 = mat[0];
        const mat1 = mat[1];
        const mat2 = mat[2];
        const mat3 = mat[3];
        const mat4 = mat[4];
        const mat5 = mat[5];
        const argb = c;
        if (texture !== currentTexture || count + 1 >= MAX_BATCH) {
            ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, vertexData);
            ctx.drawElements(4, count * VERTICES_PER_QUAD, ctx.UNSIGNED_SHORT, 0);
            count = 0;
            if (currentTexture !== texture) {
                currentTexture = texture;
                ctx.bindTexture(ctx.TEXTURE_2D, currentTexture);
            }
        }
        let offset = count * VERTEX_SIZE;
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
            ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, vertexData);
            ctx.drawElements(4, count * VERTICES_PER_QUAD, ctx.UNSIGNED_SHORT, 0);
            count = 0;
        }
    }
    gl.draw = draw;
    function flush() {
        if (count === 0) {
            return;
        }
        ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, vPositionData.subarray(0, count * VERTEX_SIZE));
        ctx.drawElements(4, count * VERTICES_PER_QUAD, ctx.UNSIGNED_SHORT, 0);
        count = 0;
    }
    gl.flush = flush;
})(gl || (gl = {}));
/// <reference path="./gl.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ATLAS_STORE = new Map();
const TEXTURE_STORE = new Map();
function load(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        const sheet = yield response.json();
        const image = new Image();
        return new Promise((resolve, reject) => {
            try {
                image.addEventListener("load", () => {
                    const glTexture = gl.createTexture(image);
                    ATLAS_STORE.set(sheet.name, glTexture);
                    for (const texture of sheet.textures) {
                        if (texture.type === "sprite") {
                            TEXTURE_STORE.set(texture.id, {
                                atlas: glTexture,
                                w: texture.w,
                                h: texture.h,
                                u0: texture.x / image.width,
                                v0: texture.y / image.height,
                                u1: (texture.x + texture.w) / image.width,
                                v1: (texture.y + texture.h) / image.height
                            });
                        }
                        else {
                            for (let ox = texture.x, i = 0; ox < image.width; ox += texture.w) {
                                TEXTURE_STORE.set(texture.id[i], {
                                    atlas: glTexture,
                                    w: texture.w,
                                    h: texture.h,
                                    u0: ox / image.width,
                                    v0: texture.y / image.height,
                                    u1: (ox + texture.w) / image.width,
                                    v1: (texture.y + texture.h) / image.height
                                });
                                i++;
                            }
                        }
                    }
                    resolve();
                });
                image.src = sheet.url;
            }
            catch (err) {
                reject(err);
            }
        });
    });
}
/// <reference path="./gl.ts" />
/// <reference path="./assets.ts" />
function drawTexture(textureName, x, y, sx = 1, sy = 1) {
    const t = TEXTURE_STORE.get(textureName);
    gl.push();
    gl.tran(x, y);
    gl.scale(sx, sy);
    gl.draw(t.atlas, 0, 0, t.w, t.h, t.u0, t.v0, t.u1, t.v1);
    gl.pop();
}
var Align;
(function (Align) {
    Align[Align["LEFT"] = 0] = "LEFT";
    Align[Align["CENTER"] = 1] = "CENTER";
    Align[Align["RIGHT"] = 2] = "RIGHT";
})(Align || (Align = {}));
function drawText(text, x, y, textAlign = Align.LEFT, scale = 1, wrap = 0) {
    const words = text.toLowerCase().split(" ");
    const orgx = x;
    let offx = 0;
    const lineLength = wrap === 0 ? text.split("").length * 6 : wrap;
    let alignmentOffset = 0;
    if (textAlign === Align.CENTER) {
        alignmentOffset = ~~(-lineLength / 2);
    }
    else if (textAlign === Align.RIGHT) {
        alignmentOffset = ~~-lineLength;
    }
    for (const word of words) {
        if (wrap !== 0 && offx + word.length * 6 > wrap) {
            y += 6 * scale;
            offx = 0;
        }
        for (const letter of word.split("")) {
            const t = TEXTURE_STORE.get(letter);
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
const events = new Map();
function subscribe(eventName, observerName, handler) {
    if (!events.has(eventName)) {
        events.set(eventName, new Map());
    }
    events.get(eventName).set(observerName, handler);
}
function unsubscribe(eventName, observerName) {
    events.get(eventName).delete(observerName);
}
function unsubscribeAll(eventName) {
    events.get(eventName).clear();
}
function emit(eventName, ...params) {
    const handlers = events.get(eventName);
    if (handlers) {
        for (const [observerName, handler] of handlers) {
            setTimeout(handler, 0, ...params);
        }
    }
}
var V2;
(function (V2) {
    function copy(v2) {
        return { x: v2.x, y: v2.y };
    }
    V2.copy = copy;
    function set(a, b) {
        a.x = b.x;
        a.y = b.y;
    }
    V2.set = set;
})(V2 || (V2 = {}));
/// <reference path="./v2.ts" />
/// <reference path="./events.ts" />
var mouse;
(function (mouse) {
    const position = { x: 400, y: 225 };
    mouse.inputDisabled = true;
    let Buttons;
    (function (Buttons) {
        Buttons[Buttons["Primary"] = 0] = "Primary";
        Buttons[Buttons["Middle"] = 1] = "Middle";
        Buttons[Buttons["Secondary"] = 2] = "Secondary";
    })(Buttons = mouse.Buttons || (mouse.Buttons = {}));
    const handlers = new Map();
    let mouseDown = false;
    function initialize(canvas) {
        canvas.addEventListener("click", (event) => {
            if (document.pointerLockElement === null) {
                canvas.requestPointerLock();
            }
            else if (!mouse.inputDisabled) {
                emit("mouseclick", V2.copy(position));
            }
        });
        canvas.addEventListener("mousedown", () => {
            if (!mouse.inputDisabled) {
                mouseDown = true;
                emit("mousedown", V2.copy(position));
            }
        });
        canvas.addEventListener("mouseup", () => {
            if (!mouse.inputDisabled) {
                mouseDown = false;
                emit("mouseup", V2.copy(position));
            }
        });
        const MOUSEMOVE_POLLING_RATE = 1000 / 60;
        let now;
        let then = 0;
        let timer = 0;
        function updatePosition(e) {
            now = performance.now();
            const delta = now - then;
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
                emit("mousemove", V2.copy(position), mouseDown);
            }
        }
        document.addEventListener("pointerlockchange", () => {
            if (document.pointerLockElement === canvas) {
                document.addEventListener("mousemove", updatePosition, false);
                mouse.inputDisabled = false;
            }
            else {
                document.removeEventListener("mousemove", updatePosition, false);
                mouse.inputDisabled = true;
            }
        }, false);
    }
    mouse.initialize = initialize;
})(mouse || (mouse = {}));
var stats;
(function (stats) {
    let fpsTextNode;
    let msTextNode;
    let frames = 0;
    let fps = 60;
    let lastFps = 0;
    let ms = 1000 / fps;
    function init() {
        const container = document.createElement("div");
        container.style.position = "relative";
        document.body.prepend(container);
        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.left = "10px";
        overlay.style.top = "10px";
        overlay.style.fontFamily = "monospace";
        overlay.style.padding = "1em";
        overlay.style.color = "white";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        container.appendChild(overlay);
        const fpsDOM = document.createElement("div");
        overlay.appendChild(fpsDOM);
        const msDOM = document.createElement("div");
        overlay.appendChild(msDOM);
        fpsTextNode = window.document.createTextNode("");
        fpsDOM.appendChild(fpsTextNode);
        msTextNode = window.document.createTextNode("");
        msDOM.appendChild(msTextNode);
    }
    stats.init = init;
    function tick(now, delta) {
        ms = 0.9 * delta + 0.1 * ms;
        if (now >= lastFps + 1000) {
            fps = 0.9 * frames * 1000 / (now - lastFps) + 0.1 * fps;
            fpsTextNode.nodeValue = (~~fps).toString();
            msTextNode.nodeValue = ms.toFixed(2);
            lastFps = now - (delta % 1000 / 60);
            frames = 0;
        }
        frames++;
    }
    stats.tick = tick;
})(stats || (stats = {}));
let idGen = 0;
class SceneNode {
    constructor() {
        this.children = new Map();
        this.id = idGen++;
    }
    addChild(node) {
        this.children.set(node.id, node);
    }
    removeChild(node) {
        this.children.delete(node.id);
    }
    destroy() {
        for (const [id, node] of this.children) {
            node.destroy();
        }
    }
    update(delta) {
        for (const [id, node] of this.children) {
            node.update(delta);
        }
    }
    draw(delta) {
        for (const [id, node] of this.children) {
            node.draw(delta);
        }
    }
}
/// <reference path="./events.ts" />
/// <reference path="./v2.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./scene-node.ts" />
class Button extends SceneNode {
    constructor(text, x, y, w, h, onClick, colourNormal, colourHover, colourPressed) {
        super();
        this.enabled = true;
        this.colour = 0xFFFF4444;
        this.colourNormal = 0xFFFF4444;
        this.colourHover = 0xFFFF5555;
        this.colourPressed = 0xFFFF1111;
        this.text = text;
        this.positon = { x, y };
        this.size = { x: w, y: h };
        this.onClick = onClick;
        this.colourNormal = colourNormal;
        this.colourHover = colourHover;
        this.colourPressed = colourPressed;
        subscribe("mousemove", `button_${this.id}`, (pos, mousedown) => {
            if (this.enabled && !mousedown) {
                if (pos.x >= this.positon.x && pos.x <= this.positon.x + this.size.x &&
                    pos.y >= this.positon.y && pos.y <= this.positon.y + this.size.y) {
                    this.colour = this.colourHover;
                }
                else {
                    this.colour = this.colourNormal;
                }
            }
        });
        subscribe("mousedown", `button_${this.id}`, (pos) => {
            if (this.enabled) {
                if (pos.x >= this.positon.x && pos.x <= this.positon.x + this.size.x &&
                    pos.y >= this.positon.y && pos.y <= this.positon.y + this.size.y) {
                    this.colour = this.colourPressed;
                }
            }
        });
        subscribe("mouseup", `button_${this.id}`, (pos) => {
            if (this.enabled) {
                if (pos.x >= this.positon.x && pos.x <= this.positon.x + this.size.x &&
                    pos.y >= this.positon.y && pos.y <= this.positon.y + this.size.y) {
                    this.enabled = false;
                    this.onClick();
                    this.colour = this.colourHover;
                    this.enabled = true;
                }
                else {
                    this.colour = this.colourNormal;
                }
            }
        });
    }
    destroy() {
        unsubscribe("mousemove", `button_${this.id}`);
        unsubscribe("mousedown", `button_${this.id}`);
        unsubscribe("mouseup", `button_${this.id}`);
    }
    draw(delta) {
        gl.col(this.colour);
        drawTexture("solid", this.positon.x, this.positon.y, this.size.x, this.size.y);
        gl.col(0XFFFFFFFF);
        drawText(this.text, this.positon.x + ~~(this.size.x / 2), this.positon.y - 2 + ~~(this.size.y / 2), Align.CENTER, 1);
        super.draw(delta);
    }
}
/// <reference path="./consts.ts" />
/// <reference path="./assets.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./events.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./mouse.ts" />
/// <reference path="./stats.ts" />
/// <reference path="./button.ts" />
/// <reference path="./scene-node.ts" />
/// <reference path="./v2.ts" />
const cursor = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 };
class Dice extends SceneNode {
    roll() {
    }
    draw() {
    }
}
class DiceTray extends SceneNode {
}
class ActionSlot extends SceneNode {
}
class ActionCard extends SceneNode {
}
let buttonTester = "";
window.addEventListener("load", () => __awaiter(this, void 0, void 0, function* () {
    const scene = new SceneNode();
    const button = new Button("start game", SCREEN_WIDTH / 2 - 100, SCREEN_HEIGHT / 2 - 20, 200, 40, () => {
        if (buttonTester === "" || buttonTester === "Nothing to see here.") {
            buttonTester = "Stop it.";
        }
        else if (buttonTester === "Stop it.") {
            buttonTester = "The button works, okay?";
        }
        else {
            buttonTester = "Nothing to see here.";
        }
    }, 0xFF444444, 0xff666666, 0xff222222);
    button.size = { x: 200, y: 40 };
    scene.addChild(button);
    let then = 0;
    function tick(now) {
        const delta = now - then;
        then = now;
        scene.update(delta);
        gl.cls();
        drawText("js13k 2019", 5, 5, Align.LEFT, 3);
        drawText("theme: back", 5, 25, Align.LEFT, 2);
        drawText(`(c) 2019 david brad ${buttonTester !== "" ? " - " : ""} ${buttonTester}`, 5, 440, Align.LEFT, 1);
        scene.draw(delta);
        drawTexture("cursor", cursor.x, cursor.y);
        if (process.env.NODE_ENV === "development") {
            stats.tick(now, delta);
        }
        if (mouse.inputDisabled) {
            gl.col(0xAA222222);
            drawTexture("solid", 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            gl.col(0xFFFFFFFF);
            drawText("click to focus game", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, Align.CENTER, 4);
        }
        gl.flush();
        requestAnimationFrame(tick);
    }
    const stage = document.querySelector("#stage");
    const canvas = document.querySelector("canvas");
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    window.addEventListener("resize", () => {
        const scaleX = window.innerWidth / canvas.width;
        const scaleY = window.innerHeight / canvas.height;
        let scaleToFit = Math.min(scaleX, scaleY) | 0;
        scaleToFit = scaleToFit <= 0 ? 1 : scaleToFit;
        const size = [canvas.width * scaleToFit, canvas.height * scaleToFit];
        const offset = [(window.innerWidth - size[0]) / 2, (window.innerHeight - size[1]) / 2];
        const rule = "translate(" + offset[0] + "px, " + offset[1] + "px) scale(" + scaleToFit + ")";
        stage.style.transform = rule;
        stage.style.webkitTransform = rule;
    });
    if (process.env.NODE_ENV === "development") {
        stats.init();
    }
    gl.init(canvas);
    mouse.initialize(canvas);
    yield load("sheet.json");
    subscribe("mousemove", "game", (pos) => {
        V2.set(cursor, pos);
    });
    requestAnimationFrame(tick);
    window.dispatchEvent(new Event("resize"));
}));
