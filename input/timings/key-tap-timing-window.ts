/**
 * Detects whether a key was "tapped" by checking the delta timing
 * between when it was pushed down and released
 */

export class KeyTapTimingWindow
{
  private timingWindow: number;
  private readonly times = new Map<bigint, number>();


  constructor(timingWindowMS: number)
  {
    this.timingWindow = timingWindowMS;
  }


  updateBuffer(timing: number, key: bigint)
  {
    this.times.set(key, timing);
  }


  detectKeyTap(timing: number, key: bigint)
  {
    return timing - this.times.get(key)! < this.timingWindow;
  }

}
