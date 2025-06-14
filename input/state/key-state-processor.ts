import {PerFrameKeyBuffer} from '../buffers/per-frame-key-buffer';



/**
 * Semantic layer: Processes the buffered inputs from browser input events
 * and sets up the semantic key presses for this frame.
 */
export class KeyStateProcessor
{
  private buffer?: PerFrameKeyBuffer;

  held = 0n;
  justPressed = 0n;
  justReleased = 0n;
  tapped = 0n;
  doubleTapped = 0n;


  useBuffer(kb: PerFrameKeyBuffer)
  {
    this.buffer = kb;
  }


  tick()
  {
    if (this.buffer === undefined) return;

    this.justPressed = this.buffer.buttonJustPressed & ~this.held;
    this.justReleased = this.buffer.buttonJustReleased;

    this.held = (this.held | this.justPressed) & ~this.justReleased;

    this.tapped = this.buffer.tapped;
    this.doubleTapped = this.buffer.doublePressed;
    this.buffer.reset(this.doubleTapped, this.tapped);
  }

}
