/**
 * A simple ring buffer to hold basic data types to reduce GC churn when capturing input events.
 */
export class SimpleRingBuffer<T>
{
  private readonly capacity: number;
  private buffer: T[] = [];
  private head = 0;
  private tail = 0;


  constructor(capacity: number)
  {
    this.capacity = capacity * 2;
    this.buffer.length = this.capacity;
  }


  enqueue(item: T)
  {
    const nextHead = (this.head + 1) % this.capacity;
    if (nextHead === this.tail)
    {
      throw Error("Buffer is full");
    }

    this.buffer[this.head] = item;
    this.head = nextHead;
  }


  * consume(): IterableIterator<T>
  {
    while (this.tail !== this.head)
    {
      yield this.buffer[this.tail];
      this.tail = (this.tail + 1) % this.capacity;
    }
  }


  flush()
  {
    const out = this.buffer.slice();
    this.head = 0;
    this.tail = 0;
    return out;
  }

}
