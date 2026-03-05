"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
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
  Plus,
} from "lucide-react";

/**
 * Stick 'n Track â€” Demo Prototype
 * Self-contained (Tailwind + lucide-react only)
 *
 * âœ… Works as a Next.js App Router page (app/page.tsx)
 * âœ… Deploys cleanly to Vercel
 * âœ… Future NFC deep-link ready: /?setup=1&code=STICK-1234
 */

type FollowerProfile = {
  id: string;
  name: string;
  handle: string;
};

type FriendLocation = FollowerProfile & {
  place: string;
  lastSeen: string;
};

const demoFriends: FollowerProfile[] = [
  { id: "f1", name: "Alex", handle: "@alex" },
  { id: "f2", name: "John", handle: "@john" },
  { id: "f3", name: "Maya", handle: "@maya" },
  { id: "f4", name: "Sam", handle: "@sam" },
];

function normalizeFollowerInput(value: string): FollowerProfile | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const base = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  const slug = base.toLowerCase().replace(/[^a-z0-9._-]/g, "");
  if (!slug) return null;

  const handle = `@${slug}`;

  return {
    id: `custom:${slug}`,
    name: trimmed.startsWith("@") ? handle : trimmed,
    handle,
  };
}

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
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-50 flex items-center justify-center p-3 sm:p-6">
      <div className="w-[390px] max-w-full">
        <div className="h-[min(100dvh-1.5rem,844px)] sm:h-[min(100dvh-3rem,844px)] rounded-[2.2rem] border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden flex flex-col">
          {/* Top bar (removed Connected label) */}
          <div className="h-10 shrink-0 flex items-center justify-between px-5 border-b border-neutral-900">
            <div className="text-xs text-neutral-400">Stick 'n Track</div>
          </div>
          <div className="min-h-0 flex-1 bg-neutral-950">{children}</div>
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

