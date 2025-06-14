import {KeyMapper} from './state/key-mapper';
import {KeyRegistry} from './key-registry';
import {KeyStateProcessor} from './state/key-state-processor';
import {DocumentKeyListener} from './listeners/document-key-listener';
import {PerFrameKeyBuffer} from './buffers/per-frame-key-buffer';
import {GameEvent} from '../core/game-events';
import {KeyQuery, KeyStates} from './model';



/**
 * Keyboard stuff in project
 */
export class Keyboard
{
  private static instance = new Keyboard();
  private buffer: PerFrameKeyBuffer = new PerFrameKeyBuffer();


  static getInstance()
  {
    return Keyboard.instance;
  }


  private constructor(
    private keyMapper: KeyMapper = KeyMapper.getInstance(),
    private keyRegistry: KeyRegistry = KeyRegistry.getInstance(),
    private processor: KeyStateProcessor = new KeyStateProcessor(),
    private listener: DocumentKeyListener = DocumentKeyListener.getInstance())
  {
    // A shared buffer between listener and processor.
    this.listener.useBuffer(this.buffer);
    this.processor.useBuffer(this.buffer);
  }


  query(event: GameEvent, ...keys: KeyStates[])
  {
    const keybind = this.keyMapper.eventToBinding(event);
    const bit = 1n << this.keyRegistry.resolveBit(keybind);
    let stateMask = 0;
    if ((this.processor.held & bit) !== 0n) stateMask |= (1 << KeyQuery.HELD);
    if ((this.processor.justPressed & bit) !== 0n) stateMask |= (1 << KeyQuery.PRESSED);
    if ((this.processor.justReleased & bit) !== 0n) stateMask |= (1 << KeyQuery.RELEASED);
    if ((this.processor.tapped & bit) !== 0n) stateMask |= (1 << KeyQuery.TAPPED);
    if ((this.processor.doubleTapped & bit) !== 0n) stateMask |= (1 << KeyQuery.DOUBLE_TAPPED);
    let mask = 0;
    for (const s of keys) mask |= (1 << s);

    return (stateMask & mask) !== 0;
  }


  /**
   * Call at the top of every frame to update inputs
   */
  pollKeys()
  {
    this.processor.tick();
  }
}
