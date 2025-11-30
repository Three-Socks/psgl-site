import type { Component } from 'svelte';

export enum Platform {
  PC = 'PC',
  PS = 'PS'
}

export interface League {
  name: string;
  description: string;
  image: string;
  imageWebp?: string;
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
  time?: string;
  comm_confirm?: boolean;
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

export interface CalendarTier {
  tiers_id: Tier;
}

export interface CalendarData {
  name: string;
  tiers: CalendarTier[];
  rounds: RaceRound[];
}
