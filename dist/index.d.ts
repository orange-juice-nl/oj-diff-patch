import { Delta as JDDelta, Config } from "jsondiffpatch";
export declare type Delta = JDDelta;
export declare class DiffPatch<T> {
    private readonly diffpatcher;
    private readonly deltas;
    private index;
    private current;
    constructor(options?: Config);
    listen: (deltas: Delta[], from?: T, to?: T) => void;
    reset(): void;
    load(deltas: Delta[]): T;
    add(to: T, from?: T): T;
    canUndo(): boolean;
    canRedo(): boolean;
    undo(from?: T): T;
    redo(from?: T): T;
}
