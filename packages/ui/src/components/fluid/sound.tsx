"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SoundName =
  | "press"
  | "toggle-on"
  | "toggle-off"
  | "open"
  | "close"
  | "select"
  | "type"
  | "success"
  | "error";

interface Tone {
  from: number;
  to: number;
  duration: number;
  gain: number;
  type: OscillatorType;
  layer?: Omit<Tone, "layer">;
}

const tones: Record<SoundName, Tone> = {
  press: { from: 200, to: 160, duration: 0.035, gain: 0.05, type: "sine" },
  "toggle-on": { from: 420, to: 620, duration: 0.06, gain: 0.045, type: "sine" },
  "toggle-off": { from: 620, to: 420, duration: 0.06, gain: 0.045, type: "sine" },
  open: { from: 300, to: 480, duration: 0.07, gain: 0.04, type: "sine" },
  close: { from: 480, to: 300, duration: 0.06, gain: 0.035, type: "sine" },
  select: { from: 520, to: 520, duration: 0.025, gain: 0.04, type: "triangle" },
  type: { from: 700, to: 700, duration: 0.018, gain: 0.025, type: "triangle" },
  success: {
    from: 520,
    to: 660,
    duration: 0.09,
    gain: 0.045,
    type: "sine",
    layer: { from: 780, to: 990, duration: 0.09, gain: 0.02, type: "sine" },
  },
  error: { from: 180, to: 120, duration: 0.14, gain: 0.05, type: "sawtooth" },
};

interface SoundContextValue {
  play: (name: SoundName) => void;
  enabled: boolean;
  setEnabled: (on: boolean) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within <SoundEffects>");
  return ctx;
}

function useSoundMaybe(): SoundContextValue | null {
  return useContext(SoundContext);
}

const STORAGE_KEY = "fluid-ui:sound";

function soundFor(el: HTMLElement): SoundName | null {
  const explicit = el.closest<HTMLElement>("[data-sound]")?.dataset.sound;
  if (explicit) return explicit === "none" ? null : (explicit as SoundName);

  const control = el.closest<HTMLElement>(
    [
      "button",
      "[role=button]",
      "[role=switch]",
      "[role=checkbox]",
      "[role=radio]",
      "[role=menuitem]",
      "[role=menuitemcheckbox]",
      "[role=menuitemradio]",
      "[role=option]",
      "a[href]",
      "input",
      "[data-slot]",
    ].join(", ")
  );
  if (!control) return null;

  const role = control.getAttribute("role");

  if (role === "switch" || role === "checkbox" || role === "radio") {
    return control.getAttribute("aria-checked") === "true" ? "toggle-off" : "toggle-on";
  }
  if (
    role === "menuitem" ||
    role === "menuitemcheckbox" ||
    role === "menuitemradio" ||
    role === "option"
  ) {
    return "select";
  }

  if (control.tagName === "INPUT") {
    const input = control as HTMLInputElement;
    if (input.type === "checkbox" || input.type === "radio") {
      return input.checked ? "toggle-off" : "toggle-on";
    }
    return null;
  }

  const slot = control.dataset.slot ?? "";
  if (slot.includes("switch") || slot.includes("checkbox") || slot.includes("radio")) {
    return control.getAttribute("aria-checked") === "true" ? "toggle-off" : "toggle-on";
  }
  if (slot.includes("trigger")) {
    return control.getAttribute("data-state") === "open" ? "close" : "open";
  }
  if (slot.includes("item") || slot.includes("option")) return "select";

  if (control.tagName === "BUTTON" || role === "button" || control.tagName === "A") {
    return "press";
  }
  return null;
}

function SoundEffects({
  children,
  defaultEnabled = false,
  tones: toneOverrides,
}: {
  children: ReactNode;
  defaultEnabled?: boolean;
  tones?: Partial<Record<SoundName, Tone>>;
}) {
  const [enabled, setEnabledState] = useState(defaultEnabled);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) setEnabledState(saved === "on");
    } catch {
      // Keep the default; a missing preference is not an error.
    }
  }, []);

  const setEnabled = useCallback((on: boolean) => {
    setEnabledState(on);
    try {
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      // Preference just won't persist.
    }
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;

      let audio = ctxRef.current;
      if (!audio) {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) return;
        audio = new Ctor();
        ctxRef.current = audio;
      }
      if (audio.state === "suspended") void audio.resume();

      const spec = { ...tones, ...toneOverrides }[name];
      if (!spec) return;

      const voice = (t: Omit<Tone, "layer">) => {
        const osc = audio!.createOscillator();
        const gain = audio!.createGain();
        const now = audio!.currentTime;

        osc.type = t.type;
        osc.frequency.setValueAtTime(t.from, now);
        if (t.to !== t.from) {
          osc.frequency.exponentialRampToValueAtTime(t.to, now + t.duration);
        }

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(t.gain, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t.duration);

        osc.connect(gain).connect(audio!.destination);
        osc.start(now);
        osc.stop(now + t.duration + 0.02);
      };

      voice(spec);
      if (spec.layer) voice(spec.layer);
    },
    [enabled, toneOverrides]
  );

  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const name = soundFor(target);
      if (name) play(name);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const tag = target.tagName;
      const isTextEntry =
        (tag === "INPUT" && !["checkbox", "radio", "button", "submit"].includes(
          (target as HTMLInputElement).type
        )) ||
        tag === "TEXTAREA" ||
        target.isContentEditable;

      if (isTextEntry) {
        if (e.key.length === 1 || e.key === "Backspace") play("type");
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        const name = soundFor(target);
        if (name) play(name);
      }
      if (e.key === "Escape") play("close");
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [enabled, play]);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  const value = useMemo(
    () => ({ play, enabled, setEnabled }),
    [play, enabled, setEnabled]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export { SoundEffects, useSound, useSoundMaybe, tones };
export type { SoundName, Tone };
