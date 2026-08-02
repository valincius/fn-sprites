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

type SpriteProgress = {
  collected: number;
  total: number;
  complete: boolean;
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

const visibleSprites = sprites.filter((sprite) =>
  spriteVariants.includes(sprite.variant),
);

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
    const progress: Record<string, SpriteProgress> = {};

    for (const name of spriteNames) {
      const variantsForSprite = sprites.filter(
        (sprite) =>
          sprite.parent === name && spriteVariants.includes(sprite.variant),
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

  const collectedVisibleCount = createMemo(
    () =>
      visibleSprites.filter((sprite) => collectedIds().has(sprite.spriteId))
        .length,
  );

  return (
    <div class="w-full max-w-full p-2 sm:p-4">
      <div
        class="sprite-grid grid min-w-0 gap-3"
        style={{ "--variant-count": spriteVariants.length }}
      >
          <HeaderCell
            label="Sprite"
            count={collectedVisibleCount()}
            totalCount={visibleSprites.length}
          />

          <For each={spriteVariants}>
            {(variant) => {
              const variantSprites = visibleSprites.filter(
                (sprite) => sprite.variant === variant,
              );

              return (
                <HeaderCell
                  class="hidden md:flex"
                  label={normalizeVariantName(variant)}
                  count={
                    variantSprites.filter((sprite) =>
                      collectedIds().has(sprite.spriteId),
                    ).length
                  }
                  totalCount={variantSprites.length}
                />
              );
            }}
          </For>

          <For each={spriteNames}>
            {(name) => (
              <SpriteRow
                name={name}
                progress={spriteProgress()[name]}
                collectedIds={collectedIds()}
                onToggle={toggleCollected}
              />
            )}
          </For>
      </div>
    </div>
  );
};

const SpriteRow: Component<{
  name: string;
  progress: SpriteProgress;
  collectedIds: ReadonlySet<string>;
  onToggle: (spriteId: string) => void;
}> = (props) => {
  const rowComplete = () => props.progress.complete;

  return (
    <div class="grid min-w-0 grid-cols-4 gap-2 rounded-lg bg-white/35 p-2 md:contents md:p-0">
      <div
        data-testid={`sprite-row-label-${props.name}`}
        class={`col-span-4 flex min-w-0 flex-col items-center justify-center rounded-md px-2 py-2 text-center capitalize transition-colors md:col-auto md:px-4 ${
          rowComplete()
            ? "bg-slate-200/80 text-slate-500 ring-1 ring-slate-300"
            : rarityColors[getSpriteRarity(props.name)] || "bg-white"
        }`}
      >
        <span class="text-lg">{normalizeName(props.name)}</span>
        <span
          class={`text-xs font-semibold ${
            rowComplete() ? "text-slate-500" : "text-slate-700"
          }`}
        >
          {props.progress.collected}/{props.progress.total}
        </span>
      </div>

      <For each={spriteVariants}>
        {(variant) => {
          const sprite = getSprite(props.name, variant);

          return (
            <div
              data-testid={`sprite-row-cell-${props.name}-${variant}`}
              class={`min-w-0 rounded-md p-1 align-middle transition-colors sm:p-2 ${
                !sprite
                  ? "bg-transparent"
                  : rowComplete()
                    ? "bg-slate-100/80"
                    : variantColors[variant] || "bg-white"
              }`}
            >
              <VariantCell
                name={props.name}
                variant={variant}
                isCollected={props.collectedIds.has(sprite?.spriteId ?? "")}
                rowComplete={rowComplete()}
                onToggle={props.onToggle}
              />
            </div>
          );
        }}
      </For>
    </div>
  );
};

const HeaderCell: Component<{
  label: string;
  count: number;
  totalCount: number;
  class?: string;
}> = (props) => {
  return (
    <div
      data-testid={`header-${props.label.toLowerCase()}`}
      class={`flex min-w-0 flex-col rounded-md bg-purple-300/80 px-2 py-2 text-center font-medium ${props.class ?? ""}`}
    >
      <span class="text-lg">{props.label}</span>
      <span class="text-xs text-purple-950/70">
        {props.count}/{props.totalCount}
      </span>
    </div>
  );
};

const VariantCell: Component<{
  name: string;
  variant: string;
  isCollected: boolean;
  rowComplete: boolean;
  onToggle: (spriteId: string) => void;
}> = (props) => {
  const sprite = getSprite(props.name, props.variant);

  if (!sprite) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={`${props.name} ${props.variant}`}
      aria-pressed={props.isCollected}
      onClick={() => props.onToggle(sprite.spriteId)}
      class={`relative flex min-w-0 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-md border p-1 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 sm:gap-2 sm:p-2 ${
        props.isCollected
          ? props.rowComplete
            ? "border-slate-300 bg-slate-200/70 shadow-none"
            : "border-emerald-500 bg-emerald-950/80 shadow-inner shadow-emerald-900/50"
          : "border-transparent bg-white/20"
      }`}
    >
      <img
        src={sprite.url}
        alt={`${props.name} ${props.variant}`}
        height="60"
        width="60"
        class={`h-auto max-w-full rounded transition-all duration-150 ${
          props.isCollected ? "scale-90 opacity-25 grayscale" : "opacity-100"
        }`}
      />

      <span class="w-full truncate text-[10px] font-medium md:hidden">
        {normalizeVariantName(props.variant)}
      </span>

      <Show when={props.isCollected}>
        <span
          class={`pointer-events-none absolute inset-0 flex items-center justify-center text-4xl font-black drop-shadow-sm ${
            props.rowComplete ? "text-slate-400" : "text-emerald-300"
          }`}
        >
          X
        </span>
      </Show>
    </button>
  );
};

export default App;
