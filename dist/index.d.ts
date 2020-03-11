import { Delta as JDDelta, Config } from "jsondiffpatch";
export declare type Delta = JDDelta;
export declare class DiffPatch<T> {
    private diffpatcher;
    private readonly deltas;
    private index;
    private current;
    constructor(options?: Config);
    onAdd: (deltas: Delta[], delta: Delta, from: T, to: T) => void;
    onUndo: (deltas: Delta[], delta: Delta, from: T) => void;
    onRedo: (deltas: Delta[], delta: Delta, from: T) => void;
    onReset: (deltas: Delta[]) => void;
    onLoad: (deltas: Delta[], to: T) => void;
    reset(): void;
    load(deltas: Delta[]): T;
    add(to: T, from?: T): T;
    canUndo(): boolean;
    canRedo(): boolean;
    undo(from?: T): T;
    redo(from?: T): T;
}
