/**
 * Used to control click timing more tightly instead of relying on the browser's
 * native implementation: Timing aware rather than target aware.
 *
 * The broader system uses the average position of all down presses to flag
 * point collisions for clicks. This class is only responsible for setting the "click"
 * flag in the input buffer, not its position.
 */
export class ClickTimingWindow
{
  private timingWindow: number;
  private downTimes = new Map<number, number>();


  constructor(timingWindowMS: number)
  {
    this.timingWindow = timingWindowMS;
  }


  updateBuffer(timing: number, button: number)
  {
    this.downTimes.set(button, timing);
  }


  detectClick(timing: number, button: number)
  {
    return timing - this.downTimes.get(button)! < this.timingWindow;
  }

}
