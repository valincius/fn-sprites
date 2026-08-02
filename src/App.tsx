import { For, Show, type Component } from "solid-js";

const spriteList = [
  "air",
  "batman",
  "boss",
  "burnt-peanut",
  "drifter",
  "duck",
  "earth",
  "fire",
  "fishy",
  "ghost",
  "grim",
  "king",
  "punk",
  "seven",
  "sleepy",
  "soccer",
  "vini-jr",
  "water",
  "zero-point",
];

const variants = ["base", "candy", "gold", "galaxy", "holo"];

const App: Component = () => {
  return (
    <div class="p-4">
      <div class="overflow-x-auto rounded-lg border border-gray-300 shadow-md">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left text-lg">
                Sprite
              </th>

              <For each={variants}>
                {(variant) => (
                  <th class="border border-gray-300 px-4 py-1 text-left capitalize">
                    {normalizeVariantName(variant)}
                  </th>
                )}
              </For>
            </tr>
          </thead>

          <tbody>
            <For each={spriteList}>
              {(name) => (
                <tr class="odd:bg-white even:bg-gray-50">
                  <td class="border border-gray-300 px-4 py-1 text-lg capitalize">
                    <div class="flex items-center gap-3">
                      <img
                        src={`/images/sprites/${name}/base.webp`}
                        alt={`${name} base`}
                        height="36"
                        width="36"
                        class="rounded"
                      />
                      <span>{normalizeName(name)}</span>
                    </div>
                  </td>

                  <For each={variants}>
                    {(variant) => (
                      <td class="border border-gray-300 px-4 py-3 align-middle">
                        <VariantCell name={name} variant={variant} />
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const VariantCheckbox: Component<{ name: string; variant: string }> = (
  props,
) => {
  return (
    <div class="flex items-center gap-2">
      <input type="checkbox" id={`${props.name}-${props.variant}`} />
      <label for={`${props.name}-${props.variant}`} class="text-sm capitalize">
        {normalizeVariantName(props.variant)}
      </label>
    </div>
  );
};

const VariantCell: Component<{ name: string; variant: string }> = (props) => {
  const isUnavailable =
    ["burnt-peanut", "vini-jr"].includes(props.name) &&
    props.variant !== "base";

  return (
    <Show
      when={!isUnavailable}
      fallback={<span class="text-sm text-gray-500">-</span>}
    >
      <div>
        <VariantCheckbox name={props.name} variant={props.variant} />
      </div>
    </Show>
  );
};

const normalizeVariantName = (variant: string) => {
  if (variant === "candy") {
    return "Gummy";
  }

  return variant.replace(/-/g, " ");
};

const normalizeName = (name: string) => {
  return name.replace(/-/g, " ");
};

export default App;
