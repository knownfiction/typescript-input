import {DocumentMouseListener} from '../listeners/document-mouse-listener';
import {ClickPoint} from '../model';
import {Point} from '../../core/model';


/**
 * Sematic layer: Processes the buffered mouse events from the browser inputs
 * and sets up per-frame semantics to be used by the Cursor.
 */
export class CursorStateProcessor
{
  // mouse button states
  justPressed = 0;
  justReleased = 0;
  held = 0;
  clicked = 0;
  doubleClicked = 0;

  leftClickDownPosition: ClickPoint = {
    timing: 0,
    type: "LEFT",
    x: -1,
    y: -1
  };
  leftClickReleasedPosition: ClickPoint = {
    timing: 0,
    type: "LEFT",
    x: -1,
    y: -1
  };


  rightClickDownPosition: ClickPoint = {
    timing: 0,
    type: "RIGHT",
    x: -1,
    y: -1
  };
  rightClickReleasedPosition: ClickPoint = {
    timing: 0,
    type: "RIGHT",
    x: -1,
    y: -1
  };


  middleClickDownPosition: ClickPoint = {
    timing: 0,
    type: "MIDDLE",
    x: -1,
    y: -1,
  };
  middleClickReleasedPosition: ClickPoint = {
    timing: 0,
    type: "MIDDLE",
    x: -1,
    y: -1,
  };

  scrollDelta: number = 0;

  cursorLocation: Point = {y: -1, x: -1};

  // provide singleton as constructor argument to allow testing, even though
  // we are unlikely to ever replace the listener impl.
  constructor(private listener: DocumentMouseListener = DocumentMouseListener.getInstance())
  {
  }


  tick()
  {
    // states
    this.justPressed = this.listener.mouseButtonDown;
    this.justReleased = this.listener.mouseButtonUp;
    this.clicked = this.listener.click;
    this.held = (this.held | this.justPressed) & ~this.justReleased;
    this.doubleClicked = this.listener.doubleClick;

    // locations
    this.calculateAverageClickPoints(
      this.listener.mouseDownLocation.consume(),
      this.leftClickDownPosition,
      this.rightClickDownPosition,
      this.middleClickDownPosition
    );

    this.calculateAverageClickPoints(
      this.listener.mouseUpLocation.consume(),
      this.leftClickReleasedPosition,
      this.rightClickReleasedPosition,
      this.middleClickReleasedPosition
    );

    // scroll delta for this frame
    this.scrollDelta = 0;
    for (let delta of this.listener.scrollBuffer.consume())
      this.scrollDelta += delta;

    // Raw Mouse Location
    this.cursorLocation.x = this.listener.mousePositionBuffer.screenX;
    this.cursorLocation.y = this.listener.mousePositionBuffer.screenY;

    // Done for this frame
    this.listener.reset(this.doubleClicked, this.clicked);
  }


  private calculateAverageClickPoints(
    iterator: IterableIterator<ClickPoint>,
    left: ClickPoint,
    right: ClickPoint,
    middle: ClickPoint)
  {
    let leftCount = 0;
    let rightCount = 0;
    let midCount = 0;
    this.resetPoint(left);
    this.resetPoint(right);
    this.resetPoint(middle);

    for (let item of iterator)
    {
      // SUM
      if (item.type === "LEFT")
      {
        leftCount++;
        left.x += item.x;
        left.y += item.y;
        left.timing = item.timing;
      }

      if (item.type === "RIGHT")
      {
        rightCount++;
        right.x += item.x;
        right.y += item.y;
        right.timing = item.timing;
      }

      if (item.type === "MIDDLE")
      {
        midCount++;
        middle.x += item.x;
        middle.y += item.y;
        middle.timing = item.timing;
      }
    }

    // AVERAGE
    if (leftCount > 0)
    {
      left.x = Math.floor(left.x / leftCount);
      left.y = Math.floor(left.y / leftCount);
    }

    if (rightCount > 0)
    {
      right.x = Math.floor(right.x / rightCount);
      right.y = Math.floor(right.y / rightCount);
    }

    if (midCount > 0)
    {
      middle.x = Math.floor(middle.x / midCount);
      middle.y = Math.floor(middle.y / midCount);
    }
  }


  private resetPoint(point: ClickPoint)
  {
    point.x = 0;
    point.y = 0;
    point.timing = 0;
  }

}
