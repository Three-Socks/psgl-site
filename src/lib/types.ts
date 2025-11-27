import type { Component } from 'svelte';

export enum Platform {
  PC = 'PC',
  PS = 'PlayStation'
}

export enum Category {
  F1 = 'F1',
  GT = 'GT'
}

export interface League {
  name: string;
  description: string;
  image: string;
  signupsOpen: boolean;
}

export enum ViewType {
  DRIVERS = 'Drivers Standings',
  CONSTRUCTORS = 'Constructors',
  RESULTS = 'Round Results'
}

export interface Tier {
  id: string;
  name: string;
  platform: Platform;
  category: Category;
  isLiveStreamed: boolean;
  images: {
    [ViewType.DRIVERS]: string;
    [ViewType.CONSTRUCTORS]: string;
    [ViewType.RESULTS]: string;
  };
}

export interface StatItem {
  label: string;
  value: string;
  icon: Component;
}

export interface Affiliate {
  name: string;
  link: string;
  partner?: boolean;
  logoPath?: string;
  description?: string;
  code?: string;
  discount?: string;
}

export interface RaceRound {
  date: string;
  flag: string;
  name: string;
  number: string;
  race_confirm_sent?: boolean;
  schedule_date?: string;
  short_name?: string;
  countryCode?: string;
}

export interface ScheduleTier {
  name: string;
  time: string;
  comm_confirm?: boolean;
}

export interface CalendarConfig {
  id: string;
  name: string;
  platform: string;
  tiers: ScheduleTier[];
  rounds: RaceRound[];
}
