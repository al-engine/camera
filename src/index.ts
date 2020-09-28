import {OrgbValue, Pixels, SetPixel} from "core";

export type MoveCamera = (_x: number, _y: number) => void;
export interface CameraResult {
  moveCamera: MoveCamera;
  pixels: Pixels;
  draw: (setPixel: SetPixel) => void;
  reset: () => void;
}

export default function createCamera(height: number, width: number): CameraResult {
  let x = 0, y = 0;
  let buffer = Array<OrgbValue>();
    function moveCamera(_x: number, _y: number) {
      x = _x;
      y = _y;
    }
    function setPixel(px: number, py: number, color: OrgbValue) {
      const rx = px - x;
      const ry = py - y;
      if (rx >= 0 && rx < width && ry >= 0 && ry < height) {
        buffer[rx + width * ry] = color;
      }
    }
    function getPixel(px: number, py: number): OrgbValue | void {
      const rx = px - x;
      const ry = py - y;
      if (rx >= 0 && rx < width && ry >= 0 && ry < height) {
        return buffer[rx + width * ry];
      }
    }
    function draw(setPixel: SetPixel) {
      for (let i = 0; i < width * height; i++) {
        const row = Math.floor(i / width);
        if (buffer[i]) {
          setPixel(i - row * width, height - row - 1, buffer[i]);
        } else {
          setPixel(i - row * width, height - row - 1, 0);
        }
      }
    }

    function reset() {
      buffer = Array<OrgbValue>();
    }

    return {moveCamera, draw, reset, pixels: {setPixel, getPixel}};

}