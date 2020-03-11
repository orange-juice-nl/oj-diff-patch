import { Delta as JDDelta, Config, DiffPatcher } from "jsondiffpatch"

export type Delta = JDDelta

export class DiffPatch<T> {
  private readonly diffpatcher: DiffPatcher
  private readonly deltas: Delta[] = [];
  private index: number = 0;
  private current: T

  public constructor(options: Config = {}) {
    this.diffpatcher = new DiffPatcher(Object.assign({}, options))
  }

  public listen: (deltas: Delta[], from?: T, to?: T) => void

  public reset() {
    this.deltas.splice(1)
    this.index = 0

    if (typeof this.listen === "function")
      this.listen(this.deltas)
  }

  public load(deltas: Delta[]): T {
    if (deltas.length < 2)
      return
    this.deltas.splice(0, deltas.length, ...deltas)
    this.current = deltas[0] as T
    for (let i = 1; i < deltas.length; i++)
      this.current = this.diffpatcher.patch(this.current, deltas[i])
    return this.current
  }

  public add(to: T, from: T = this.current): T {
    const l = this.deltas.length
    if (this.index < l - 1)
      this.deltas.splice(this.index + 1)
    let d = this.diffpatcher.diff(from, to)
    d = Array.isArray(d) ? d[0] : d
    if (d === undefined) {
      this.current = from
      return from
    }
    this.index = this.deltas.push(d) - 1
    if (typeof this.listen === "function")
      this.listen(this.deltas.slice(0, this.index + 1), from, to)

    this.current = to
    return to
  }

  canUndo() {
    return this.index > 0
  }

  canRedo() {
    return this.index < this.deltas.length - 1
  }

  public undo(from: T = this.current): T {
    if (!this.canUndo())
      return from
    const to = this.diffpatcher.unpatch(from, this.deltas[this.index])
    this.index--

    if (typeof this.listen === "function")
      this.listen(this.deltas.slice(0, this.index + 1), from, to)

    this.current = to
    return to
  }

  public redo(from: T = this.current): T {
    if (!this.canRedo())
      return from
    this.index++
    const to = this.diffpatcher.patch(from, this.deltas[this.index])

    if (typeof this.listen === "function")
      this.listen(this.deltas.slice(0, this.index + 1), from, to)

    this.current = to
    return to
  }
}