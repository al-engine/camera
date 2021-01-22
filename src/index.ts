import { OrgbColor, OrgbValue, SetPixel, CameraResult } from '@al-engine/core';

export default function createCamera(
  height: number,
  width: number
): CameraResult {
  let x = 0,
    y = 0;
  let buffer = Array<OrgbValue>();
  function moveCamera(_x: number, _y: number) {
    x = _x;
    y = _y;
  }
  function setPixel(px: number, py: number, color: OrgbValue) {
    const rx = px - x;
    const ry = py - y;
    if (rx >= 0 && rx < width && ry >= 0 && ry < height) {
      const oldColor = new OrgbColor(getPixel(px, py) ?? 0);
      const newColor = new OrgbColor(color);
      buffer[rx + width * ry] = oldColor.compose(newColor).value;
    }
  }
  function getPixel(px: number, py: number): OrgbValue | undefined {
    const rx = px - x;
    const ry = py - y;
    if (rx >= 0 && rx < width && ry >= 0 && ry < height) {
      return buffer[rx + width * ry];
    }
    return undefined;
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

  function inBound(
    position: { x: number; y: number },
    size: { height: number; width: number }
  ) {
    if (position.x + size.width < x) {
      return false;
    }
    if (position.y + size.height < y) {
      return false;
    }
    if (position.x > x + width) {
      return false;
    }
    if (position.y > y + height) {
      return false;
    }
    return true;
  }

  return { moveCamera, inBound, draw, reset, pixels: { setPixel, getPixel } };
}
