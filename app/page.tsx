"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
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
} from "lucide-react";

/**
 * Stick & Track — Demo Prototype
 * Self-contained (Tailwind + lucide-react only)
 *
 * ✅ Works as a Next.js App Router page (app/page.tsx)
 * ✅ Deploys cleanly to Vercel
 * ✅ Future NFC deep-link ready: /?setup=1&code=STICK-1234
 *
 * Note: true /setup route requires adding app/setup/page.tsx.
 * For now we use query params so you can demo today with one page.
 */

const demoFriends = [
  { id: "f1", name: "Jess", handle: "@jess" },
  { id: "f2", name: "Tony", handle: "@tony" },
  { id: "f3", name: "Stella", handle: "@stella" },
];

const campusPlaces = [
  { id: "p1", name: "Memorial Union", tag: "MU" },
  { id: "p2", name: "Shields Library", tag: "Shields" },
  { id: "p3", name: "ARC", tag: "ARC" },
  { id: "p4", name: "Silo", tag: "Silo" },
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
  variant?: "primary" | "secondary";
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

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex items-center rounded-xl px-2.5 py-1 text-xs", className)}>
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-3xl border border-neutral-900 bg-neutral-950/70", className)}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("p-4 pb-2", className)}>{children}</div>;
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("p-4", className)}>{children}</div>;
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
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
      <div className="h-full bg-white" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-50 flex items-center justify-center p-6">
      <div className="w-[390px] max-w-full">
        <div className="rounded-[2.2rem] border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden">
          <div className="h-10 flex items-center justify-between px-5 border-b border-neutral-900">
            <div className="text-xs text-neutral-400">Stick & Track (demo)</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <div className="text-xs text-neutral-500">Connected</div>
            </div>
          </div>
          <div className="bg-neutral-950">{children}</div>
        </div>
        <div className="text-center text-xs text-neutral-500 mt-3">
          Tip: This is deployable—use it as a real link in your slides.
        </div>
      </div>
    </div>
  );
}

