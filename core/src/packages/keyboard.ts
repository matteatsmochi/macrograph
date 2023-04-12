import { core } from "../models";

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

type Alphabet = (typeof alphabet)[number];

const pkg = core.createPackage<`${Lowercase<Alphabet>}-key`>({
  name: "Keyboard Inputs",
});

function toLowercase<T extends string>(c: T): Lowercase<T> {
  return c.toLowerCase() as any;
}

alphabet.forEach((a) => {
  pkg.createSchema({
    name: `${a} Key`,
    variant: "Event",
    event: `${toLowercase(a)}-key`,
    generateIO: (t) => {
      t.execOutput({
        id: "pressed",
        name: "Pressed",
      });
      t.execOutput({
        id: "released",
        name: "Released",
      });
    },
    run({ ctx, data }) {
      ctx.exec(data.state === "pressed" ? "pressed" : "released");
    },
  });
});

alphabet.forEach((a) => {
  pkg.createSchema({
    name: `${a} Key Pressed`,
    variant: "Pure",
    generateIO: (t) => {
      t.dataOutput({
        id: "value",
        name: "",
        type: {
          variant: "primitive",
          value: "bool",
        },
      });
    },
    run({ ctx }) {
      ctx.setOutput("value", pressedKeys.has(a.toLowerCase() as any));
    },
  });
});

const pressedKeys = new Set<Lowercase<Alphabet>>();

window.addEventListener("keydown", (e) => {
  if (e.key < "a" || e.key > "z") return;

  const key: Lowercase<Alphabet> = e.key as any;

  pressedKeys.add(key);

  pkg.emitEvent({ name: `${key}-key`, data: { state: "pressed" } });
});

window.addEventListener("keyup", (e) => {
  if (e.key < "a" || e.key > "z") return;

  const key: Lowercase<Alphabet> = e.key as any;

  pressedKeys.delete(key);

  pkg.emitEvent({ name: `${key}-key`, data: { state: "released" } });
});