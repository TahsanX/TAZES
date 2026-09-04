import type { ComponentType } from "react";
import { HeroSection } from "./hero-section";
import { StatsCounters } from "./stats-counters";
import { TeacherSpeeches } from "./teacher-speeches";
import { AchievementStrip } from "./achievement-strip";
import { CommitteePreview } from "./committee-preview";

export type SectionConfig = {
  heading?: string;
  subheading?: string;
  itemLimit?: number;
  autoplayMs?: number;
};

/**
 * Maps a HomeSection.key to its rendering component. Unknown keys resolve to
 * undefined and are skipped by the caller, so a stray or renamed key in the
 * database can never crash the home page.
 */
export const SECTION_COMPONENTS: Record<string, ComponentType<{ config: SectionConfig }>> = {
  HERO: HeroSection,
  STATS: StatsCounters,
  SPEECHES: TeacherSpeeches,
  ACHIEVEMENTS: AchievementStrip,
  COMMITTEE: CommitteePreview,
};
