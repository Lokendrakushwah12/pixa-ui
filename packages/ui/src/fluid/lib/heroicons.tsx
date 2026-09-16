"use client";

import type { ComponentType, SVGProps } from "react";
import {
  AdjustmentsHorizontalIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowTurnDownLeftIcon,
  ArrowTurnDownRightIcon,
  ArrowUpIcon,
  ArrowUturnLeftIcon,
  ArrowsPointingOutIcon,
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChatBubbleOvalLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ClockIcon,
  Cog6ToothIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  EyeDropperIcon,
  FolderIcon,
  ForwardIcon,
  GlobeAltIcon,
  HeartIcon,
  HomeIcon,
  InboxIcon,
  LightBulbIcon,
  LinkIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PaintBrushIcon,
  PauseIcon,
  PencilIcon,
  PhotoIcon,
  PlayIcon,
  PlusIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  StarIcon,
  SunIcon,
  SwatchIcon,
  UserIcon,
  UsersIcon,
  ViewColumnsIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import type { IconComponent, IconComponentProps, IconName } from "../../fluid/lib/icon-context";

function adapt(Hero: ComponentType<SVGProps<SVGSVGElement>>): IconComponent {
  function Icon({ size = 16, strokeWidth: _strokeWidth, className }: IconComponentProps) {
    return (
      <Hero
        width={size}
        height={size}
        className={className}
        aria-hidden
      />
    );
  }
  Icon.displayName = `Hero(${Hero.displayName ?? Hero.name ?? "Icon"})`;
  return Icon;
}

function DotIcon({ size = 16, className }: IconComponentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="8" cy="8" r="3" fill="currentColor" />
    </svg>
  );
}

function CircleIcon({ size = 16, className }: IconComponentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const heroicons: Record<IconName, IconComponent> = {
  "chevron-right": adapt(ChevronRightIcon),
  "chevron-left": adapt(ChevronLeftIcon),
  "chevron-down": adapt(ChevronDownIcon),
  x: adapt(XMarkIcon),
  copy: adapt(DocumentDuplicateIcon),
  menu: adapt(Bars3Icon),
  dot: DotIcon,
  monitor: adapt(ComputerDesktopIcon),
  sun: adapt(SunIcon),
  moon: adapt(MoonIcon),
  "rectangle-horizontal": adapt(RectangleGroupIcon),
  circle: CircleIcon,
  "square-library": adapt(RectangleStackIcon),
  clock: adapt(ClockIcon),
  star: adapt(StarIcon),
  settings: adapt(Cog6ToothIcon),
  plus: adapt(PlusIcon),
  "arrow-left": adapt(ArrowLeftIcon),
  "arrow-right": adapt(ArrowRightIcon),
  "arrow-up": adapt(ArrowUpIcon),
  "arrow-down": adapt(ArrowDownIcon),
  search: adapt(MagnifyingGlassIcon),
  loader: adapt(ArrowPathIcon),
  users: adapt(UsersIcon),
  lock: adapt(LockClosedIcon),
  mail: adapt(EnvelopeIcon),
  bell: adapt(BellIcon),
  shield: adapt(ShieldCheckIcon),
  palette: adapt(SwatchIcon),
  lightbulb: adapt(LightBulbIcon),
  rocket: adapt(RocketLaunchIcon),
  heart: adapt(HeartIcon),
  paintbrush: adapt(PaintBrushIcon),
  brain: adapt(CpuChipIcon),
  globe: adapt(GlobeAltIcon),
  user: adapt(UserIcon),
  image: adapt(PhotoIcon),
  link: adapt(LinkIcon),
  check: adapt(CheckIcon),
  "rotate-ccw": adapt(ArrowUturnLeftIcon),
  play: adapt(PlayIcon),
  pause: adapt(PauseIcon),
  pipette: adapt(EyeDropperIcon),
  home: adapt(HomeIcon),
  "message-circle": adapt(ChatBubbleOvalLeftIcon),
  inbox: adapt(InboxIcon),
  pencil: adapt(PencilIcon),
  scaling: adapt(ArrowsPointingOutIcon),
  "skip-forward": adapt(ForwardIcon),
  "corner-down-right": adapt(ArrowTurnDownRightIcon),
  "corner-down-left": adapt(ArrowTurnDownLeftIcon),
  "panel-left": adapt(ViewColumnsIcon),
  "panel-right": adapt(ViewColumnsIcon),
  "chevrons-up-down": adapt(ChevronUpDownIcon),
  "more-horizontal": adapt(EllipsisHorizontalIcon),
  "more-vertical": adapt(EllipsisVerticalIcon),
  calendar: adapt(CalendarIcon),
  folder: adapt(FolderIcon),
  "sliders-horizontal": adapt(AdjustmentsHorizontalIcon),
};

export { heroicons };
