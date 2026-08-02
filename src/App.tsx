import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  type Component,
} from "solid-js";
import spriteData from "./sprites.json";

type SpriteRecord = {
  spriteId: string;
  parent: string;
  rarity: string;
  variant: string;
  url: string;
};

const STORAGE_KEY = "fn-sprites-collected";

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

const nameMap: Record<string, string> = {
  CokeParmesan: "Vini Jr",
  CompanyStargazer: "Pollo",
  PedicureAntacid: "Ironmouse",
  FillerGrunt: "John Wick",
  Spitfire: "Fire",
  Sleepy: "Dream",
};

const variantMap: Record<string, string> = {
  candy: "Gummy",
};

const getStoredCollected = () => {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [] as string[];
  }
};

const getSpriteRarity = (name: string) => {
  const firstMatch = sprites.find((sprite) => sprite.parent === name);
  return firstMatch?.rarity ?? "unknown";
};

const getSprite = (name: string, variant: string) => {
  return sprites.find(
    (sprite) => sprite.parent === name && sprite.variant === variant,
  );
};

const spriteNames = [...new Set(sprites.map((sprite) => sprite.parent))].sort(
  (a, b) => {
    const rarityDifference =
      rarityOrder.indexOf(getSpriteRarity(a)) -
      rarityOrder.indexOf(getSpriteRarity(b));

    return rarityDifference || a.localeCompare(b);
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

const normalizeName = (name: string) => {
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

const normalizeVariantName = (variant: string) => {
  const normalized = variant.toLowerCase();
  return variantMap[normalized] || normalizeName(normalized);
};

const App: Component = () => {
  const [collectedIds, setCollectedIds] = createSignal<Set<string>>(
    new Set(getStoredCollected()),
  );

  createEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...collectedIds()]),
    );
  });

  const toggleCollected = (spriteId: string) => {
    setCollectedIds((current) => {
      const next = new Set(current);

      if (next.has(spriteId)) {
        next.delete(spriteId);
      } else {
        next.add(spriteId);
      }

      return next;
    });
  };

  const spriteProgress = createMemo(() => {
    const progress: Record<
      string,
      { collected: number; total: number; complete: boolean }
    > = {};

    for (const name of spriteNames) {
      const variantsForSprite = sprites.filter(
        (sprite) => sprite.parent === name,
      );
      const collected = variantsForSprite.filter((sprite) =>
        collectedIds().has(sprite.spriteId),
      ).length;

      progress[name] = {
        collected,
        total: variantsForSprite.length,
        complete:
          variantsForSprite.length > 0 &&
          collected === variantsForSprite.length,
      };
    }

    return progress;
  });

  return (
    <div class="p-4">
      <div class="overflow-x-auto">
        <div
          class="grid gap-3"
          style={{
            "grid-template-columns": `minmax(180px, 1.5fr) repeat(${spriteVariants.length}, minmax(120px, 1fr))`,
            "min-width": `${Math.max(180 + spriteVariants.length * 120, 900)}px`,
          }}
        >
          <HeaderCell label="Sprite" />

          <For each={spriteVariants}>
            {(variant) => <HeaderCell label={normalizeVariantName(variant)} />}
          </For>

          <For each={spriteNames}>
            {(name) => {
              const progress = spriteProgress()[name];
              const rowComplete = progress.complete;

              return (
                <>
                  <div
                    class={`flex flex-col items-center justify-center rounded-md px-4 py-2 text-center capitalize transition-colors ${
                      rowComplete
                        ? "bg-emerald-200 ring-2 ring-emerald-400 ring-offset-1"
                        : rarityColors[getSpriteRarity(name)] || "bg-white"
                    }`}
                  >
                    <span class="text-lg">{normalizeName(name)}</span>
                    <span class="text-xs font-semibold text-slate-700">
                      {progress.collected}/{progress.total}
                    </span>
                  </div>

                  <For each={spriteVariants}>
                    {(variant) => (
                      <div
                        class={`rounded-md p-2 align-middle transition-colors ${
                          rowComplete
                            ? "bg-emerald-100/90"
                            : variantColors[variant] || "bg-white"
                        }`}
                      >
                        <VariantCell
                          name={name}
                          variant={variant}
                          isCollected={collectedIds().has(
                            getSprite(name, variant)?.spriteId ?? "",
                          )}
                          onToggle={toggleCollected}
                        />
                      </div>
                    )}
                  </For>
                </>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

const HeaderCell: Component<{ label: string }> = (props) => {
  return (
    <div class="rounded-md bg-purple-300/80 px-2 py-2 text-center text-lg font-medium">
      {props.label}
    </div>
  );
};

const VariantCell: Component<{
  name: string;
  variant: string;
  isCollected: boolean;
  onToggle: (spriteId: string) => void;
}> = (props) => {
  const sprite = getSprite(props.name, props.variant);

  if (!sprite) {
    return <span class="text-sm text-gray-500">-</span>;
  }

  return (
    <button
      type="button"
      aria-pressed={props.isCollected}
      onClick={() => props.onToggle(sprite.spriteId)}
      class={`relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border p-2 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
        props.isCollected
          ? "border-emerald-500 bg-emerald-950/80 shadow-inner shadow-emerald-900/50"
          : "border-transparent bg-white/20"
      }`}
    >
      <img
        src={sprite.url}
        alt={`${props.name} ${props.variant}`}
        height="60"
        width="60"
        class={`rounded transition-all duration-150 ${
          props.isCollected ? "scale-90 opacity-25 grayscale" : "opacity-100"
        }`}
      />

      <Show when={props.isCollected}>
        <span class="pointer-events-none absolute inset-0 flex items-center justify-center text-4xl font-black text-emerald-300 drop-shadow-sm">
          X
        </span>
      </Show>
    </button>
  );
};

export default App;
