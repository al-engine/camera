import {OrgbValue, Pixels} from "core";

function revertY(y: number, height: number): number {
  return height - y;
}

export type MoveCamera = (_x: number, _y: number) => void;
export interface CameraResult {
  moveCamera: MoveCamera,
  pixels: Pixels
}

export default function createCamera(height: number) {
  let x = 0, y = 0;
  return function (pixels: Pixels): CameraResult {
    function moveCamera(_x: number, _y: number) {
      x = _x;
      y = _y;
    }
    function setPixel(_x: number, _y: number, color: OrgbValue) {
      pixels.setPixel(_x - x, revertY(_y - y, height), color);
    }
    function getPixel(_x: number, _y: number): OrgbValue {
      return pixels.getPixel(_x - x, revertY(_y - y, height));
    }
    return {moveCamera, pixels: {setPixel, getPixel}};
  }
}