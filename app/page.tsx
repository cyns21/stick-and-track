"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  Users,
  Settings,
  ScanLine,
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
 * Stick 'n Track - Demo Prototype
 * Self-contained (Tailwind + lucide-react only)
 *
 * Works as a Next.js App Router page (app/page.tsx)
 * Deploys cleanly to Vercel
 * Future NFC deep-link ready: /?setup=1&code=STICK-1234
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

function StarAccent({
  className = "",
  tone = "solid",
}: {
  className?: string;
  tone?: "solid" | "outline" | "ink";
}) {
  const points = "50,4 61,36 95,36 68,56 79,90 50,69 21,90 32,56 5,36 39,36";

  if (tone === "outline") {
    return (
      <svg
        viewBox="-8 -8 116 116"
        className={className}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="8"
        aria-hidden="true"
      >
        <polygon points={points} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="-8 -8 116 116"
      className={className}
      fill={tone === "ink" ? "#090909" : "var(--accent)"}
      aria-hidden="true"
    >
      <polygon points={points} />
    </svg>
  );
}

function CornerFrame({ className = "" }: { className?: string }) {
  return (
    <div className={cx("pointer-events-none absolute inset-0", className)} aria-hidden="true">
      <div className="absolute left-0 top-0 h-12 w-12 border-l-[3px] border-t-[3px] border-[var(--accent)]" />
      <div className="absolute right-0 top-0 h-12 w-12 border-r-[3px] border-t-[3px] border-[var(--accent)]" />
      <div className="absolute left-0 bottom-0 h-12 w-12 border-b-[3px] border-l-[3px] border-[var(--accent)]" />
      <div className="absolute right-0 bottom-0 h-12 w-12 border-b-[3px] border-r-[3px] border-[var(--accent)]" />
    </div>
  );
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
    "inline-flex items-center justify-center gap-2 rounded-[1.1rem] border px-4 text-[0.95rem] font-semibold uppercase tracking-[0.08em] transition select-none active:translate-y-px disabled:cursor-not-allowed";
  const variants = {
    primary:
      "border-[var(--accent-dark)]/55 bg-[var(--accent)] text-[#fff7f0] shadow-[2px_2px_0_0_rgba(0,0,0,0.12)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,0.12)] disabled:border-black/25 disabled:bg-black/25 disabled:text-white/70 disabled:shadow-none",
    secondary:
      "border-black/50 bg-[var(--paper-strong)] text-black shadow-[2px_2px_0_0_rgba(215,24,24,0.12)] hover:bg-white disabled:opacity-60 disabled:shadow-none",
    ghost:
      "border-black/15 bg-transparent text-black hover:bg-black/5",
  };
  const sizes = {
    sm: "h-10 px-3 text-[0.82rem]",
    md: "h-11 px-4 text-[0.92rem]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(base, "display-type", variants[variant], sizes[size], className)}
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
        "w-full rounded-[1.15rem] border border-black/50 bg-[var(--paper-strong)] px-4 py-2.5 text-[1rem] text-black placeholder:text-black/35 outline-none focus:ring-2 focus:ring-[var(--accent)]/25",
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
        "inline-flex items-center rounded-full border border-black/15 px-2.5 py-1 text-[0.78rem] font-semibold uppercase tracking-[0.1em]",
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
        "paper-panel rounded-[1.8rem] border border-black/55 text-black",
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
        "h-8 w-14 rounded-full border border-black/55 p-1 transition",
        checked ? "bg-[var(--accent)]" : "bg-black"
      )}
      aria-label="switch"
    >
      <div
        className={cx(
          "h-5.5 w-5.5 rounded-full transition",
          checked ? "bg-[var(--paper-strong)] translate-x-6" : "bg-[var(--paper-strong)] translate-x-0"
        )}
      />
    </button>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full border border-black/55 bg-black/10">
      <div
        className="h-full bg-[var(--accent)]"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="poster-grid relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[var(--background)] p-3 text-black sm:p-6">
      <StarAccent className="pointer-events-none absolute left-3 top-5 h-28 w-28 opacity-70 sm:left-6" tone="outline" />
      <StarAccent className="pointer-events-none absolute bottom-8 right-3 h-24 w-24 opacity-80 sm:right-6" tone="ink" />
      <div className="w-[390px] max-w-full">
        <div className="relative flex h-[min(100dvh-1.5rem,844px)] flex-col overflow-hidden rounded-[2.35rem] border border-black/60 bg-[var(--paper-strong)] shadow-[0_26px_70px_rgba(0,0,0,0.22)] sm:h-[min(100dvh-3rem,844px)]">
          <div className="relative flex h-11 shrink-0 items-center justify-between border-b border-black/50 px-5">
            <div className="display-type text-[0.82rem] tracking-[0.18em] text-black/70">
              Stick 'n Track
            </div>
            <div className="rounded-full border border-black/15 bg-[var(--accent)] px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white">
              Demo
            </div>
          </div>
          <div className="min-h-0 flex-1 bg-[var(--background)]">{children}</div>
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
    <div className="flex items-center justify-between rounded-[1.25rem] border border-black/55 bg-[var(--paper-strong)] px-4 py-3 shadow-[4px_4px_0_0_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-black/55 bg-[var(--accent)]">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="text-[1rem] font-medium text-black">{label}</div>
      </div>
      <div className="text-xs uppercase tracking-[0.12em] text-black/55">{right}</div>
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
        <div className="display-type text-xs tracking-[0.16em] text-black/50">
          Search by name or username
        </div>
        <Input
          value={query}
          onChange={setQuery}
          placeholder="@alex or Alex"
        />
      </div>

      <div className="rounded-[1.35rem] border border-black/70 bg-[var(--paper-strong)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="display-type text-xs tracking-[0.16em] text-black/55">
            {title}
          </div>
          <Badge className="bg-black text-[var(--paper-strong)]">
            {selectedIds.length} added
          </Badge>
        </div>

        {customFollower && !hasCustomMatch && (
          <div className="mt-3 rounded-[1.15rem] border border-black/65 bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[1rem] font-medium text-black">{customFollower.name}</div>
                <div className="text-xs uppercase tracking-[0.12em] text-black/45">
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
                  className="flex items-center justify-between rounded-[1.15rem] border border-black/65 bg-white px-4 py-3"
                >
                  <div>
                    <div className="text-[1rem] font-medium text-black">{friend.name}</div>
                    <div className="text-xs uppercase tracking-[0.12em] text-black/45">
                      {friend.handle}
                    </div>
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
          <div className="mt-3 text-sm text-black/55">{emptyLabel}</div>
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
        "flex flex-col items-center gap-1 px-2 py-2 transition",
        tab === id
          ? "text-[var(--accent)]"
          : "text-black/50 hover:text-black"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="tab-type text-[0.72rem] leading-none">{label}</span>
    </button>
  );

  return (
    <div className="shrink-0 border-t border-black/65 bg-[var(--paper)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--paper)]/90">
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
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-[420px] -translate-x-1/2 -translate-y-1/2">
        <div className="paper-panel relative max-h-[min(84dvh,720px)] overflow-y-auto rounded-[2rem] border-2 border-black/75 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
          <CornerFrame className="opacity-90" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="display-type text-lg text-black">{title}</div>
            </div>
            <button
              className="h-9 w-9 rounded-[1rem] border border-black/70 bg-[var(--paper-strong)] transition hover:bg-white"
              onClick={onClose}
              aria-label="close"
            >
              <span className="display-type text-sm text-black">X</span>
            </button>
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
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute left-0 right-0 bottom-0">
        <div className="paper-panel rounded-t-[2rem] border-2 border-b-0 border-black/75 p-4 shadow-[0_-16px_40px_rgba(0,0,0,0.2)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="display-type text-lg text-black truncate">
                {title}
              </div>
              {subtitle && (
                <div className="mt-1 text-sm uppercase tracking-[0.12em] text-black/50 truncate">
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
        color: isSharedWithMe ? "#090909" : "#d71818",
        weight: isSel ? 2 : 1,
        fillOpacity: 0.2,
        opacity: 0.9,
      }).addTo(layer);

      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius: isSel ? 10 : 8,
        color: "#fff7f0",
        weight: isSel ? 2 : 1.5,
        fillColor: isSharedWithMe ? "#090909" : "#d71818",
        fillOpacity: 0.95,
      }).addTo(layer);
      const ownerLine =
        it.status === "shared_with_me" && it.owner
          ? `<div style="margin-top:2px;">Owner: ${escapeHtml(it.owner)}</div>`
          : "";
      const popupHtml = `<div style="
        min-width: 150px;
        font-family: var(--font-app-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        color: #111827;
        line-height: 1.35;
      ">
        <div style="font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;">${escapeHtml(it.name)}</div>
        <div style="font-size:12px; margin-top:2px; text-transform: uppercase; letter-spacing: 0.05em;">${escapeHtml(it.place)}</div>
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
            border: 1px solid rgba(9,9,9,0.5);
            background: rgba(255, 252, 246, 0.96);
            color: #090909;
            border-radius: 9999px;
            padding: 2px 8px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            white-space: nowrap;
            box-shadow: 2px 2px 0 rgba(215,24,24,0.12);
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
    <div className="paper-panel relative z-0 overflow-hidden rounded-[1.9rem] border border-black/55">
      <div className="flex items-center justify-between border-b border-black/50 p-4">
        <div>
          <div className="display-type text-sm text-black">Campus Map</div>
          <div className="text-xs uppercase tracking-[0.12em] text-black/55">
            Map of Davis with demo item markers
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-[1rem]"
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
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-black/65 bg-[var(--paper-strong)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/70 backdrop-blur">
          Drag to pan, pinch to zoom
        </div>
      </div>

      <div className="p-4">
        <div className="rounded-[1.25rem] border border-black/45 bg-white/70 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="tab-type truncate text-[0.82rem] tracking-[0.03em] text-black/90">
                {selected.name}
              </div>
              <div className="text-[11px] uppercase tracking-[0.1em] text-black/55 truncate">
                {selected.place} / {selected.lastSeen}
                {selected.status === "shared_with_me" && selected.owner
                  ? ` / Owner: ${selected.owner}`
                  : ""}
              </div>
            </div>
            <button
              onClick={onOpenSelected}
              className="flex h-8 w-8 items-center justify-center rounded-[0.9rem] border border-black/70 bg-black transition hover:bg-black/85"
              aria-label="details"
            >
              <Info className="h-4 w-4 text-white" />
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
                  "tab-type rounded-full border px-3 py-1 text-[0.68rem] tracking-[0.03em] transition",
                  isSel
                    ? "border-black/45 bg-[var(--accent)] text-white"
                    : "border-black/35 bg-[var(--paper-strong)] text-black/65 hover:bg-white"
                )}
              >
                {it.name}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs uppercase tracking-[0.1em] text-black/55">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> My items
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-black" /> Shared with me
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
          <div className="rounded-[1.25rem] border border-black/65 bg-white/75 p-4 space-y-2">
            <div className="display-type text-xs tracking-[0.15em] text-black/50">
              Setup code
            </div>
            <Input value={code} onChange={setCode} />
            <div className="text-xs uppercase tracking-[0.1em] text-black/50">
              Demo mode: any code works
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Name your item",
      desc: "Choose a label so it's easy to spot.",
      content: (
        <div className="space-y-3">
          <div className="rounded-[1.25rem] border border-black/65 bg-white/75 p-4 space-y-2">
            <div className="display-type text-xs tracking-[0.15em] text-black/50">
              Item name
            </div>
            <Input value={name} onChange={setName} placeholder="Keys, Bike, Bottle..." />
          </div>

          <div className="rounded-[1.25rem] border border-black/65 bg-white/75 p-4 space-y-2">
            <div className="display-type text-xs tracking-[0.15em] text-black/50">
              Model
            </div>
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
          <div className="flex items-center justify-between rounded-[1.25rem] border border-black/65 bg-white/75 p-4">
            <div className="min-w-0">
              <div className="display-type text-sm text-black">Public</div>
              <div className="text-xs uppercase tracking-[0.1em] text-black/50">
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
            <div className="rounded-[1.25rem] border border-dashed border-black/60 bg-white/55 p-4">
              <div className="display-type text-sm text-black">Private for now</div>
              <div className="mt-1 text-xs uppercase tracking-[0.1em] text-black/50">
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
      <div className="relative overflow-hidden rounded-[2rem] border-2 border-black/75 bg-[var(--paper)] px-5 py-5">
        <StarAccent
          className="pointer-events-none absolute right-4 top-4 h-16 w-16 opacity-85"
          tone="outline"
        />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="display-type text-xs tracking-[0.18em] text-black/50">
              Setup
            </div>
            <div className="poster-kicker text-[2.35rem] text-black">
              {steps[step].title}
            </div>
          </div>

          <div className="w-[64px]" />
        </div>
        <div className="mt-3 text-sm uppercase tracking-[0.12em] text-black/55">
          {steps[step].desc}
        </div>
      </div>

      <Progress value={pct} />

      <Card className="relative overflow-hidden">
        <CardContent className="relative p-4">{steps[step].content}</CardContent>
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

  const renderHeader = ({ title }: { title: string }) => (
    <div className="px-5 pt-5 pb-3">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-black/50 bg-[var(--paper)] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <StarAccent className="h-8 w-8 shrink-0" />
              <div className="tab-type text-[1.9rem] leading-none text-black">{title}</div>
            </div>
            {(stage === "marketing" || (stage === "app" && tab === "find")) && (
              <div className="mt-1 pl-11 text-sm uppercase tracking-[0.14em] text-black/55">
                Stick it. Track it. Forget it.
              </div>
            )}
          </div>
          {stage === "app" && tab === "find" && (
            <Button size="sm" onClick={openSetup}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderMarketing = () => (
    <div className="h-full overflow-y-auto overscroll-contain">
      <div className="space-y-4 p-5">
        <div className="relative overflow-hidden rounded-[2rem] border border-black/55 bg-[var(--paper)] p-6">
          <StarAccent
            className="pointer-events-none absolute right-4 top-4 h-20 w-20 opacity-85"
            tone="outline"
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-black/70 bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--paper-strong)]">
            <CheckCircle2 className="h-4 w-4" /> Demo storefront
          </div>
          <div className="mt-5 space-y-4">
            <div className="display-type poster-shadow text-[3rem] leading-[0.92] text-[var(--accent)]">
              Stick 'n Track
            </div>
            <div className="poster-kicker text-[3.35rem] text-black">
              Stick it.
              <br />
              Track it.
              <br />
              Forget it.
            </div>
            <div className="max-w-[16rem] text-sm uppercase tracking-[0.14em] text-black/55">
              Discreet tracking for everyday things that should never slow you down.
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Card className="bg-white/80">
              <CardHeader>
                <div className="display-type text-sm text-black">Slim</div>
                <div className="min-h-[2.5rem] text-xs uppercase tracking-[0.1em] text-black/50">
                  Ultra-thin, silent, sticker-first
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-black/65">
                  <VolumeX className="h-4 w-4 text-[var(--accent)]" /> No speaker
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-black/65">
                  <BatteryFull className="h-4 w-4 text-[var(--accent)]" /> 2+ years battery
                </div>
                <div className="text-xs uppercase tracking-[0.1em] text-black/55">
                  Ideal for wallets, water bottles, books
                </div>
                <div className="display-type text-sm text-black">$15</div>
              </CardContent>
            </Card>

            <Card className="shadow-[0_10px_20px_rgba(0,0,0,0.10)]">
              <CardHeader>
                <div className="display-type text-sm text-[var(--accent-dark)]">Pro</div>
                <div className="min-h-[2.5rem] text-xs uppercase tracking-[0.1em] text-black/70">
                  Compact + speaker
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-black/75">
                  <Volume2 className="h-4 w-4 text-[var(--accent)]" /> Sound alerts
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-black/75">
                  <BatteryFull className="h-4 w-4 text-[var(--accent)]" /> 2+ years battery
                </div>
                <div className="text-xs uppercase tracking-[0.1em] text-black/65">
                  Best for keys, backpacks, laptops
                </div>
                <div className="display-type text-sm text-[var(--accent-dark)]">$25</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={openSetup} className="text-[0.76rem] leading-tight">
              <Plus className="h-4 w-4" /> Add a tracker
            </Button>
            <Button
              variant="secondary"
              onClick={() => goToApp("find")}
              className="text-[0.78rem] leading-tight"
            >
              View app
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFindTab = () => (
    <div className="px-5 pb-4">
      <div className="space-y-3">
        <MapMock
          selectedId={selectedItemId}
          setSelectedId={setSelectedItemId}
          items={items}
          friendLocations={friendLocations}
          onOpenSelected={() => setDetailsOpen(true)}
        />

        <Card className="relative z-20 overflow-hidden">
          <CardContent className="p-0">
            <button
              onClick={() => setFindSheetExpanded((current) => !current)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <div className="display-type text-sm text-black">Items</div>
                <div className="text-xs uppercase tracking-[0.1em] text-black/50">
                  Pull up to browse all trackers and their latest activity.
                </div>
              </div>
              <div className="display-type text-xs text-black/60">
                {findSheetExpanded ? "Collapse" : "Expand"}
              </div>
            </button>
            <div className="flex justify-center pb-2">
              <div className="h-1.5 w-10 rounded-full bg-black/20" />
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
                    "w-full rounded-[1.2rem] border bg-white/75 px-4 py-3 text-left",
                    it.id === selectedItemId
                      ? "border-black/55 shadow-[2px_2px_0_0_rgba(215,24,24,0.10)]"
                      : "border-black/45"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="display-type truncate text-sm text-black">
                        {it.name}
                        {it.status === "shared_with_me" && it.owner
                          ? ` (Owner: ${it.owner})`
                          : ""}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-[0.1em] text-black/50 truncate">
                        {it.place} / {it.lastSeen}
                      </div>
                    </div>
                    <Badge
                      className={cx(
                        it.status === "shared_with_me"
                          ? "bg-black text-[var(--paper-strong)]"
                          : "bg-[var(--accent)] text-white"
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

      </div>
    </div>
  );

  const renderFriendsTab = () => {
    const it = shareItem;
    const followers = (it?.followers ?? []).map((fid: string) =>
      getFollowerProfile(fid)
    );

    return (
      <div className="px-5 pb-4 space-y-3">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <div className="display-type text-sm text-black">
                Followers are assigned per item
              </div>
              <div className="text-xs uppercase tracking-[0.1em] text-black/50">
                Select the tracker you want to share with followers.
              </div>
            </div>
            <select
              value={shareItemId}
              onChange={(e) => setShareItemId(e.target.value)}
              className="w-full rounded-[1.15rem] border border-black/65 bg-[var(--paper-strong)] px-3 py-2 text-black outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
            >
              {ownedItems.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
            {it && (
              <div className="rounded-[1.2rem] border border-black/65 bg-white/75 px-4 py-3">
                <div className="display-type text-xs tracking-[0.18em] text-black/50">
                  Selected item
                </div>
                <div className="mt-1 display-type text-base text-black">{it.name}</div>
                <div className="text-xs uppercase tracking-[0.1em] text-black/50">
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
                <div className="display-type text-sm text-black">Followers</div>
                <div className="text-xs uppercase tracking-[0.1em] text-black/50">
                  People who can help locate your item
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-black text-[var(--paper-strong)]">
                  {followers.length}
                </Badge>

                {/* Smaller font + cleaner label */}
                <Button
                  size="sm"
                  className="border border-black/25 px-3 text-[0.52rem] tracking-[0.02em] shadow-[2px_2px_0_0_rgba(215,24,24,0.08)]"
                  onClick={() => setShareOpen(true)}
                  disabled={!it}
                >
                  <Plus className="h-4 w-4" />
                  <span className="translate-y-[2px]">Add followers</span>
                </Button>
              </div>
            </div>

            {followers.length ? (
              <div className="space-y-2">
                {followers.map((f: any) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-[1.2rem] border border-black/65 bg-white/75 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-black">{f.name}</div>
                      <div className="text-xs uppercase tracking-[0.1em] text-black/45">
                        {f.handle}
                      </div>
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
              <div className="text-sm text-black/55">No followers yet.</div>
            )}

            <div className="flex items-center justify-between rounded-[1.2rem] border border-black/65 bg-white/75 p-4">
              <div>
                <div className="display-type text-sm text-black">Public</div>
                <div className="text-xs uppercase tracking-[0.1em] text-black/50">
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

        <Card className="shadow-[0_10px_20px_rgba(0,0,0,0.10)]">
          <CardContent className="p-4 space-y-2">
            <div className="display-type text-sm text-[var(--accent-dark)]">Share link</div>
            <div className="text-xs uppercase tracking-[0.1em] text-black/65">
              Demo link for follower access.
            </div>
            <div className="overflow-hidden rounded-[1.1rem] border border-black/20 bg-white/65 px-3 py-2 font-mono text-xs text-black text-ellipsis">
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

  const renderSettingsTab = () => (
    <div className="px-5 pb-4 space-y-3">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="display-type text-sm text-black">Account</div>
              <div className="text-xs uppercase tracking-[0.1em] text-black/50">
                Demo User
              </div>
            </div>
            <Badge className="bg-black text-[var(--paper-strong)]">Demo</Badge>
          </div>

          <div className="flex items-center justify-between rounded-[1.2rem] border border-black/65 bg-white/75 p-4">
            <div className="min-w-0">
              <div className="display-type text-sm text-black">Notifications</div>
              <div className="text-xs uppercase tracking-[0.1em] text-black/50">
                Alerts when items disconnect
              </div>
            </div>
            <Switch checked={notifOn} onChange={setNotifOn} />
          </div>

          <div className="flex items-center justify-between rounded-[1.2rem] border border-black/65 bg-white/75 p-4">
            <div className="min-w-0">
              <div className="display-type text-sm text-black">Location</div>
              <div className="text-xs uppercase tracking-[0.1em] text-black/50">
                Required for tracking
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

  const renderAppShell = () => (
    <div className="h-full min-h-0 flex flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {renderHeader({
          title={
            tab === "find"
              ? "Find"
              : tab === "friends"
              ? "Share"
              : "Settings"
          },
        })}
        {tab === "find" && renderFindTab()}
        {tab === "friends" && renderFriendsTab()}
        {tab === "settings" && renderSettingsTab()}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );

  return (
    <PhoneFrame>
      {stage === "marketing" && renderMarketing()}
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
      {stage === "app" && renderAppShell()}

      <Sheet
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={selectedItem?.name || "Item"}
        subtitle={`Model: ${selectedItem?.model} - Battery: ${selectedItem?.battery}%`}
      >
        <div className="space-y-3">
          <div className="rounded-[1.2rem] border border-black/65 bg-white/75 p-4">
            <div className="display-type text-xs tracking-[0.16em] text-black/50">
              Last known location
            </div>
            <div className="mt-2 display-type text-sm text-black">{selectedItem?.place}</div>
            <div className="text-xs uppercase tracking-[0.1em] text-black/50">
              Updated {selectedItem?.lastSeen}
              {selectedItem?.status === "shared_with_me" && selectedItem?.owner
                ? ` / Owner: ${selectedItem.owner}`
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
            <div className="text-xs uppercase tracking-[0.1em] text-black/50">
              This item is shared with you. Only the owner can remove it.
            </div>
          )}
        </div>
      </Sheet>

      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`Add followers - ${shareItem?.name || "item"}`}
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
          <div className="display-type text-xs tracking-[0.14em] text-black/50">Name</div>
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
        <div className="text-sm uppercase tracking-[0.1em] text-black/55">
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

      {toast && (
        <div className="fixed left-1/2 bottom-24 z-50 -translate-x-1/2">
          <div className="rounded-full border border-black/65 bg-[var(--accent)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.18)]">
            {toast}
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}

