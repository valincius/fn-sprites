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
      <div class="overflow-x-auto">
        <div
          class="grid gap-2"
          style={{
            "grid-template-columns": `minmax(180px, 1.5fr) repeat(${spriteVariants.length}, minmax(120px, 1fr))`,
            "min-width": `${Math.max(180 + spriteVariants.length * 120, 900)}px`,
          }}
        >
          <div class="rounded-md bg-purple-300/80 px-4 py-2 text-left text-lg font-medium">
            Sprite
          </div>

          <For each={spriteVariants}>
            {(variant) => (
              <div class="rounded-md bg-purple-300/80 px-2 py-2 text-center capitalize">
                {normalizeVariantName(variant)}
              </div>
            )}
          </For>

          <For each={spriteNames}>
            {(name) => (
              <>
                <div
                  class={`flex items-center justify-center rounded-md px-4 py-2 text-center text-lg capitalize ${rarityColors[getSpriteRarity(name)] || "bg-white"}`}
                >
                  {normalizeName(name)}
                </div>

                <For each={spriteVariants}>
                  {(variant) => (
                    <div
                      class={`rounded-md p-2 align-middle ${variantColors[variant] || "bg-white"}`}
                    >
                      <VariantCell name={name} variant={variant} />
                    </div>
                  )}
                </For>
              </>
            )}
          </For>
        </div>
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
          height="60"
          width="60"
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
