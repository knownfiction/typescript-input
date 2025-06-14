/**
 * The naming of this type is actually a little misleading
 * this is really used to simply toggle bits when reacting to key
 * events. They are later "buffered" in a semantic layer for actual use
 */
export class PerFrameKeyBuffer
{
  buttonJustPressed = 0n;
  buttonJustReleased = 0n;
  doublePressed = 0n;
  tapped = 0n;


  reset(capturedDoublePresses: bigint, capturedTaps: bigint)
  {
    this.buttonJustPressed = 0n;
    this.buttonJustReleased = 0n;
    this.doublePressed ^= capturedDoublePresses;
    this.tapped ^= capturedTaps;
  }
}
