import {Keybinding} from '../model';
import {GameEvent} from '../../core/game-events';


/**
 * Sets up a map that can get key codes from semantic game events
 * This way we can create our Keyboard abstraction only caring about semantic
 * game events, and keys will be abstracted away via this mapping layer.
 */
export class KeyMapper
{
  private static instance = new KeyMapper();


  static getInstance()
  {
    return KeyMapper.instance;
  }


  private readonly localstorageKeymapStorageKey = "DEPTHS_CUSTOM_KEYMAPS";
  private eventToKeyMap = new Map<GameEvent, Keybinding>();


  private constructor()
  {
    this.initializeKeybinds();
  }


  private loadSavedRebindings(): Record<GameEvent, Keybinding>
  {
    const fromStore = localStorage.getItem(this.localstorageKeymapStorageKey) ?? "{}";
    return JSON.parse(fromStore);
  }


  // sets up bindings for every semantic game event
  private initializeKeybinds()
  {
    this.eventToKeyMap.set("MoveNorth", "KeyW");
    this.eventToKeyMap.set("MoveSouth", "KeyS");
    this.eventToKeyMap.set("MoveWest", "KeyA");
    this.eventToKeyMap.set("MoveEast", "KeyD");

    // restore users saved keys from localStorage
    for (const [key, value] of Object.entries(this.loadSavedRebindings()))
    {
      this.eventToKeyMap.set(key as GameEvent, value);
    }
  }


  eventToBinding(event: GameEvent): Keybinding
  {
    return this.eventToKeyMap.get(event) ?? "UNRECOGNIZED_BIND";
  }


}
