# DiffPatch
Uses the jsondiffpatch library

## Usage

### import
```typescript
import { DiffPatch } from "oj-diff-patch"
```

### Initialize
```typescript
const dp = new DiffPatch()
```

### Add change
```typescript
let state = dp.add({ packages: [{ name: "oj-diff-patch", version: "1.0.0" }] })
```

```typescript
state = dp.add({ packages: [{ name: "oj-diff-patch", version: "1.0.1" }, { name: "oj-store", version: "1.0.0" }] })
```

### Undo / Redo
```typescript
undoBtn.classList.toggle("disabled", !dp.canUndo())
redoBtn.classList.toggle("disabled", !dp.canRedo())
```
```typescript
state = dp.undo()
// state is { packages: [{ name: "oj-diff-patch", version: "1.0.0" }] }
```
```typescript
state = dp.redo()
// state is { packages: [{ name: "oj-diff-patch", version: "1.0.1" }, { name: "oj-store", version: "1.0.0" }] }
```

### Reset
Removes all recoded patches, undo/redo wont be possible anymore until a new change is added.
It won't change the current state.

```typescript
dp.reset()
```

### Listen
Listen to changes, get the deltas, from and to states.

```typescript
state = dp.listen = (deltas, from, to) => {
  storage.set("deltas", deltas)
}
```

### Load
Apply delta array. 
This will override the current state.

```typescript
state = dp.load(storage.get("deltas")) // [{"packages":[{"name":"oj-diff-patch","version":"1.0.0"}]},{"packages":{"0":{"version":["1.0.0","1.0.1"]},"1":[{"name":"oj-store","version":"1.0.0"}],"_t":"a"}}]
// state is { packages: [{ name: "oj-diff-patch", version: "1.0.1" }, { name: "oj-store", version: "1.0.0" }] }
```