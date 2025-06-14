import {ClickPoint, ClickType} from '../model';


/**
 * A simple buffer to hold mouse clicks in-between frames. Reuses instantiated objects to
 * reduce GC churn when processing input events in the semantic Cursor layer.
 */
export class ClickRingBuffer
{
  private readonly capacity: number;
  private buffer: ClickPoint[] = [];
  private head = 0;
  private tail = 0;


  constructor(capacity: number)
  {
    this.capacity = capacity * 2;
    this.buffer.length = this.capacity;
  }


  enqueue(x: number, y: number, timing: number, type: ClickType)
  {
    const nextHead = (this.head + 1) % this.capacity;
    if (nextHead === this.tail)
    {
      throw Error("Buffer is full");
    }

    if (this.buffer[this.head] === undefined)
    {
      this.buffer[this.head] = {x, y, timing, type};
    }

    else
    {
      this.buffer[this.head].x = x;
      this.buffer[this.head].y = y;
      this.buffer[this.head].type = type;
      this.buffer[this.head].timing = timing;
    }

    this.head = nextHead;
  }


  * consume(): IterableIterator<ClickPoint>
  {
    while (this.tail !== this.head)
    {
      yield this.buffer[this.tail];
      this.tail = (this.tail + 1) % this.capacity;
    }
  }


  getBufferForDebug()
  {
    return this.buffer.slice();
  }

}
