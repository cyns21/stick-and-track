"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Home,
  Users,
  Settings,
  ScanLine,
  Share2,
  Bell,
  BatteryFull,
  Volume2,
  VolumeX,
  Lock,
  Globe,
  Pencil,
  Trash2,
  LocateFixed,
  Info,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

/**
 * Stick & Track — Demo Prototype
 * Self-contained (Tailwind + lucide-react only)
 *
 * ✅ Works as a Next.js App Router page (app/page.tsx)
 * ✅ Deploys cleanly to Vercel
 * ✅ Future NFC deep-link ready: /?setup=1&code=STICK-1234
 *
 * MAP IMAGE:
 * Put your UC Davis map image in: /public/ucd-map.jpg
 * (file name can be changed below via MAP_IMAGE_SRC)
 */

const MAP_IMAGE_SRC = "/ucdmap.jpeg";

const demoFriends = [
  { id: "f1", name: "Alex", handle: "@alex" },
  { id: "f2", name: "John", handle: "@john" },
  { id: "f3", name: "Maya", handle: "@maya" },
  { id: "f4", name: "Sam", handle: "@sam" },
];

const campusPlaces = [
  { id: "p1", name: "Memorial Union", tag: "MU" },
  { id: "p2", name: "Shields Library", tag: "Shields" },
  { id: "p3", name: "Teaching & Learning Complex", tag: "TLC" },
  { id: "p4", name: "East Quad", tag: "Quad" },
];

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl transition select-none";
  const variants = {
    primary:
      "bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-600 disabled:text-neutral-200",
    secondary:
      "bg-neutral-900 text-neutral-100 hover:bg-neutral-800 border border-neutral-800 disabled:opacity-60",
    ghost:
      "bg-transparent text-neutral-200 hover:bg-neutral-900 border border-neutral-900",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cx(
        "w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100 placeholder:text-neutral-600 outline-none focus:ring-2 focus:ring-white/20",
        className
      )}
    />
  );
}

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-xl px-2.5 py-1 text-xs",
        className
      )}
    >
      {children}
    </span>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-neutral-900 bg-neutral-950/70",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cx("p-4 pb-2", className)}>{children}</div>;
}

function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cx("p-4", className)}>{children}</div>;
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "w-12 h-7 rounded-full border border-neutral-800 p-1 transition",
        checked ? "bg-white" : "bg-neutral-900"
      )}
      aria-label="switch"
    >
      <div
        className={cx(
          "h-5 w-5 rounded-full transition",
          checked ? "bg-black translate-x-5" : "bg-neutral-300 translate-x-0"
        )}
      />
    </button>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
      <div
        className="h-full bg-white"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-50 flex items-center justify-center p-6">
      <div className="w-[390px] max-w-full">
        <div className="rounded-[2.2rem] border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden">
          <div className="h-10 flex items-center justify-between px-5 border-b border-neutral-900">
            <div className="text-xs text-neutral-400">Stick & Track</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <div className="text-xs text-neutral-500">Connected</div>
            </div>
          </div>
          <div className="bg-neutral-950">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Pill({
  icon: Icon,
  label,
  right,
}: {
  icon: any;
  label: string;
  right: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-900 bg-neutral-950/60 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-2xl bg-neutral-900 flex items-center justify-center">
          <Icon className="h-4 w-4 text-neutral-200" />
        </div>
        <div className="text-sm text-neutral-200">{label}</div>
      </div>
      <div className="text-xs text-neutral-500">{right}</div>
    </div>
  );
}

type TabKey = "home" | "map" | "friends" | "settings";

