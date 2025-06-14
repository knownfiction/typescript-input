/**
 * Maps keycodes to discrete bit positions in a bitfield.
 * This semantic layer is used across the input system to compute per frame
 * key states
 */
export class KeyRegistry
{
  private static instance: KeyRegistry = new KeyRegistry();


  static getInstance()
  {
    return KeyRegistry.instance;
  }


  private keyPositions = new Map<string, bigint>();
  private nextBit = 0n;


  getAll(): ReadonlyMap<string, bigint>
  {
    return this.keyPositions;
  }


  resolveBit(code: string)
  {
    let bit = KeyRegistry.instance.keyPositions.get(code);
    if (bit !== undefined) return bit;

    bit = this.nextBit;
    this.nextBit++;
    this.keyPositions.set(code, bit);
    return bit;
  }

}
