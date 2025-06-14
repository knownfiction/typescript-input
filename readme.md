# Tiny Input Layer for TypeScript

```
Listeners (Raw Input Stream)
   |
   V
State Processors (Per Frame Semantics)
   |
   V
Cursor (Not Yet Implemented Query Layer)
Keyboard (Query Layer)
```

## Utility
- Buffers: Main purpose is to prevent GC churn by keeping object allocations low
- Timing: Handle stuff that happens across multiple frames. Could use a bit of cleanup
- Key Registry: Lazy initialize keys when they are pressed
- Key Mapper: Decouple key codes from the rest of the game using semantic game events.


## Usage
In the gameplay code simply use the `keyboard.query` interface to ask questions about whether
an event + key combination is valid.

e.g.

```ts
    // only true if the key was pressed and released "a tap"
    keyboard.query("MoveNorth", KeyQuery.TAPPED);

    // only true if the key is currently being held down
    keyboard.query("MoveWest", KeyQuery.HELD);

    // also true for the first frame when the key is down :)
    keyboard.query("MoveSouth", KeyQuery.HELD, KeyQuery.PRESSED);
```
