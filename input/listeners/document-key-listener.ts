import {KeyRegistry} from '../key-registry';
import {PerFrameKeyBuffer} from '../buffers/per-frame-key-buffer';
import {KeyTapTimingWindow} from '../timings/key-tap-timing-window';



/**
 * Lowest level buffer for managing keyboard events. This component captures
 * keyboard events and buffers them in-between frames.
 *
 * Implementation note: This component should only be accessed directly by the
 * state processor which creates semantic keyboard events at the top of each frame
 */
export class DocumentKeyListener
{
  private static instance: DocumentKeyListener = new DocumentKeyListener();
  private frameKeyBuffer?: PerFrameKeyBuffer;

  // We might want to refactor this into a double tap window as well.
  private readonly doubleTapWindowMS = 180;
  lastPressedTimestamps = new Map<bigint, number>();

  keyTapWindow = new KeyTapTimingWindow(220);


  static getInstance()
  {
    return DocumentKeyListener.instance;
  }


  // We are unlikely to ever need another KeyRegistry, however providing it as a
  // constructor default allows us to write a few tests more easily.
  constructor(private keyRegistry: KeyRegistry = KeyRegistry.getInstance())
  {
    this.setupListeners();
  }


  useBuffer(fkb: PerFrameKeyBuffer)
  {
    this.frameKeyBuffer = fkb;
  }


  private getCodePosition(code: string): bigint
  {
    return this.keyRegistry.resolveBit(code);
  }


  private processDoubleTap(bitPosition: bigint, timestamp: number)
  {
    if (!this.frameKeyBuffer) return;

    const lastPress = this.lastPressedTimestamps.get(bitPosition);
    this.lastPressedTimestamps.set(bitPosition, timestamp);
    if (lastPress === undefined) return;

    if (timestamp - lastPress < this.doubleTapWindowMS)
      this.frameKeyBuffer.doublePressed |= (1n << bitPosition);
  }


  private registerPress(code: string, repeat: boolean)
  {
    if (!this.frameKeyBuffer) return;

    const time = performance.now();
    const bitPosition = this.getCodePosition(code);
    if (!repeat)
    {
      this.processDoubleTap(bitPosition, time);
      this.keyTapWindow.updateBuffer(time, bitPosition);
    }

    this.frameKeyBuffer.buttonJustPressed |= (1n << bitPosition);
  }


  private registerRelease(code: string)
  {
    if (!this.frameKeyBuffer) return;

    const time = performance.now();
    const key = this.getCodePosition(code);
    this.frameKeyBuffer.buttonJustReleased |= (1n << key);
    if (this.keyTapWindow.detectKeyTap(time, key)) this.frameKeyBuffer.tapped |= (1n << key)
  }


  private setupListeners()
  {
    window.addEventListener('keydown', ({code, repeat}) =>
      this.registerPress(code, repeat)
    );
    window.addEventListener('keyup', ({code}) =>
      this.registerRelease(code)
    );
  }
}
