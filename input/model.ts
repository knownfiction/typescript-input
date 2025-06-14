export interface DomPosition
{
  screenX: number;
  screenY: number;
}


export interface ClickPoint
{
  type: ClickType
  x: number;
  y: number;
  timing: number;
}


export const clickTypes = [
  "LEFT",
  "MIDDLE",
  "RIGHT"
] as const;

export type ClickType = typeof clickTypes[number];


export const BINDABLE_KEYS = [
  "Escape",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "Backquote",
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "Digit0",
  "Minus",
  "Equal",
  "Backspace",
  "Insert",
  "Home",
  "PageUp",
  "NumLock",
  "NumpadDivide",
  "NumpadMultiply",
  "NumpadSubtract",
  "Tab",
  "KeyQ",
  "KeyW",
  "KeyE",
  "KeyR",
  "KeyT",
  "KeyY",
  "KeyU",
  "KeyI",
  "KeyO",
  "KeyP",
  "BracketLeft",
  "BracketRight",
  "Enter",
  "Delete",
  "End",
  "PageDown",
  "Numpad7",
  "Numpad8",
  "Numpad9",
  "NumpadAdd",
  "CapsLock",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyF",
  "KeyG",
  "KeyH",
  "KeyJ",
  "KeyK",
  "KeyL",
  "Semicolon",
  "Quote",
  "Backslash",
  "Numpad4",
  "Numpad5",
  "Numpad6",
  "ShiftLeft",
  "IntlBackslash",
  "KeyZ",
  "KeyX",
  "KeyC",
  "KeyV",
  "KeyB",
  "KeyN",
  "KeyM",
  "Comma",
  "Period",
  "Slash",
  "ShiftRight",
  "ArrowUp",
  "Numpad1",
  "Numpad2",
  "Numpad3",
  "NumpadEnter",
  "MetaLeft",
  "Space",
  "ControlLeft",
  "AltRight",
  "MetaRight",
  "ControlRight",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
  "Numpad0",
  "NumpadDecimal",
  "AltLeft",
  "UNRECOGNIZED_BIND"
] as const;
export type Keybinding = typeof BINDABLE_KEYS[number];

export const KEY_STATE_HELD = 1;
export const KEY_STATE_PRESSED = 2;
export const KEY_STATE_RELEASED = 3;
export const KEY_STATE_TAPPED = 4;
export const KEY_STATE_DOUBLE_TAPPED = 5;

export const KeyQuery = {
  HELD: KEY_STATE_HELD,
  PRESSED: KEY_STATE_PRESSED,
  RELEASED: KEY_STATE_RELEASED,
  TAPPED: KEY_STATE_TAPPED,
  DOUBLE_TAPPED: KEY_STATE_DOUBLE_TAPPED
} as const;
export type KeyStates = typeof KeyQuery[keyof typeof KeyQuery];
