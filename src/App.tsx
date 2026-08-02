import { For, Show, type Component } from "solid-js";
import spriteData from "./sprites.json";

type SpriteRecord = {
  spriteId: string;
  parent: string;
  rarity: string;
  variant: string;
  url: string;
};

const sprites = spriteData as SpriteRecord[];

const variantOrder = [
  "base",
  "candy",
  "gold",
  "galaxy",
  "holofoil",
  "cube",
  "quack",
];

const rarityOrder = ["rare", "epic", "legendary", "mythic", "special"];

const rarityColors: Record<string, string> = {
  mythic: "bg-amber-200/80",
  legendary: "bg-violet-200/80",
  epic: "bg-fuchsia-200/80",
  rare: "bg-sky-200/80",
  special: "bg-zinc-200/80",
};

const variantColors: Record<string, string> = {
  base: "bg-gray-200/80",
  candy: "bg-pink-200/80",
  gold: "bg-yellow-200/80",
  galaxy: "bg-indigo-200/80",
  holofoil: "bg-cyan-200/80",
  cube: "bg-lime-200/80",
  quack: "bg-orange-200/80",
};

const getSpriteRarity = (name: string) => {
  const sprite = sprites.find((sprite) => sprite.parent === name);
  return sprite ? sprite.rarity : "unknown";
};

const spriteNames = [...new Set(sprites.map((sprite) => sprite.parent))].sort(
  (a, b) => {
    return (
      rarityOrder.indexOf(getSpriteRarity(a)) -
        rarityOrder.indexOf(getSpriteRarity(b)) || a.localeCompare(b)
    );
  },
);
const spriteVariants = [
  ...new Set(
    sprites
      .filter((sprite) => variantOrder.includes(sprite.variant))
      .map((sprite) => sprite.variant),
  ),
].sort((a, b) => {
  const indexA = variantOrder.indexOf(a);
  const indexB = variantOrder.indexOf(b);

  return (
    (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) -
    (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB)
  );
});

const App: Component = () => {
  return (
    <div class="p-4">
      <div class="overflow-x-auto shadow-md">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-100 *:text-center">
              <th class="px-4 py-2 text-left text-lg bg-purple-300/80">
                Sprite
              </th>

              <For each={spriteVariants}>
                {(variant) => (
                  <th class={`capitalize bg-purple-300/80`}>
                    {normalizeVariantName(variant)}
                  </th>
                )}
              </For>
            </tr>
          </thead>

          <tbody>
            <For each={spriteNames}>
              {(name) => (
                <tr>
                  <td
                    class={`text-center text-lg capitalize ${rarityColors[getSpriteRarity(name)] || rarityColors.unknown}`}
                  >
                    <span>{normalizeName(name)}</span>
                  </td>

                  <For each={spriteVariants}>
                    {(variant) => (
                      <td
                        class={`px-4 py-2 align-middle ${variantColors[variant] || ""}`}
                      >
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

const getSprite = (name: string, variant: string) => {
  return sprites.find(
    (sprite) => sprite.parent === name && sprite.variant === variant,
  );
};

const VariantCell: Component<{ name: string; variant: string }> = (props) => {
  const sprite = getSprite(props.name, props.variant);

  return (
    <Show when={sprite} fallback={<span class="text-sm text-gray-500">-</span>}>
      <div class={`flex flex-col items-center gap-2 rounded-md p-2`}>
        <img
          src={sprite!.url}
          alt={`${props.name} ${props.variant}`}
          height="48"
          width="48"
          class="rounded"
        />
      </div>
    </Show>
  );
};

const normalizeVariantName = (variant: string) => {
  const normalized = variant.toLowerCase();

  const variantMap: Record<string, string> = {
    candy: "Gummy",
  };

  return variantMap[normalized] || normalized;
};

const normalizeName = (name: string) => {
  const nameMap: Record<string, string> = {
    CokeParmesan: "Vini Jr",
    CompanyStargazer: "Pollo",
    PedicureAntacid: "Ironmouse",
    FillerGrunt: "John Wick",
    Spitfire: "Fire",
  };

  if (nameMap[name]) {
    return nameMap[name];
  }

  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default App;
