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
  const response: Response = await fetch(url);
  const sheet: AssetJson = await response.json();
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
