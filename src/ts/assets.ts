/// <reference path="./gl.ts" />

type Texture = {
  atlas: WebGLTexture;
  w: number;
  h: number;
  u0: number;
  v0: number;
  u1: number;
  v1: number;
};

type TextureJson = {
  type: "sprite" | "row";
  id: string|string[];
  x: number;
  y: number;
  w: number;
  h: number;
};

type AssetJson = {
  name: string;
  url: string;
  textures: TextureJson[];
};

const ATLAS_STORE: Map<string, WebGLTexture> = new Map();
const TEXTURE_STORE: Map<string, Texture> = new Map();

async function load(url: string): Promise<{}> {
  const sheet: AssetJson = {
    "name": "sheet",
    "url": "sheet.png",
    "textures": [
      {
        "type": "sprite",
        "id": "cursor",
        "x": 0,
        "y": 10,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "d_s",
        "x": 16,
        "y": 10,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "d_1",
        "x": 32,
        "y": 10,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "d_2",
        "x": 48,
        "y": 10,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "d_3",
        "x": 64,
        "y": 10,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "d_4",
        "x": 80,
        "y": 10,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "d_5",
        "x": 96,
        "y": 10,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "d_6",
        "x": 112,
        "y": 10,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "solid",
        "x": 1,
        "y": 0,
        "w": 1,
        "h": 1
      },
      {
        "type": "sprite",
        "id": "g_0",
        "x": 0,
        "y": 26,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "g_1",
        "x": 16,
        "y": 26,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "s_0",
        "x": 32,
        "y": 26,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "s_1",
        "x": 48,
        "y": 26,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "node",
        "x": 0,
        "y": 42,
        "w": 16,
        "h": 16
      },
      {
        "type": "sprite",
        "id": "gr_0",
        "x": 16,
        "y": 42,
        "w": 8,
        "h": 8
      },
      {
        "type": "sprite",
        "id": "gr_1",
        "x": 24,
        "y": 42,
        "w": 8,
        "h": 8
      },
      {
        "type": "sprite",
        "id": "gr_2",
        "x": 16,
        "y": 50,
        "w": 8,
        "h": 8
      },
      {
        "type": "sprite",
        "id": "gr_3",
        "x": 24,
        "y": 50,
        "w": 8,
        "h": 8
      },
      {
        "type": "sprite",
        "id": "tree",
        "x": 32,
        "y": 42,
        "w": 16,
        "h": 16
      },
      {
        "type": "row",
        "id": [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
          ".",
          "!",
          "?",
          ",",
          "'",
          "\""
        ],
        "x": 0,
        "y": 0,
        "w": 5,
        "h": 5
      },
      {
        "type": "row",
        "id": [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "0",
          "#",
          "[",
          "]",
          "-",
          "^",
          "+",
          "=",
          "/",
          "\\",
          "|",
          ":",
          ";",
          "(",
          ")",
          "<",
          ">",
          "_",
          "{",
          "}",
          "*",
          "%",
          "~"
        ],
        "x": 0,
        "y": 5,
        "w": 5,
        "h": 5
      }
    ]
  };
  
  const image: HTMLImageElement = new Image();

  return new Promise((resolve, reject) => {
    try {
      image.addEventListener("load", () => {
        const glTexture: WebGLTexture = gl.createTexture(image);
        ATLAS_STORE.set(sheet.name, glTexture);

        for (const texture of sheet.textures) {
          if (texture.type === "sprite") {
            TEXTURE_STORE.set(texture.id as string, {
              atlas: glTexture,
              w: texture.w,
              h: texture.h,
              u0: texture.x / image.width,
              v0: texture.y / image.height,
              u1: (texture.x + texture.w) / image.width,
              v1: (texture.y + texture.h) / image.height
            });
          } else {
            for(let ox: number = texture.x, i: number = 0; ox < image.width; ox += texture.w) {
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
    } catch (err) {
      reject(err);
    }
  });
}
