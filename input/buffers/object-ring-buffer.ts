/**
 * A ring buffer for contexts where a more complicated object is necessary to store all state
 * and few per-frame allocations are acceptable when passing in state to update the buffer.
 */
export class ObjectRingBuffer<T, U>
{
  private readonly capacity: number;
  private readonly apply: (target: T, applicant: U) => void;
  private readonly initializer: (applicant: U) => T;
  private buffer: T[] = [];
  private head = 0;
  private tail = 0;


  constructor(capacity: number, apply: (target: T, applicant: U) => void, initializer: (applicant: U) => T)
  {
    this.apply = apply;
    this.initializer = initializer;

    this.capacity = capacity * 2;
    this.buffer.length = this.capacity;
  }


  enqueue(item: U)
  {
    const nextHead = (this.head + 1) % this.capacity;
    if (nextHead === this.tail)
    {
      throw Error("Buffer is full");
    }

    if (this.buffer[this.head] === undefined) this.buffer[this.head] = this.initializer(item);
    else this.apply(this.buffer[this.head], item);

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