function Pill({ icon: Icon, label, right }: { icon: any; label: string; right: string }) {
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

function BottomNav({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  const Item = ({ id, Icon, label }: { id: string; Icon: any; label: string }) => (
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

function MapMock({
  selectedId,
  setSelectedId,
  items,
}: {
  selectedId: string;
  setSelectedId: (id: string) => void;
  items: any[];
}) {
  const pins = useMemo(() => {
    const base = [
      { x: 18, y: 28 },
      { x: 62, y: 22 },
      { x: 72, y: 58 },
      { x: 28, y: 66 },
      { x: 44, y: 46 },
    ];
    return items.map((it, idx) => ({
      id: it.id,
      x: base[idx % base.length].x + (idx % 2 ? 6 : 0),
      y: base[idx % base.length].y + (idx % 3 ? 4 : 0),
      status: it.status,
    }));
  }, [items]);

  return (
    <div className="rounded-3xl overflow-hidden border border-neutral-900 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="p-4 border-b border-neutral-900 flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-100">Campus Map</div>
          <div className="text-xs text-neutral-500">Tap pins to view last seen</div>
        </div>
        <Button variant="secondary" size="sm" className="rounded-2xl">
          <LocateFixed className="h-4 w-4" />
          Locate
        </Button>
      </div>

      <div className="relative h-[260px]">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.14),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_45%_80%,rgba(245,158,11,0.10),transparent_35%)]" />
          <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:26px_26px]" />
        </div>

        {pins.map((p) => {
          const isSel = p.id === selectedId;
          const color =
            p.status === "nearby"
              ? "bg-emerald-500"
              : p.status === "out_of_range"
              ? "bg-amber-500"
              : "bg-sky-500";
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={cx("absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition", isSel ? "scale-110" : "scale-100")}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-label="pin"
            >
              <div className={cx("h-4 w-4 rounded-full", color, isSel ? "ring-4 ring-white/20" : "ring-2 ring-white/10")} />
              <div className="h-4 w-4 rounded-full -mt-2 opacity-25 bg-white/10" />
            </button>
          );
        })}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Nearby</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> Out of range</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500" /> Shared</span>
        </div>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
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
            <button className="h-9 w-9 rounded-2xl bg-neutral-900 hover:bg-neutral-800 transition" onClick={onClose} aria-label="close" />
          </div>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Sheet({ open, onClose, title, subtitle, children }: { open: boolean; onClose: () => void; title: string; subtitle?: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 right-0 bottom-0">
        <div className="rounded-t-3xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-neutral-50">{title}</div>
              {subtitle && <div className="text-sm text-neutral-500 mt-1">{subtitle}</div>}
            </div>
            <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ItemCard({
  item,
  onOpen,
  onPing,
  onShare,
  onTogglePrivacy,
}: {
  item: any;
  onOpen: () => void;
  onPing: () => void;
  onShare: () => void;
  onTogglePrivacy: () => void;
}) {
  const statusBadge =
    item.status === "nearby"
      ? { label: "Nearby", className: "bg-emerald-500/15 text-emerald-300" }
      : item.status === "out_of_range"
      ? { label: "Out of range", className: "bg-amber-500/15 text-amber-300" }
      : { label: "Shared", className: "bg-sky-500/15 text-sky-300" };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-base text-neutral-50 font-medium">{item.name}</div>
              <Badge className={cx("rounded-xl", statusBadge.className)}>{statusBadge.label}</Badge>
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

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button variant="secondary" onClick={onPing}>
            <Bell className="h-4 w-4" /> Ping
          </Button>
          <Button variant="secondary" onClick={onShare}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="secondary" onClick={onTogglePrivacy}>
            {item.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {item.isPublic ? "Public" : "Private"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SetupFlow({
  onFinish,
  initialCode,
}: {
  onFinish: (x: any) => void;
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
      desc: "Scan the sticker's NFC tag or enter the setup code.",
      content: (
        <div className="space-y-3">
          <Pill icon={ScanLine} label="NFC scan" right="Hold phone near sticker" />
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
                ? "Ultra-thin, silent (best for wallets/bottles)"
                : "Has speaker for sound alerts (best for keys/bikes)"}
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
            <div>
              <div className="text-sm text-neutral-200">Public (followers)</div>
              <div className="text-xs text-neutral-500">Friends can view location to help you find it</div>
            </div>
            <Switch checked={isPublic} onChange={setIsPublic} />
          </div>

          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4">
            <div className="text-xs text-neutral-500">Example followers</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {demoFriends.map((f) => (
                <Badge key={f.id} className="rounded-2xl bg-neutral-900 text-neutral-200">
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
      <div className="space-y-2">
        <div className="text-xs text-neutral-500">Setup</div>
        <div className="text-xl font-semibold text-neutral-50">{steps[step].title}</div>
        <div className="text-sm text-neutral-400">{steps[step].desc}</div>
      </div>

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
          <Button onClick={() => onFinish({ code, name, model, isPublic })}>Finish setup</Button>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const [stage, setStage] = useState<"marketing" | "setup" | "app">("marketing");
  const [tab, setTab] = useState<"home" | "map" | "friends" | "settings">("home");

  const [selectedItemId, setSelectedItemId] = useState("i1");

  // Preloaded items per your request:
  const [items, setItems] = useState<any[]>([
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
      lastSeen: "12 min ago",
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
      place: "ARC",
      battery: 91,
      isPublic: false,
      followers: [],
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

  const showToast = (message: string) => {
    setToast(message);
    // @ts-ignore
    window.clearTimeout(showToast._t);
    // @ts-ignore
    showToast._t = window.setTimeout(() => setToast(null), 1800);
  };

  const updateItem = (id: string, patch: any) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
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

  const addItemFromSetup = ({ name, model, isPublic }: any) => {
    const place = campusPlaces[Math.floor(Math.random() * campusPlaces.length)];
    const id = `i${Math.floor(Math.random() * 9000) + 100}`;
    const newItem = {
      id,
      name: name || "New Item",
      model,
      status: "nearby",
      lastSeen: "Just now",
      place: "Nearby",
      battery: 100,
      isPublic: !!isPublic,
      followers: isPublic ? demoFriends.map((f) => f.id).slice(0, 2) : [],
      _seedPlace: place.name,
    };
    setItems((p) => [newItem, ...p]);
    setSelectedItemId(id);
    setStage("app");
    setTab("home");
    showToast("Tracker added");

    // Clean URL back to normal after demo deep-link
    const url = new URL(window.location.href);
    url.searchParams.delete("setup");
    url.searchParams.delete("code");
    window.history.replaceState({}, "", url.toString());
  };

  const Header = ({ title }: { title: string }) => (
    <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
      <div>
        <div className="text-xl font-semibold text-neutral-50">{title}</div>
        <div className="text-sm text-neutral-500">Minimal tracking. Maximum peace of mind.</div>
      </div>
      <button
        onClick={() => setStage("setup")}
        className="h-10 w-10 rounded-2xl bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 transition"
        aria-label="Add"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );

  const Marketing = () => (
    <div className="p-5 space-y-4">
      <div className="rounded-3xl border border-neutral-900 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-3 py-1 text-xs text-neutral-200">
          <CheckCircle2 className="h-4 w-4" /> Demo storefront
        </div>
        <div className="mt-4 text-2xl font-semibold text-neutral-50">Stick & Track</div>
        <div className="mt-1 text-sm text-neutral-400">A slim tracker with smart switching—Bluetooth nearby, location update when it disconnects.</div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Card>
            <CardHeader>
              <div className="text-sm text-neutral-100">Slim</div>
              <div className="text-xs text-neutral-500">Ultra-thin, silent</div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex items-center gap-2 text-xs text-neutral-400"><VolumeX className="h-4 w-4" /> No speaker</div>
              <div className="flex items-center gap-2 text-xs text-neutral-400"><BatteryFull className="h-4 w-4" /> 2+ years battery</div>
              <div className="text-sm text-neutral-50 font-medium">$20</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-sm text-neutral-100">Pro</div>
              <div className="text-xs text-neutral-500">Compact + speaker</div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex items-center gap-2 text-xs text-neutral-400"><Volume2 className="h-4 w-4" /> Sound alerts</div>
              <div className="flex items-center gap-2 text-xs text-neutral-400"><BatteryFull className="h-4 w-4" /> 2+ years battery</div>
              <div className="text-sm text-neutral-50 font-medium">$55</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={() => setStage("setup")}>
            <Plus className="h-4 w-4" /> Add a tracker (demo)
          </Button>
          <Button variant="secondary" onClick={() => { setStage("app"); setTab("home"); }}>
            View app
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="text-sm text-neutral-200">Why it’s faster</div>
          <div className="text-xs text-neutral-500">Demo copy: When Bluetooth disconnects, we instantly trigger a “last known location” update.</div>
          <div className="grid grid-cols-2 gap-2">
            <Pill icon={Bell} label="Quick ping" right="minutes" />
            <Pill icon={BatteryFull} label="Low energy" right="2+ yrs" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const HomeTab = () => (
    <div className="px-5 pb-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">Your items</div>
        <Button size="sm" onClick={() => setStage("setup")}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((it) => (
          <ItemCard
            key={it.id}
            item={it}
            onOpen={() => { setSelectedItemId(it.id); setDetailsOpen(true); }}
            onPing={() => showToast(it.model === "Pro" ? "Playing sound…" : "Ping sent")}
            onShare={() => { setSelectedItemId(it.id); setShareOpen(true); }}
            onTogglePrivacy={() => { updateItem(it.id, { isPublic: !it.isPublic }); showToast(!it.isPublic ? "Now public" : "Now private"); }}
          />
        ))}
      </div>
    </div>
  );

  const MapTab = () => (
    <div className="px-5 pb-4 space-y-3">
      <div className="text-sm text-neutral-400">Map</div>
      <MapMock selectedId={selectedItemId} setSelectedId={setSelectedItemId} items={items} />

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-neutral-200">Selected</div>
              <div className="text-lg font-semibold text-neutral-50">{selectedItem?.name}</div>
              <div className="text-xs text-neutral-500 mt-1">
                Last seen <span className="text-neutral-300">{selectedItem?.lastSeen}</span> · <span className="text-neutral-300">{selectedItem?.place}</span>
              </div>
            </div>
            <Button variant="secondary" onClick={() => setDetailsOpen(true)}>Details</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const FriendsTab = () => {
    const it = selectedItem;
    const followers = (it?.followers ?? []).map(
      (fid: string) => demoFriends.find((f) => f.id === fid) || { id: fid, name: fid, handle: "" }
    );

    return (
      <div className="px-5 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-neutral-400">Sharing</div>
            <div className="text-base text-neutral-50 font-medium">{it?.name}</div>
          </div>
          <Button size="sm" onClick={() => setShareOpen(true)}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-200">Followers</div>
                <div className="text-xs text-neutral-500">People who can help locate your item</div>
              </div>
              <Badge className="rounded-2xl bg-neutral-900 text-neutral-200">{followers.length}</Badge>
            </div>

            {followers.length ? (
              <div className="space-y-2">
                {followers.map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between rounded-2xl border border-neutral-900 bg-neutral-950/60 px-4 py-3">
                    <div>
                      <div className="text-sm text-neutral-200">{f.name}</div>
                      <div className="text-xs text-neutral-600">{f.handle}</div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { updateItem(it.id, { followers: it.followers.filter((x: string) => x !== f.id) }); showToast("Removed"); }}
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
                <div className="text-xs text-neutral-500">Allow followers to see location</div>
              </div>
              <Switch checked={!!it?.isPublic} onChange={(v) => { updateItem(it.id, { isPublic: v }); showToast(v ? "Now public" : "Now private"); }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="text-sm text-neutral-200">Share link</div>
            <div className="text-xs text-neutral-500">(Demo) Send this to friends for follower access.</div>
            <div className="rounded-2xl bg-neutral-900 px-3 py-2 text-xs text-neutral-200 font-mono">sticktrack.app/follow/{it?.id}</div>
            <Button variant="secondary" onClick={() => showToast("Copied link")}>Copy link</Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const SettingsTab = () => (
    <div className="px-5 pb-4 space-y-3">
      <div className="text-sm text-neutral-400">Settings</div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-200">Account</div>
              <div className="text-xs text-neutral-500">Demo User</div>
            </div>
            <Badge className="rounded-2xl bg-neutral-900 text-neutral-200">Demo</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Pill icon={Bell} label="Notifications" right="On" />
            <Pill icon={MapPin} label="Location" right="Allowed" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="text-sm text-neutral-200">Demo controls</div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => showToast("Simulated: BLE disconnect → location update")}>Simulate disconnect</Button>
            <Button
              variant="secondary"
              onClick={() => {
                const pick = items[Math.floor(Math.random() * items.length)];
                const place = campusPlaces[Math.floor(Math.random() * campusPlaces.length)];
                updateItem(pick.id, { status: "out_of_range", place: place.name, lastSeen: "2 min ago" });
                setSelectedItemId(pick.id);
                showToast(`Updated: ${pick.name}`);
              }}
            >
              Randomize location
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button variant="secondary" className="w-full" onClick={() => setStage("marketing")}>Back to storefront</Button>
    </div>
  );

  const AppShell = () => (
    <div className="min-h-[720px] flex flex-col">
      <Header title={tab === "home" ? "Home" : tab === "map" ? "Map" : tab === "friends" ? "Share" : "Settings"} />
      <div className="flex-1">
        {tab === "home" && <HomeTab />}
        {tab === "map" && <MapTab />}
        {tab === "friends" && <FriendsTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );

  return (
    <PhoneFrame>
      {stage === "marketing" && <Marketing />}
      {stage === "setup" && <SetupFlow onFinish={addItemFromSetup} initialCode={initialSetupCode} />}
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
            <div className="mt-2 text-sm text-neutral-200">{selectedItem?.place}</div>
            <div className="text-xs text-neutral-600">Updated {selectedItem?.lastSeen}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => showToast("Requested location update")}> <MapPin className="h-4 w-4" /> Update</Button>
            <Button variant="secondary" onClick={() => { setShareOpen(true); setDetailsOpen(false); }}> <Share2 className="h-4 w-4" /> Share</Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(true)}><Pencil className="h-4 w-4" /> Edit</Button>
            <Button variant="secondary" onClick={() => setDeleteOpen(true)}><Trash2 className="h-4 w-4" /> Remove</Button>
          </div>
        </div>
      </Sheet>

      {/* Share modal */}
      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title={`Share ${selectedItem?.name || "item"}`}>
        <div className="space-y-2">
          {demoFriends.map((f) => {
            const isFollowing = (selectedItem?.followers ?? []).includes(f.id);
            return (
              <div key={f.id} className="flex items-center justify-between rounded-2xl border border-neutral-900 bg-neutral-950/60 px-4 py-3">
                <div>
                  <div className="text-sm text-neutral-200">{f.name}</div>
                  <div className="text-xs text-neutral-600">{f.handle}</div>
                </div>
                <Button
                  variant={isFollowing ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => {
                    const cur = selectedItem?.followers ?? [];
                    updateItem(selectedItem.id, { followers: isFollowing ? cur.filter((x: string) => x !== f.id) : [...cur, f.id] });
                    showToast(isFollowing ? "Removed" : "Added");
                  }}
                >
                  {isFollowing ? "Remove" : "Add"}
                </Button>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => setShareOpen(false)}>Done</Button>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit item">
        <div className="space-y-2">
          <div className="text-xs text-neutral-500">Name</div>
          <Input value={selectedItem?.name || ""} onChange={(v) => updateItem(selectedItem.id, { name: v })} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => setEditOpen(false)}>Done</Button>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Remove tracker?">
        <div className="text-sm text-neutral-400">This removes it from the demo list.</div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              const id = selectedItem.id;
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