function FollowerPicker({
  people,
  selectedIds,
  onToggle,
  onCreateCustom,
  title = "Suggested people",
  emptyLabel = "No matching people found.",
}: {
  people: FollowerProfile[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onCreateCustom: (profile: FollowerProfile) => void;
  title?: string;
  emptyLabel?: string;
}) {
  const [query, setQuery] = useState("");
  const customFollower = normalizeFollowerInput(query);

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;

    return people.filter((friend) => {
      return (
        friend.name.toLowerCase().includes(q) ||
        friend.handle.toLowerCase().includes(q.replace(/^@/, ""))
      );
    });
  }, [people, query]);

  const hasCustomMatch = customFollower
    ? people.some(
        (friend) =>
          friend.id === customFollower.id ||
          friend.name.toLowerCase() === customFollower.name.toLowerCase() ||
          friend.handle.toLowerCase() === customFollower.handle.toLowerCase()
      )
    : false;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="text-xs text-neutral-500">Search by name or username</div>
        <Input
          value={query}
          onChange={setQuery}
          placeholder="@alex or Alex"
        />
      </div>

      <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-neutral-500">{title}</div>
          <Badge className="rounded-2xl bg-neutral-900 text-neutral-200">
            {selectedIds.length} added
          </Badge>
        </div>

        {customFollower && !hasCustomMatch && (
          <div className="mt-3 rounded-2xl border border-neutral-900 bg-neutral-950 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-neutral-200">{customFollower.name}</div>
                <div className="text-xs text-neutral-600">
                  {customFollower.handle}
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onCreateCustom(customFollower)}
              >
                Add
              </Button>
            </div>
          </div>
        )}

        {filteredFriends.length ? (
          <div className="mt-3 space-y-2">
            {filteredFriends.map((friend) => {
              const isSelected = selectedIds.includes(friend.id);

              return (
                <div
                  key={friend.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-900 bg-neutral-950 px-4 py-3"
                >
                  <div>
                    <div className="text-sm text-neutral-200">{friend.name}</div>
                    <div className="text-xs text-neutral-600">{friend.handle}</div>
                  </div>
                  <Button
                    variant={isSelected ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => onToggle(friend.id)}
                  >
                    {isSelected ? "Remove" : "Add"}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 text-sm text-neutral-500">{emptyLabel}</div>
        )}
      </div>
    </div>
  );
}

type TabKey = "find" | "friends" | "settings";

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
    <div className="shrink-0 border-t border-neutral-900 bg-neutral-950/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/85">
      <div className="grid grid-cols-3 gap-2 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        <Item id="find" Icon={MapPin} label="Find" />
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
        <div className="max-h-[min(84dvh,720px)] overflow-y-auto rounded-3xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl">
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

type StatusKey = "nearby" | "out_of_range" | "shared" | "shared_with_me";

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
  owner?: string;
};

function statusMeta(status: StatusKey) {
  if (status === "shared_with_me")
    return {
      label: "Shared with me",
      badge: "bg-sky-500/15 text-sky-300",
      dot: "bg-sky-500",
    };
  return {
    label: "My item",
    badge: "bg-emerald-500/15 text-emerald-300",
    dot: "bg-emerald-500",
  };
}

function ItemCard({
  item,
  onOpen,
  onQuickShare,
  onPing,
  onPlaySound,
}: {
  item: Item;
  onOpen: () => void;
  onQuickShare: () => void;
  onPing: () => void;
  onPlaySound: () => void;
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
              <div className="flex items-center gap-2 min-w-0">
                <span className={cx("h-2 w-2 rounded-full", meta.dot)} />
                <div className="text-base text-neutral-50 font-medium truncate">
                  {item.name}
                </div>
              </div>

              <Badge className={cx("rounded-xl", meta.badge)}>{meta.label}</Badge>

              {isSharedWithMe && item.owner && (
                <Badge className="rounded-xl bg-neutral-900 text-neutral-200">
                  Owner: {item.owner}
                </Badge>
              )}
            </div>

            <div className="text-xs text-neutral-500 mt-1">
              Last seen <span className="text-neutral-300">{item.lastSeen}</span>
              <span className="text-neutral-600"> Â· </span>
              <span className="text-neutral-300">{item.place}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Remove share button entirely for "Shared with me" items */}
            {!isSharedWithMe && (
              <button
                onClick={onQuickShare}
                className="h-10 w-10 rounded-2xl bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 transition"
                aria-label="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={onOpen}
              className="h-10 w-10 rounded-2xl bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 transition"
              aria-label="Info"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className={cx("mt-4 grid gap-2", isPro ? "grid-cols-2" : "grid-cols-1")}
        >
          <Button variant="secondary" onClick={onPing}>
            <Bell className="h-4 w-4" /> Ping
          </Button>
          {isPro && (
            <Button variant="secondary" onClick={onPlaySound}>
              <Volume2 className="h-5 w-5" /> Play sound
            </Button>
          )}
        </div>

        {isSharedWithMe && (
          <div className="mt-3 text-xs text-neutral-600">
            Shared with you. Controls are limited.
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
  friendLocations,
  onOpenSelected,
}: {
  selectedId: string;
  setSelectedId: (id: string) => void;
  items: Item[];
  friendLocations: FriendLocation[];
  onOpenSelected: () => void;
}) {
  const placeToCoords: Record<string, { lat: number; lng: number }> = {
    "Memorial Union": { lat: 38.54241, lng: -121.74958 },
    "Shields Library": { lat: 38.54018, lng: -121.74885 },
    "Teaching & Learning Complex": { lat: 38.53869, lng: -121.75398 },
    "East Quad": { lat: 38.54118, lng: -121.74895 },
    Nearby: { lat: 38.5415, lng: -121.7505 },
  };

  const selected = items.find((x) => x.id === selectedId) || items[0];
  const selectedCoords = placeToCoords[selected.place] || placeToCoords["Nearby"];

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const leafletLoadRef = useRef<Promise<any> | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const getCoordsForPlace = (place: string) =>
    placeToCoords[place] || placeToCoords["Nearby"];

  const loadLeaflet = () => {
    if (typeof window === "undefined") return Promise.reject(new Error("No window"));
    if ((window as any).L) return Promise.resolve((window as any).L);
    if (leafletLoadRef.current) return leafletLoadRef.current;

    leafletLoadRef.current = new Promise((resolve, reject) => {
      const cssId = "leaflet-css-cdn";
      if (!document.getElementById(cssId)) {
        const link = document.createElement("link");
        link.id = cssId;
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const existing = document.getElementById("leaflet-js-cdn") as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", () => resolve((window as any).L));
        existing.addEventListener("error", () => reject(new Error("Failed to load Leaflet")));
        return;
      }

      const script = document.createElement("script");
      script.id = "leaflet-js-cdn";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => resolve((window as any).L);
      script.onerror = () => reject(new Error("Failed to load Leaflet"));
      document.body.appendChild(script);
    });

    return leafletLoadRef.current;
  };

  useEffect(() => {
    let disposed = false;

    const initMap = async () => {
      try {
        const L = await loadLeaflet();
        if (disposed || !mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
          zoomControl: true,
          attributionControl: true,
        }).setView([selectedCoords.lat, selectedCoords.lng], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          detectRetina: true,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        mapRef.current = map;
        setMapReady(true);
      } catch {
        // Keep UI stable if map CDN is blocked.
      }
    };

    initMap();

    return () => {
      disposed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerLayerRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !(window as any).L) return;
    const L = (window as any).L;

    if (markerLayerRef.current) {
      markerLayerRef.current.remove();
    }
    const layer = L.layerGroup();

    const offsetPoint = (coords: { lat: number; lng: number }, n: number) => {
      if (n === 0) return coords;
      const angle = (n * 137.5 * Math.PI) / 180;
      const distance = 0.00018 * Math.ceil(n / 2);
      return {
        lat: coords.lat + Math.sin(angle) * distance,
        lng: coords.lng + Math.cos(angle) * distance,
      };
    };

    const itemCountByPlace = new Map<string, number>();
    const escapeHtml = (value: string) =>
      value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

    items.forEach((it) => {
      const base = getCoordsForPlace(it.place);
      const count = itemCountByPlace.get(it.place) ?? 0;
      itemCountByPlace.set(it.place, count + 1);
      const coords = offsetPoint(base, count);
      const isSel = it.id === selectedId;
      const isSharedWithMe = it.status === "shared_with_me";

      // Outer glow ring so tracked-item circles are always easy to spot.
      L.circleMarker([coords.lat, coords.lng], {
        radius: isSel ? 14 : 11,
        color: isSharedWithMe ? "#38bdf8" : "#34d399",
        weight: isSel ? 2 : 1,
        fillOpacity: 0.2,
        opacity: 0.9,
      }).addTo(layer);

      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius: isSel ? 10 : 8,
        color: "#ffffff",
        weight: isSel ? 2 : 1.5,
        fillColor: isSharedWithMe ? "#0ea5e9" : "#10b981",
        fillOpacity: 0.95,
      }).addTo(layer);
      const ownerLine =
        it.status === "shared_with_me" && it.owner
          ? `<div style="margin-top:2px;">Owner: ${escapeHtml(it.owner)}</div>`
          : "";
      const popupHtml = `<div style="
        min-width: 150px;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        color: #111827;
        line-height: 1.35;
      ">
        <div style="font-weight: 700;">${escapeHtml(it.name)}</div>
        <div style="font-size:12px; margin-top:2px;">${escapeHtml(it.place)}</div>
        <div style="font-size:12px; margin-top:2px;">Last seen: ${escapeHtml(it.lastSeen)}</div>
        ${ownerLine}
      </div>`;
      marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -8] });

      const label = L.marker([coords.lat, coords.lng], {
        icon: L.divIcon({
          className: "",
          iconSize: [0, 0],
          html: `<div style="
            transform: translate(-50%, -34px);
            display: inline-block;
            border: 1px solid rgba(255,255,255,0.22);
            background: rgba(10,10,10,0.86);
            color: #f5f5f5;
            border-radius: 9999px;
            padding: 3px 8px;
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          ">${escapeHtml(it.name)}</div>`,
        }),
        interactive: true,
      }).addTo(layer);

      marker.on("click", () => {
        setSelectedId(it.id);
        marker.openPopup();
      });
      label.on("click", () => {
        setSelectedId(it.id);
        marker.openPopup();
      });
    });

    layer.addTo(map);
    markerLayerRef.current = layer;
  }, [items, friendLocations, selectedId, setSelectedId, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.panTo([selectedCoords.lat, selectedCoords.lng], { animate: true, duration: 0.35 });
  }, [selectedCoords.lat, selectedCoords.lng]);

  return (
    <div className="rounded-3xl overflow-hidden border border-neutral-900 bg-neutral-950">
      <div className="p-4 border-b border-neutral-900 flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-100">Campus Map</div>
          <div className="text-xs text-neutral-500">
            Real map of Davis with demo item markers
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-2xl"
          onClick={() => {
            const map = mapRef.current;
            if (!map) return;
            map.setView([selectedCoords.lat, selectedCoords.lng], 16, { animate: true });
          }}
        >
          <LocateFixed className="h-4 w-4" />
          Center
        </Button>
      </div>

      <div className="relative h-[58dvh] min-h-[420px] max-h-[680px]">
        <div ref={mapContainerRef} className="h-full w-full" />
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 px-3 py-1.5 text-[11px] text-neutral-300 backdrop-blur">
          Drag to pan, pinch to zoom
        </div>
      </div>

      <div className="p-4">
        <div className="rounded-2xl border border-neutral-900 bg-neutral-900/50 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-neutral-50 truncate">
                {selected.name}
              </div>
              <div className="text-[11px] text-neutral-500 truncate">
                {selected.place} - {selected.lastSeen}
                {selected.status === "shared_with_me" && selected.owner
                  ? ` - Owner: ${selected.owner}`
                  : ""}
              </div>
            </div>
            <button
              onClick={onOpenSelected}
              className="h-7 w-7 rounded-xl bg-neutral-950 hover:bg-neutral-800 transition flex items-center justify-center"
              aria-label="details"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {items.map((it) => {
            const isSel = it.id === selectedId;
            return (
              <button
                key={it.id}
                onClick={() => setSelectedId(it.id)}
                className={cx(
                  "rounded-full border px-3 py-1 text-xs transition",
                  isSel
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                )}
              >
                {it.name}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> My items
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-500" /> Shared with me
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
  availableFollowers,
}: {
  onFinish: (x: any) => void;
  onCancel: () => void;
  initialCode: string;
  availableFollowers: FollowerProfile[];
}) {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState(initialCode || "STICK-4FNN");
  // Default registration name: Keys (instead of Wallet)
  const [name, setName] = useState("Keys");
  const [model, setModel] = useState<"Slim" | "Pro">("Slim");
  const [isPublic, setIsPublic] = useState(false);
  const [followers, setFollowers] = useState<string[]>([]);
  const [customFollowers, setCustomFollowers] = useState<FollowerProfile[]>([]);

  useEffect(() => {
    setCode(initialCode || "STICK-4FNN");
  }, [initialCode]);

  const toggleFollower = (id: string) => {
    setFollowers((current) =>
      current.includes(id)
        ? current.filter((followerId) => followerId !== id)
        : [...current, id]
    );
  };

  const setupFollowers = useMemo(
    () => [...availableFollowers, ...customFollowers],
    [availableFollowers, customFollowers]
  );

  const addCustomFollower = (profile: FollowerProfile) => {
    setCustomFollowers((current) =>
      current.some((entry) => entry.id === profile.id) ? current : [...current, profile]
    );
    setFollowers((current) =>
      current.includes(profile.id) ? current : [...current, profile.id]
    );
  };

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
      desc: "Choose a label so itâ€™s easy to spot.",
      content: (
        <div className="space-y-3">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4 space-y-2">
            <div className="text-xs text-neutral-500">Item name</div>
            <Input value={name} onChange={setName} placeholder="Keys, Bike, Bottleâ€¦" />
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

            {/* Removed model description text under buttons */}
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
              {/* Public (followers) -> Public */}
              <div className="text-sm text-neutral-200">Public</div>
              <div className="text-xs text-neutral-500">
                Friends can view location to help you find it
              </div>
            </div>
            <Switch checked={isPublic} onChange={setIsPublic} />
          </div>

          {isPublic ? (
            <FollowerPicker
              people={setupFollowers}
              selectedIds={followers}
              onToggle={toggleFollower}
              onCreateCustom={addCustomFollower}
              title="Suggested followers"
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 p-4">
              <div className="text-sm text-neutral-300">Private for now</div>
              <div className="mt-1 text-xs text-neutral-500">
                Turn on Public to pick friends who can help locate this item.
              </div>
            </div>
          )}
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

        {/* Removed Cancel button; rely on Back controls only */}
        <div className="w-[64px]" />
      </div>

      <div className="text-sm text-neutral-400">{steps[step].desc}</div>

      <Progress value={pct} />

      <Card>
        <CardContent className="p-4">{steps[step].content}</CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={() => {
            if (step === 0) {
              onCancel();
              return;
            }

            setStep((s) => s - 1);
          }}
        >
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
        ) : (
          <Button
            onClick={() =>
              onFinish({
                code,
                name,
                model,
                isPublic,
                followers,
                customFollowers,
              })
            }
          >
            Finish setup
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const [stage, setStage] = useState<"marketing" | "setup" | "app">("marketing");
  const [tab, setTab] = useState<TabKey>("find");
  const [setupReturn, setSetupReturn] = useState<{
    stage: "marketing" | "app";
    tab: TabKey;
  }>({
    stage: "marketing",
    tab: "find",
  });
  const [findSheetExpanded, setFindSheetExpanded] = useState(false);

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
      followers: [],
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
      followers: [],
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

  const ownedItems = useMemo(
    () => items.filter((it) => it.status !== "shared_with_me"),
    [items]
  );

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [initialSetupCode, setInitialSetupCode] = useState("STICK-4FNN");
  const [customFollowers, setCustomFollowers] = useState<FollowerProfile[]>([]);

  const [notifOn, setNotifOn] = useState(true);
  const [locationOn, setLocationOn] = useState(true);

  // Share tab item selection (owned-only)
  const [shareItemId, setShareItemId] = useState<string>("i2");
  const shareItem = useMemo(
    () => ownedItems.find((x) => x.id === shareItemId) ?? ownedItems[0],
    [ownedItems, shareItemId]
  );

  useEffect(() => {
    if (ownedItems.length && !ownedItems.some((x) => x.id === shareItemId)) {
      setShareItemId(ownedItems[0].id);
    }
  }, [ownedItems, shareItemId]);

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

  const allFollowers = useMemo(
    () => [...demoFriends, ...customFollowers],
    [customFollowers]
  );

  const getFollowerProfile = (id: string) =>
    allFollowers.find((entry) => entry.id === id) || {
      id,
      name: id,
      handle: "",
    };

  const addCustomFollower = (profile: FollowerProfile) => {
    setCustomFollowers((current) =>
      current.some((entry) => entry.id === profile.id) ? current : [...current, profile]
    );
  };

  const friendLocations = useMemo<FriendLocation[]>(
    () => [
      { ...getFollowerProfile("f1"), place: "Memorial Union", lastSeen: "3 min ago" },
      { ...getFollowerProfile("f2"), place: "East Quad", lastSeen: "Just now" },
      {
        ...getFollowerProfile("f3"),
        place: "Shields Library",
        lastSeen: "6 min ago",
      },
    ],
    [allFollowers]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") || "STICK-4FNN";
    const setup = params.get("setup");

    setInitialSetupCode(code);

    if (setup === "1") {
      setSetupReturn({ stage: "marketing", tab: "find" });
      setStage("setup");
    }
  }, []);

  const goToApp = (defaultTab: TabKey = "find") => {
    setStage("app");
    setTab(defaultTab);
  };

  const openSetup = () => {
    setSetupReturn({
      stage: stage === "app" ? "app" : "marketing",
      tab,
    });
    setStage("setup");
  };

  const exitSetup = () => {
    if (setupReturn.stage === "app") {
      goToApp(setupReturn.tab);
      return;
    }

    setStage("marketing");
  };

  const addItemFromSetup = ({
    name,
    model,
    isPublic,
    followers,
    customFollowers: setupCustomFollowers,
  }: any) => {
    setCustomFollowers((current) => {
      const next = [...current];
      (setupCustomFollowers ?? []).forEach((profile: FollowerProfile) => {
        if (!next.some((entry) => entry.id === profile.id)) {
          next.push(profile);
        }
      });
      return next;
    });

    const place = campusPlaces[Math.floor(Math.random() * campusPlaces.length)];
    const id = `i${Math.floor(Math.random() * 9000) + 100}`;
    const newItem: Item = {
      id,
      name: name || "New Item",
      model,
      status: "nearby",
      lastSeen: "Just now",
      place: place.name,
      battery: 100,
      isPublic: !!isPublic,
      followers: isPublic ? followers ?? [] : [],
    };

    setItems((p) => [newItem, ...p]);
    setSelectedItemId(id);
    goToApp("find");
    showToast("Tracker added");

    const url = new URL(window.location.href);
    url.searchParams.delete("setup");
    url.searchParams.delete("code");
    window.history.replaceState({}, "", url.toString());
  };

  const Header = ({ title }: { title: string }) => (
    <div className="px-5 pt-5 pb-3">
      <div className="text-xl font-semibold text-neutral-50">{title}</div>
      {(stage === "marketing" || (stage === "app" && tab === "find")) && (
        <div className="text-sm text-neutral-500">
          Stick it. Forget it. Weâ€™ll track it.
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
          Stick 'n Track
        </div>
        <div className="mt-1 text-sm text-neutral-400">
          Stick it. Forget it. Weâ€™ll track it.
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Card>
            <CardHeader>
              <div className="text-sm text-neutral-100">Slim</div>
              <div className="min-h-[2.5rem] text-xs text-neutral-500">
                Ultra-thin, silent
              </div>
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
              <div className="text-sm text-neutral-50 font-medium">$15</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-sm text-neutral-100">Pro</div>
              <div className="min-h-[2.5rem] text-xs text-neutral-500">
                Compact + speaker
              </div>
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
              <div className="text-sm text-neutral-50 font-medium">$25</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={openSetup}>
            <Plus className="h-4 w-4" /> Add a tracker
          </Button>
          <Button variant="secondary" onClick={() => goToApp("find")}>
            View app
          </Button>
        </div>
      </div>
    </div>
  );

  const HomeTab = () => (
    <div className="px-5 pb-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">Your items</div>
        <Button size="sm" onClick={openSetup}>
          <Plus className="h-4 w-4" /> Add
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
            onQuickShare={() => {
              if (it.status === "shared_with_me") {
                showToast("Shared item");
                return;
              }
              setShareItemId(it.id);
              setTab("friends");
              showToast("Opened sharing");
            }}
            onPing={() => showToast("Ping sent")}
            onPlaySound={() => showToast("Playing soundâ€¦")}
          />
        ))}
      </div>
    </div>
  );

  const MapTab = () => (
    <div className="px-5 pb-4 space-y-3">
      <MapMock
        selectedId={selectedItemId}
        setSelectedId={setSelectedItemId}
        items={items}
        friendLocations={friendLocations}
        onOpenSelected={() => setDetailsOpen(true)}
      />

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
                    {it.place} Â· {it.lastSeen}
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

  const FindTab = () => (
    <div className="px-5 pb-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm text-neutral-200">Stick it. Track it. Forget it</div>
          <Button size="sm" onClick={openSetup}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        <MapMock
          selectedId={selectedItemId}
          setSelectedId={setSelectedItemId}
          items={items}
          friendLocations={friendLocations}
          onOpenSelected={() => setDetailsOpen(true)}
        />

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <button
              onClick={() => setFindSheetExpanded((current) => !current)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <div className="text-sm font-medium text-neutral-100">Items</div>
                <div className="text-xs text-neutral-500">
                  Pull up to browse all trackers and their latest activity.
                </div>
              </div>
              <div className="text-xs text-neutral-400">
                {findSheetExpanded ? "Collapse" : "Expand"}
              </div>
            </button>
            <div className="flex justify-center pb-2">
              <div className="h-1.5 w-10 rounded-full bg-neutral-800" />
            </div>
            <div
              className={cx(
                "space-y-2 overflow-y-auto px-4 pb-4 transition-all",
                findSheetExpanded ? "max-h-[320px]" : "max-h-[184px]"
              )}
            >
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    setSelectedItemId(it.id);
                    setDetailsOpen(true);
                  }}
                  className={cx(
                    "w-full rounded-2xl border border-neutral-900 bg-neutral-950/60 px-4 py-3 text-left",
                    it.id === selectedItemId ? "border-neutral-700 bg-neutral-900/80" : ""
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm text-neutral-100 truncate">
                        {it.name}
                        {it.status === "shared_with_me" && it.owner
                          ? ` (Owner: ${it.owner})`
                          : ""}
                      </div>
                      <div className="mt-1 text-xs text-neutral-500 truncate">
                        {it.place} Â· {it.lastSeen}
                      </div>
                    </div>
                    <Badge
                      className={cx(
                        "rounded-2xl",
                        it.status === "shared_with_me"
                          ? "bg-sky-500/15 text-sky-300"
                          : "bg-emerald-500/15 text-emerald-300"
                      )}
                    >
                      {it.status === "shared_with_me" ? "Shared" : "Mine"}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-neutral-200">Friends on the map</div>
            <div className="mt-3 space-y-2">
              {friendLocations.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-900 bg-neutral-950/60 px-4 py-3"
                >
                  <div>
                    <div className="text-sm text-neutral-100">{friend.name}</div>
                    <div className="text-xs text-neutral-500">
                      {friend.place} Â· {friend.lastSeen}
                    </div>
                  </div>
                  <div className="text-xs text-sky-300">{friend.handle}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const FriendsTab = () => {
    const it = shareItem;
    const followers = (it?.followers ?? []).map((fid: string) =>
      getFollowerProfile(fid)
    );

    return (
      <div className="px-5 pb-4 space-y-3">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <div className="text-sm font-medium text-neutral-100">
                Followers are assigned per item
              </div>
              <div className="text-xs text-neutral-500">
                Select the tracker you want to share with followers.
              </div>
            </div>
            <select
              value={shareItemId}
              onChange={(e) => setShareItemId(e.target.value)}
              className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100 outline-none focus:ring-2 focus:ring-white/20"
            >
              {ownedItems.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
            {it && (
              <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  Selected item
                </div>
                <div className="mt-1 text-base font-medium text-neutral-100">
                  {it.name}
                </div>
                <div className="text-xs text-neutral-500">
                  Only followers for this item can help locate it.
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-neutral-200">Followers</div>
                <div className="text-xs text-neutral-500">
                  People who can help locate your item
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="rounded-2xl bg-neutral-900 text-neutral-200">
                  {followers.length}
                </Badge>

                {/* Smaller font + cleaner label */}
                <Button
                  size="sm"
                  className="text-[11px] px-3"
                  onClick={() => setShareOpen(true)}
                  disabled={!it}
                >
                  <Plus className="h-4 w-4" /> Add followers
                </Button>
              </div>
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
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-200">Account</div>
              <div className="text-xs text-neutral-500">Demo User</div>
            </div>
            <Badge className="rounded-2xl bg-neutral-900 text-neutral-200">Demo</Badge>
          </div>

          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-sm text-neutral-200">Notifications</div>
              <div className="text-xs text-neutral-500">Alerts when items disconnect</div>
            </div>
            <Switch checked={notifOn} onChange={setNotifOn} />
          </div>

          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-sm text-neutral-200">Location</div>
              <div className="text-xs text-neutral-500">Required for tracking</div>
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
    <div className="h-full min-h-0 flex flex-col">
      <Header
        title={
          tab === "find"
            ? "Find"
            : tab === "friends"
            ? "Share"
            : "Settings"
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {tab === "find" && <FindTab />}
        {tab === "friends" && <FriendsTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );

  return (
    <PhoneFrame>
      {stage === "marketing" && <Marketing />}
      {stage === "setup" && (
        <div className="h-full overflow-y-auto overscroll-contain">
          <SetupFlow
            onFinish={addItemFromSetup}
            onCancel={exitSetup}
            initialCode={initialSetupCode}
            availableFollowers={allFollowers}
          />
        </div>
      )}
      {stage === "app" && <AppShell />}

      <Sheet
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={selectedItem?.name || "Item"}
        subtitle={`Model: ${selectedItem?.model} Â· Battery: ${selectedItem?.battery}%`}
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4">
            <div className="text-xs text-neutral-500">Last known location</div>
            <div className="mt-2 text-sm text-neutral-200">{selectedItem?.place}</div>
            <div className="text-xs text-neutral-600">
              Updated {selectedItem?.lastSeen}
              {selectedItem?.status === "shared_with_me" && selectedItem?.owner
                ? ` Â· Owner: ${selectedItem.owner}`
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
                if (selectedItem?.status === "shared_with_me") return;
                updateItem(selectedItem!.id, { isPublic: !selectedItem!.isPublic });
                showToast(selectedItem!.isPublic ? "Now private" : "Now public");
              }}
              disabled={selectedItem?.status === "shared_with_me"}
            >
              {selectedItem?.isPublic ? (
                <>
                  <Globe className="h-5 w-5" /> Public
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" /> Private
                </>
              )}
            </Button>
          </div>

          {selectedItem?.status !== "shared_with_me" && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setShareItemId(selectedItem!.id);
                setTab("friends");
                setDetailsOpen(false);
              }}
            >
              <Users className="h-4 w-4" /> Open Share tab
            </Button>
          )}

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

      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`Add followers â€” ${shareItem?.name || "item"}`}
      >
        <FollowerPicker
          people={allFollowers}
          selectedIds={shareItem?.followers ?? []}
          onToggle={(id) => {
            if (!shareItem) return;

            const currentFollowers = shareItem.followers;
            const isFollowing = currentFollowers.includes(id);

            updateItem(shareItem.id, {
              followers: isFollowing
                ? currentFollowers.filter((followerId: string) => followerId !== id)
                : [...currentFollowers, id],
            });
            showToast(isFollowing ? "Removed" : "Added");
          }}
          onCreateCustom={(profile) => {
            addCustomFollower(profile);
            if (!shareItem) return;

            if (shareItem.followers.includes(profile.id)) return;

            updateItem(shareItem.id, {
              followers: [...shareItem.followers, profile.id],
            });
            showToast("Added");
          }}
          title="Suggested followers"
        />
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => setShareOpen(false)}>
            Done
          </Button>
        </div>
      </Modal>

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

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Remove tracker?"
      >
        <div className="text-sm text-neutral-400">This removes it from your list.</div>
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



