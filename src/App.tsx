import { For, Show, type Component } from "solid-js";

const spriteList = [
  "boss",
  "burnt-peanut",
  "drifter",
  "earth",
  "fire",
  "fishy",
  "ghost",
  "king",
  "punk",
  "seven",
  "sleepy",
  "soccer",
  "water",
  "zero-point",
];

const App: Component = () => {
  return (
    <div class="grid grid-cols-4 gap-4 p-4">
      <For each={spriteList}>{(name) => <Sprite name={name} />}</For>
    </div>
  );
};

const VariantCheckbox: Component<{ name: string; variant: string }> = (
  props,
) => {
  return (
    <div class="flex items-center gap-2">
      <input type="checkbox" id={`${props.name}-${props.variant}`} />
      <label for={`${props.name}-${props.variant}`}>{props.variant}</label>
    </div>
  );
};

const Sprite: Component<{ name: string }> = (props) => {
  const variants = ["base", "candy", "gold", "galaxy"];

  return (
    <div class="flex flex-col items-center gap-2 rounded-lg border border-gray-300 p-4 shadow-md">
      <h1 class="text-2xl capitalize">
        <NormalizeName name={props.name} />
      </h1>

      <img
        src={`/images/sprites/${props.name}/base.webp`}
        alt={props.name}
        height="100"
        width="100"
      />

      <div class="flex flex-col">
        <VariantCheckbox name={props.name} variant="base" />

        <Show when={props.name !== "burnt-peanut"}>
          <For each={variants.filter((variant) => variant !== "base")}>
            {(variant) => (
              <VariantCheckbox name={props.name} variant={variant} />
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

const NormalizeName: Component<{ name: string }> = (props) => {
  const normalizedName = props.name.replace(/-/g, " ");
  return <span>{normalizedName}</span>;
};

export default App;
