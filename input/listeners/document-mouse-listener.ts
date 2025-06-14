import {ClickRingBuffer} from '../buffers/click-ring-buffer';
import {SimpleRingBuffer} from '../buffers/simple-ring-buffer';
import {clickTypes, DomPosition} from '../model';
import {ClickTimingWindow} from '../timings/click-timing-window';
import {DoubleClickTimingWindow} from '../timings/double-click-timing-window';


/**
 * Listen to DOM cursor events and buffer them to be picked up by semantic
 * layer during frame generation.
 */
export class DocumentMouseListener
{
  private static instance = new DocumentMouseListener();


  public static getInstance(): DocumentMouseListener
  {
    return DocumentMouseListener.instance;
  }


  // buffers
  private readonly clickBufferSize = 30;
  mouseDownLocation = new ClickRingBuffer(this.clickBufferSize);
  mouseUpLocation = new ClickRingBuffer(this.clickBufferSize);
  scrollBuffer = new SimpleRingBuffer<number>(30);
  mousePositionBuffer: DomPosition = {
    screenX: -1,
    screenY: -1
  };

  // handle click and double click checks
  private readonly doubleClickWindowMS = 200;
  private readonly clickTimingWindow = new ClickTimingWindow(300);
  private readonly doubleClickTimingWindow = new DoubleClickTimingWindow(300);

  // state bitfields
  mouseButtonDown = 0;
  mouseButtonUp = 0;
  doubleClick = 0;
  click = 0;


  constructor()
  {
    this.setupListeners();
  }


  setupListeners()
  {
    // clicks and buttons
    window.addEventListener('mousedown', ({button, screenX, screenY}) => this.recordMouseDown(button, screenX, screenY));
    window.addEventListener('mouseup', ({button, screenX, screenY}) => this.recordMouseUp(button, screenX, screenY));

    // cursor screen position
    window.addEventListener('mousemove', ({screenX, screenY}) => this.processMouseMovement(screenX, screenY));

    // scroll buffering
    window.addEventListener('wheel', ({deltaY}) => this.processMouseWheel(deltaY));

    // Disable right-clicking: TODO - import canvasRef so context menu is only blocked on the game viewport.
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }


  private recordMouseDown(buttonNumber: number, x: number, y: number)
  {
    const timing = performance.now();
    const type = clickTypes[buttonNumber];
    this.mouseButtonDown |= (1 << buttonNumber);
    this.mouseDownLocation.enqueue(x, y, timing, type);
    this.clickTimingWindow.updateBuffer(timing, buttonNumber);

    if (this.doubleClickTimingWindow.checkDoubleClick(timing, buttonNumber)) this.doubleClick |= (1 << buttonNumber);
  }


  private recordMouseUp(buttonNumber: number, x: number, y: number)
  {
    const timing = performance.now();
    this.mouseButtonUp |= (1 << buttonNumber);
    this.mouseUpLocation.enqueue(x, y, timing, clickTypes[buttonNumber]);

    if (this.clickTimingWindow.detectClick(timing, buttonNumber))
      this.click |= (1 << buttonNumber);
  }


  private processMouseMovement(screenX: number, screenY: number)
  {
    this.mousePositionBuffer.screenX = screenX;
    this.mousePositionBuffer.screenY = screenY;
  }


  reset(readDoubleClicks: number, readClicks: number)
  {
    this.mouseButtonDown = 0;
    this.mouseButtonUp = 0;
    this.click ^= readClicks;
    this.doubleClick ^= readDoubleClicks;
  }


  private processMouseWheel(deltaY: number)
  {
    this.scrollBuffer.enqueue(deltaY);
  }

}