function BottomNav({
  tab,
  setTab,
}: {
  tab: TabKey;
  setTab: React.Dispatch<React.SetStateAction<TabKey>>;
}) {
  const Item = ({
    id,
    Icon,
    label,
  }: {
    id: TabKey;
    Icon: any;
    label: string;
  }) => (
    <button
      onClick={() => setTab(id)}
      className={cx(
        "flex flex-col items-center gap-1 py-2 px-2 rounded-2xl transition",
        tab === id ? "text-neutral-50" : "text-neutral-500 hover:text-neutral-300"
      )}
    >
      <Icon className={cx("h-5 w-5", tab === id ? "" : "opacity-90")} />
      <span className="text-[11px]">{label}</span>
    </button>
  );

  return (
    <div className="sticky bottom-0 bg-neutral-950/90 backdrop-blur border-t border-neutral-900">
      <div className="grid grid-cols-4 gap-2 px-4 py-2">
        <Item id="home" Icon={Home} label="Home" />
        <Item id="map" Icon={MapPin} label="Map" />
        <Item id="friends" Icon={Users} label="Share" />
        <Item id="settings" Icon={Settings} label="Settings" />
      </div>
    </div>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-[420px] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-neutral-50">{title}</div>
            </div>
            <button
              className="h-9 w-9 rounded-2xl bg-neutral-900 hover:bg-neutral-800 transition"
              onClick={onClose}
              aria-label="close"
            />
          </div>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 right-0 bottom-0">
        <div className="rounded-t-3xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-lg font-semibold text-neutral-50 truncate">
                {title}
              </div>
              {subtitle && (
                <div className="text-sm text-neutral-500 mt-1 truncate">
                  {subtitle}
                </div>
              )}
            </div>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

type StatusKey =
  | "nearby"
  | "out_of_range"
  | "shared"
  | "shared_with_me";

type Item = {
  id: string;
  name: string;
  model: "Slim" | "Pro";
  status: StatusKey;
  lastSeen: string;
  place: string;
  battery: number;
  isPublic: boolean;
  followers: string[];
  owner?: string; // for shared_with_me
};

function statusMeta(status: StatusKey) {
  if (status === "nearby")
    return { label: "Nearby", badge: "bg-emerald-500/15 text-emerald-300" };
  if (status === "out_of_range")
    return { label: "Out of range", badge: "bg-amber-500/15 text-amber-300" };
  if (status === "shared")
    return { label: "Shared", badge: "bg-sky-500/15 text-sky-300" };
  return {
    label: "Shared with me",
    badge: "bg-indigo-500/15 text-indigo-300",
  };
}

function ItemCard({
  item,
  onOpen,
  onPing,
  onPlaySound,
  onShare,
  onTogglePrivacy,
}: {
  item: Item;
  onOpen: () => void;
  onPing: () => void;
  onPlaySound: () => void;
  onShare: () => void;
  onTogglePrivacy: () => void;
}) {
  const meta = statusMeta(item.status);
  const isPro = item.model === "Pro";
  const isSharedWithMe = item.status === "shared_with_me";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-base text-neutral-50 font-medium truncate">
                {item.name}
              </div>
              <Badge className={cx("rounded-xl", meta.badge)}>{meta.label}</Badge>
              {isSharedWithMe && item.owner && (
                <Badge className="rounded-xl bg-neutral-900 text-neutral-200">
                  Owner: {item.owner}
                </Badge>
              )}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Last seen: <span className="text-neutral-300">{item.lastSeen}</span>
              <span className="text-neutral-600"> · </span>
              <span className="text-neutral-300">{item.place}</span>
            </div>
          </div>

          <button
            onClick={onOpen}
            className="h-10 w-10 rounded-2xl bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 transition"
            aria-label="Open"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>

        {/* Larger tap targets + bigger icons (esp Share/Public/Private) */}
        <div
          className={cx(
            "mt-4 grid gap-2",
            isPro ? "grid-cols-2" : "grid-cols-3"
          )}
        >
          <Button variant="secondary" onClick={onPing}>
            <Bell className="h-4 w-4" /> Ping
          </Button>

          {isPro && (
            <Button variant="secondary" onClick={onPlaySound}>
              <Volume2 className="h-5 w-5" /> Play sound
            </Button>
          )}

          <Button variant="secondary" onClick={onShare}>
            <Share2 className="h-5 w-5" /> Share
          </Button>

          <Button
            variant="secondary"
            onClick={onTogglePrivacy}
            disabled={isSharedWithMe}
          >
            {item.isPublic ? (
              <Globe className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
            {item.isPublic ? "Public" : "Private"}
          </Button>
        </div>

        {isSharedWithMe && (
          <div className="mt-3 text-xs text-neutral-600">
            Privacy is controlled by the owner.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MapMock({
  selectedId,
  setSelectedId,
  items,
  onOpenSelected,
}: {
  selectedId: string;
  setSelectedId: (id: string) => void;
  items: Item[];
  onOpenSelected: () => void;
}) {
  // Hand-tuned pin positions for your UC Davis screenshot
  // (percent based within the map container)
  const placeToXY: Record<string, { x: number; y: number }> = {
    "Memorial Union": { x: 58, y: 33 },
    "Shields Library": { x: 72, y: 63 },
    "Teaching & Learning Complex": { x: 22, y: 74 },
    "East Quad": { x: 60, y: 52 },
    Nearby: { x: 48, y: 45 },
  };

  const pins = useMemo(() => {
    return items.map((it) => {
      const xy = placeToXY[it.place] || placeToXY["Nearby"];
      return { id: it.id, x: xy.x, y: xy.y, status: it.status };
    });
  }, [items]);

  const selected = items.find((x) => x.id === selectedId) || items[0];

  const pinColor = (status: StatusKey) => {
    if (status === "nearby") return "bg-emerald-500";
    if (status === "out_of_range") return "bg-amber-500";
    if (status === "shared") return "bg-sky-500";
    return "bg-indigo-500";
  };

  return (
    <div className="rounded-3xl overflow-hidden border border-neutral-900 bg-neutral-950">
      <div className="p-4 border-b border-neutral-900 flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-100">Campus Map</div>
          <div className="text-xs text-neutral-500">
            Tap pins to view last seen
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-2xl"
          onClick={() => setSelectedId(selected?.id)}
        >
          <LocateFixed className="h-4 w-4" />
          Locate
        </Button>
      </div>

      <div className="relative h-[290px]">
        {/* Map image background */}
        <img
          src={MAP_IMAGE_SRC}
          alt="Map"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark overlay to match the sleek vibe */}
        <div className="absolute inset-0 bg-neutral-950/30" />

        {/* Pins */}
        {pins.map((p) => {
          const isSel = p.id === selectedId;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={cx(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition",
                isSel ? "scale-110" : "scale-100"
              )}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-label="pin"
            >
              <div
                className={cx(
                  "h-4 w-4 rounded-full",
                  pinColor(p.status),
                  isSel ? "ring-4 ring-white/30" : "ring-2 ring-white/15"
                )}
              />
              <div className="h-4 w-4 rounded-full -mt-2 opacity-20 bg-white/10" />
            </button>
          );
        })}

        {/* Floating info bubble for selected pin (Option B) */}
        {selected && (
          <div
            className="absolute -translate-x-1/2 -translate-y-[115%]"
            style={{
              left: `${(placeToXY[selected.place] || placeToXY["Nearby"]).x}%`,
              top: `${(placeToXY[selected.place] || placeToXY["Nearby"]).y}%`,
            }}
          >
            <div className="max-w-[250px] rounded-2xl border border-neutral-800 bg-neutral-950/90 backdrop-blur px-3 py-2 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-neutral-50 truncate">
                    {selected.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate">
                    {selected.place} · {selected.lastSeen}
                    {selected.status === "shared_with_me" && selected.owner
                      ? ` · Owner: ${selected.owner}`
                      : ""}
                  </div>
                </div>
                <button
                  onClick={onOpenSelected}
                  className="h-7 w-7 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition flex items-center justify-center"
                  aria-label="details"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mx-auto h-0 w-0 border-x-[8px] border-x-transparent border-t-[10px] border-t-neutral-950/90" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Nearby
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Out of range
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-500" /> Shared
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" /> Shared with me
          </span>
        </div>
      </div>
    </div>
  );
}

function SetupFlow({
  onFinish,
  onCancel,
  initialCode,
}: {
  onFinish: (x: any) => void;
  onCancel: () => void;
  initialCode: string;
}) {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState(initialCode || "STICK-4FNN");
  const [name, setName] = useState("Wallet");
  const [model, setModel] = useState<"Slim" | "Pro">("Slim");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    setCode(initialCode || "STICK-4FNN");
  }, [initialCode]);

  const steps = [
    {
      title: "Verify your new tracker",
      desc: "Tap the sticker to verify and pair.",
      content: (
        <div className="space-y-3">
          <Pill icon={ScanLine} label="Tap sticker" right="Hold phone near sticker" />
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4 space-y-2">
            <div className="text-xs text-neutral-500">Setup code</div>
            <Input value={code} onChange={setCode} />
            <div className="text-xs text-neutral-600">(Demo: any code works)</div>
          </div>
        </div>
      ),
    },
    {
      title: "Name your item",
      desc: "Choose a label so it’s easy to spot.",
      content: (
        <div className="space-y-3">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4 space-y-2">
            <div className="text-xs text-neutral-500">Item name</div>
            <Input value={name} onChange={setName} placeholder="Keys, Bike, Bottle…" />
          </div>

          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4 space-y-2">
            <div className="text-xs text-neutral-500">Model</div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={model === "Slim" ? "primary" : "secondary"}
                onClick={() => setModel("Slim")}
              >
                Slim
              </Button>
              <Button
                variant={model === "Pro" ? "primary" : "secondary"}
                onClick={() => setModel("Pro")}
              >
                Pro
              </Button>
            </div>
            <div className="text-xs text-neutral-500">
              {model === "Slim"
                ? "Ideal for wallets, water bottles, books"
                : "Best for keys, backpacks, laptops"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Privacy + sharing",
      desc: "Make items private or share with followers.",
      content: (
        <div className="space-y-3">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-sm text-neutral-200">Public (followers)</div>
              <div className="text-xs text-neutral-500 truncate">
                Friends can view location to help you find it
              </div>
            </div>
            <Switch checked={isPublic} onChange={setIsPublic} />
          </div>

          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4">
            <div className="text-xs text-neutral-500">Example followers</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {demoFriends.slice(0, 3).map((f) => (
                <Badge
                  key={f.id}
                  className="rounded-2xl bg-neutral-900 text-neutral-200"
                >
                  {f.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const pct = Math.round(((step + 1) / steps.length) * 100);

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-xs text-neutral-500">Setup</div>
          <div className="text-xl font-semibold text-neutral-50">
            {steps[step].title}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="text-sm text-neutral-400">{steps[step].desc}</div>

      <Progress value={pct} />

      <Card>
        <CardContent className="p-4">{steps[step].content}</CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
        ) : (
          <Button onClick={() => onFinish({ code, name, model, isPublic })}>
            Finish setup
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const [stage, setStage] = useState<"marketing" | "setup" | "app">(
    "marketing"
  );
  const [tab, setTab] = useState<TabKey>("home");

  const [selectedItemId, setSelectedItemId] = useState("i2");

  const [items, setItems] = useState<Item[]>([
    {
      id: "i1",
      name: "Wallet",
      model: "Slim",
      status: "out_of_range",
      lastSeen: "7 min ago",
      place: "Shields Library",
      battery: 82,
      isPublic: false,
      followers: ["f1"],
    },
    {
      id: "i2",
      name: "Bike",
      model: "Pro",
      status: "shared",
      lastSeen: "2 min ago",
      place: "Memorial Union",
      battery: 64,
      isPublic: true,
      followers: ["f2", "f3"],
    },
    {
      id: "i3",
      name: "Water Bottle",
      model: "Slim",
      status: "nearby",
      lastSeen: "Just now",
      place: "Teaching & Learning Complex",
      battery: 91,
      isPublic: false,
      followers: [],
    },
    {
      id: "i4",
      name: "Laptop",
      model: "Pro",
      status: "shared_with_me",
      lastSeen: "5 min ago",
      place: "East Quad",
      battery: 73,
      isPublic: false,
      followers: [],
      owner: "Alex",
    },
  ]);

  const selectedItem = useMemo(
    () => items.find((x) => x.id === selectedItemId) ?? items[0],
    [items, selectedItemId]
  );

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [initialSetupCode, setInitialSetupCode] = useState("STICK-4FNN");

  // Settings toggles (for realism)
  const [notifOn, setNotifOn] = useState(true);
  const [locationOn, setLocationOn] = useState(true);

  const showToast = (message: string) => {
    setToast(message);
    // @ts-ignore
    window.clearTimeout(showToast._t);
    // @ts-ignore
    showToast._t = window.setTimeout(() => setToast(null), 1800);
  };

  const updateItem = (id: string, patch: Partial<Item>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? ({ ...it, ...patch } as Item) : it))
    );
  };

  // Deep-link support (future NFC):
  // /?setup=1&code=STICK-1234
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") || "STICK-4FNN";
    const setup = params.get("setup");

    setInitialSetupCode(code);

    if (setup === "1") {
      setStage("setup");
    }
  }, []);

  const goToApp = (defaultTab: TabKey = "home") => {
    setStage("app");
    setTab(defaultTab);
  };

  const addItemFromSetup = ({ name, model, isPublic }: any) => {
    const place = campusPlaces[Math.floor(Math.random() * campusPlaces.length)];
    const id = `i${Math.floor(Math.random() * 9000) + 100}`;
    const newItem: Item = {
      id,
      name: name || "New Item",
      model,
      status: "nearby",
      lastSeen: "Just now",
      place: "Nearby",
      battery: 100,
      isPublic: !!isPublic,
      followers: isPublic ? demoFriends.map((f) => f.id).slice(0, 2) : [],
    };

    // Seed a plausible “last seen” after pairing
    const seededPlace = place.name;
    setItems((p) => [{ ...newItem, place: seededPlace }, ...p]);
    setSelectedItemId(id);
    goToApp("map");
    showToast("Tracker added");

    // Clean URL back to normal after demo deep-link
    const url = new URL(window.location.href);
    url.searchParams.delete("setup");
    url.searchParams.delete("code");
    window.history.replaceState({}, "", url.toString());
  };

  const Header = ({ title }: { title: string }) => (
    <div className="px-5 pt-5 pb-3">
      <div className="text-xl font-semibold text-neutral-50">{title}</div>
      {(stage === "marketing" || (stage === "app" && tab === "home")) && (
        <div className="text-sm text-neutral-500">
          Stick it. Forget it. We’ll track it.
        </div>
      )}
    </div>
  );

  const Marketing = () => (
    <div className="p-5 space-y-4">
      <div className="rounded-3xl border border-neutral-900 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-3 py-1 text-xs text-neutral-200">
          <CheckCircle2 className="h-4 w-4" /> Demo storefront
        </div>
        <div className="mt-4 text-2xl font-semibold text-neutral-50">
          Stick & Track
        </div>
        <div className="mt-1 text-sm text-neutral-400">
          Stick it. Forget it. We’ll track it.
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Card>
            <CardHeader>
              <div className="text-sm text-neutral-100">Slim</div>
              <div className="text-xs text-neutral-500">Ultra-thin, silent</div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <VolumeX className="h-4 w-4" /> No speaker
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <BatteryFull className="h-4 w-4" /> 2+ years battery
              </div>
              <div className="text-xs text-neutral-500">
                Ideal for wallets, water bottles, books
              </div>
              <div className="text-sm text-neutral-50 font-medium">$20</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-sm text-neutral-100">Pro</div>
              <div className="text-xs text-neutral-500">Compact + speaker</div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Volume2 className="h-4 w-4" /> Sound alerts
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <BatteryFull className="h-4 w-4" /> 2+ years battery
              </div>
              <div className="text-xs text-neutral-500">
                Best for keys, backpacks, laptops
              </div>
              <div className="text-sm text-neutral-50 font-medium">$55</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={() => setStage("setup")}>
            <Sparkles className="h-4 w-4" /> Add a tracker (demo)
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              goToApp("map");
            }}
          >
            View app
          </Button>
        </div>

        <div className="mt-4 text-xs text-neutral-500">
          Demo claim: location updates in minutes after disconnect.
        </div>
      </div>
    </div>
  );

  const HomeTab = () => (
    <div className="px-5 pb-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">Your items</div>
        <Button size="sm" onClick={() => setStage("setup")}>
          <Sparkles className="h-4 w-4" /> Add
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((it) => (
          <ItemCard
            key={it.id}
            item={it}
            onOpen={() => {
              setSelectedItemId(it.id);
              setDetailsOpen(true);
            }}
            onPing={() =>
              showToast(it.model === "Pro" ? "Ping + sound ready" : "Ping sent")
            }
            onPlaySound={() => showToast("Playing sound…")}
            onShare={() => {
              setSelectedItemId(it.id);
              setShareOpen(true);
            }}
            onTogglePrivacy={() => {
              updateItem(it.id, { isPublic: !it.isPublic });
              showToast(!it.isPublic ? "Now public" : "Now private");
            }}
          />
        ))}
      </div>
    </div>
  );

  const MapTab = () => (
    <div className="px-5 pb-4 space-y-3">
      <div className="text-sm text-neutral-400">Map</div>

      <MapMock
        selectedId={selectedItemId}
        setSelectedId={setSelectedItemId}
        items={items}
        onOpenSelected={() => setDetailsOpen(true)}
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm text-neutral-200">Selected</div>
              <div className="text-lg font-semibold text-neutral-50 truncate">
                {selectedItem?.name}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Last seen <span className="text-neutral-300">{selectedItem?.lastSeen}</span>
                <span className="text-neutral-600"> · </span>
                <span className="text-neutral-300">{selectedItem?.place}</span>
                {selectedItem?.status === "shared_with_me" && selectedItem?.owner
                  ? ` · Owner: ${selectedItem.owner}`
                  : ""}
              </div>
            </div>
            <Button variant="secondary" onClick={() => setDetailsOpen(true)}>
              Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-neutral-200">Last known locations</div>
          <div className="mt-3 space-y-2">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => setSelectedItemId(it.id)}
                className={cx(
                  "w-full flex items-center justify-between rounded-2xl border border-neutral-900 bg-neutral-950/60 px-4 py-3 text-left",
                  it.id === selectedItemId ? "border-neutral-700" : ""
                )}
              >
                <div className="min-w-0">
                  <div className="text-sm text-neutral-200 truncate">
                    {it.name}
                    {it.status === "shared_with_me" && it.owner
                      ? ` (Owner: ${it.owner})`
                      : ""}
                  </div>
                  <div className="text-xs text-neutral-600 truncate">
                    {it.place} · {it.lastSeen}
                  </div>
                </div>
                <div className="text-xs text-neutral-500">View</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const FriendsTab = () => {
    const it = selectedItem;
    const followers = (it?.followers ?? []).map(
      (fid: string) =>
        demoFriends.find((f) => f.id === fid) || {
          id: fid,
          name: fid,
          handle: "",
        }
    );

    return (
      <div className="px-5 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-neutral-400">Sharing</div>
            <div className="text-base text-neutral-50 font-medium">
              {it?.name}
            </div>
            {it?.status === "shared_with_me" && it?.owner && (
              <div className="text-xs text-neutral-600">Owner: {it.owner}</div>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => setShareOpen(true)}
            disabled={it?.status === "shared_with_me"}
          >
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-200">Followers</div>
                <div className="text-xs text-neutral-500">
                  People who can help locate your item
                </div>
              </div>
              <Badge className="rounded-2xl bg-neutral-900 text-neutral-200">
                {followers.length}
              </Badge>
            </div>

            {followers.length ? (
              <div className="space-y-2">
                {followers.map((f: any) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-2xl border border-neutral-900 bg-neutral-950/60 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm text-neutral-200">{f.name}</div>
                      <div className="text-xs text-neutral-600">{f.handle}</div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        updateItem(it!.id, {
                          followers: it!.followers.filter((x: string) => x !== f.id),
                        });
                        showToast("Removed");
                      }}
                      disabled={it?.status === "shared_with_me"}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-neutral-500">No followers yet.</div>
            )}

            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-200">Public</div>
                <div className="text-xs text-neutral-500">
                  Allow followers to see location
                </div>
              </div>
              <Switch
                checked={!!it?.isPublic}
                onChange={(v) => {
                  updateItem(it!.id, { isPublic: v });
                  showToast(v ? "Now public" : "Now private");
                }}
              />
            </div>

            {it?.status === "shared_with_me" && (
              <div className="text-xs text-neutral-600">
                This item is shared with you by {it.owner}. Sharing controls are
                limited.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="text-sm text-neutral-200">Share link</div>
            <div className="text-xs text-neutral-500">
              (Demo) Send this to friends for follower access.
            </div>
            <div className="rounded-2xl bg-neutral-900 px-3 py-2 text-xs text-neutral-200 font-mono overflow-hidden text-ellipsis">
              sticktrack.app/follow/{it?.id}
            </div>
            <Button variant="secondary" onClick={() => showToast("Copied link")}> 
              Copy link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const SettingsTab = () => (
    <div className="px-5 pb-4 space-y-3">
      <div className="text-sm text-neutral-400">Settings</div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-200">Account</div>
              <div className="text-xs text-neutral-500">Demo User</div>
            </div>
            <Badge className="rounded-2xl bg-neutral-900 text-neutral-200">
              Demo
            </Badge>
          </div>

          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-sm text-neutral-200">Notifications</div>
              <div className="text-xs text-neutral-500 truncate">
                Alerts when items disconnect or move
              </div>
            </div>
            <Switch checked={notifOn} onChange={setNotifOn} />
          </div>

          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-sm text-neutral-200">Location</div>
              <div className="text-xs text-neutral-500 truncate">
                Required for map + last known location
              </div>
            </div>
            <Switch checked={locationOn} onChange={setLocationOn} />
          </div>
        </CardContent>
      </Card>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => setStage("marketing")}
      >
        Back to storefront
      </Button>
    </div>
  );

  const AppShell = () => (
    <div className="min-h-[720px] flex flex-col">
      <Header
        title={
          tab === "home"
            ? "Home"
            : tab === "map"
            ? "Map"
            : tab === "friends"
            ? "Share"
            : "Settings"
        }
      />
      <div className="flex-1">
        {tab === "home" && <HomeTab />}
        {tab === "map" && <MapTab />}
        {tab === "friends" && <FriendsTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );

  const cancelSetup = () => {
    // If they were in the app already, return to app; otherwise back to storefront
    if (stage === "setup") {
      // If already have items, go to app (map is the “main” feature)
      goToApp("map");
    } else {
      setStage("marketing");
    }
  };

  return (
    <PhoneFrame>
      {stage === "marketing" && <Marketing />}
      {stage === "setup" && (
        <SetupFlow
          onFinish={addItemFromSetup}
          onCancel={() => {
            // If setup started from marketing, return there; else go to app
            setStage("app");
            setTab("home");
          }}
          initialCode={initialSetupCode}
        />
      )}
      {stage === "app" && <AppShell />}

      {/* Details sheet */}
      <Sheet
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={selectedItem?.name || "Item"}
        subtitle={`Model: ${selectedItem?.model} · Battery: ${selectedItem?.battery}%`}
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4">
            <div className="text-xs text-neutral-500">Last known location</div>
            <div className="mt-2 text-sm text-neutral-200">
              {selectedItem?.place}
            </div>
            <div className="text-xs text-neutral-600">
              Updated {selectedItem?.lastSeen}
              {selectedItem?.status === "shared_with_me" && selectedItem?.owner
                ? ` · Owner: ${selectedItem.owner}`
                : ""}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => showToast("Requested location update")}> 
              <MapPin className="h-4 w-4" /> Update
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShareOpen(true);
                setDetailsOpen(false);
              }}
              disabled={selectedItem?.status === "shared_with_me"}
            >
              <Share2 className="h-5 w-5" /> Share
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeleteOpen(true)}
              disabled={selectedItem?.status === "shared_with_me"}
            >
              <Trash2 className="h-4 w-4" /> Remove
            </Button>
          </div>

          {selectedItem?.status === "shared_with_me" && (
            <div className="text-xs text-neutral-600">
              This item is shared with you. Only the owner can remove it.
            </div>
          )}
        </div>
      </Sheet>

      {/* Share modal */}
      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`Share ${selectedItem?.name || "item"}`}
      >
        <div className="space-y-2">
          {demoFriends.map((f) => {
            const cur = selectedItem?.followers ?? [];
            const isFollowing = cur.includes(f.id);
            return (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-2xl border border-neutral-900 bg-neutral-950/60 px-4 py-3"
              >
                <div>
                  <div className="text-sm text-neutral-200">{f.name}</div>
                  <div className="text-xs text-neutral-600">{f.handle}</div>
                </div>
                <Button
                  variant={isFollowing ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => {
                    updateItem(selectedItem!.id, {
                      followers: isFollowing
                        ? cur.filter((x: string) => x !== f.id)
                        : [...cur, f.id],
                    });
                    showToast(isFollowing ? "Removed" : "Added");
                  }}
                  disabled={selectedItem?.status === "shared_with_me"}
                >
                  {isFollowing ? "Remove" : "Add"}
                </Button>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => setShareOpen(false)}>
            Done
          </Button>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit item">
        <div className="space-y-2">
          <div className="text-xs text-neutral-500">Name</div>
          <Input
            value={selectedItem?.name || ""}
            onChange={(v) => updateItem(selectedItem!.id, { name: v })}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => setEditOpen(false)}>
            Done
          </Button>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Remove tracker?">
        <div className="text-sm text-neutral-400">
          This removes it from your list.
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const id = selectedItem!.id;
              setItems((prev) => prev.filter((x) => x.id !== id));
              const left = items.filter((x) => x.id !== id);
              setSelectedItemId(left[0]?.id || "");
              setDeleteOpen(false);
              setDetailsOpen(false);
              showToast("Removed");
            }}
          >
            Remove
          </Button>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 backdrop-blur px-4 py-2 text-sm text-neutral-100 shadow-xl">
            {toast}
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
