"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsondiffpatch_1 = require("jsondiffpatch");
var DiffPatch = /** @class */ (function () {
    function DiffPatch(options) {
        if (options === void 0) { options = {}; }
        this.deltas = [];
        this.index = 0;
        this.diffpatcher = new jsondiffpatch_1.DiffPatcher(Object.assign({}, options));
    }
    DiffPatch.prototype.reset = function () {
        this.deltas.splice(1);
        this.index = 0;
        if (typeof this.listen === "function")
            this.listen(this.deltas);
    };
    DiffPatch.prototype.load = function (deltas) {
        var _a;
        if (deltas.length < 2)
            return;
        (_a = this.deltas).splice.apply(_a, __spreadArrays([0, deltas.length], deltas));
        this.current = deltas[0];
        for (var i = 1; i < deltas.length; i++)
            this.current = this.diffpatcher.patch(this.current, deltas[i]);
        return this.current;
    };
    DiffPatch.prototype.add = function (to, from) {
        if (from === void 0) { from = this.current; }
        var l = this.deltas.length;
        if (this.index < l - 1)
            this.deltas.splice(this.index + 1);
        var d = this.diffpatcher.diff(from, to);
        d = Array.isArray(d) ? d[0] : d;
        if (d === undefined) {
            this.current = from;
            return from;
        }
        this.index = this.deltas.push(d) - 1;
        if (typeof this.listen === "function")
            this.listen(this.deltas.slice(0, this.index + 1), from, to);
        this.current = to;
        return to;
    };
    DiffPatch.prototype.canUndo = function () {
        return this.index > 0;
    };
    DiffPatch.prototype.canRedo = function () {
        return this.index < this.deltas.length - 1;
    };
    DiffPatch.prototype.undo = function (from) {
        if (from === void 0) { from = this.current; }
        if (!this.canUndo())
            return from;
        var to = this.diffpatcher.unpatch(from, this.deltas[this.index]);
        this.index--;
        if (typeof this.listen === "function")
            this.listen(this.deltas.slice(0, this.index + 1), from, to);
        this.current = to;
        return to;
    };
    DiffPatch.prototype.redo = function (from) {
        if (from === void 0) { from = this.current; }
        if (!this.canRedo())
            return from;
        this.index++;
        var to = this.diffpatcher.patch(from, this.deltas[this.index]);
        if (typeof this.listen === "function")
            this.listen(this.deltas.slice(0, this.index + 1), from, to);
        this.current = to;
        return to;
    };
    return DiffPatch;
}());
exports.DiffPatch = DiffPatch;
