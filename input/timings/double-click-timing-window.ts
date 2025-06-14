/**
 * Used to control double click detection.
 *
 * The broader system uses the average position of all down presses to flag
 * point collisions for clicks. This class is only responsible for setting the "click"
 * flag in the input buffer, not its position.
 */
export class DoubleClickTimingWindow
{
  private timingWindow: number;
  private lastClickTime = new Map<number, number>();


  constructor(timingWindowMS: number)
  {
    this.timingWindow = timingWindowMS;
  }


  checkDoubleClick(timing: number, button: number): boolean
  {
    const lastClick = this.lastClickTime.get(button);
    this.lastClickTime.set(button, timing);
    if (lastClick === undefined) return false;

    return timing - lastClick < this.timingWindow;
  }
}