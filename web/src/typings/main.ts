import type { Vehicle } from "./vehicle";

export interface OpenData {
    vehicles: Vehicle[];
}

export type ActiveCategory = 'all' | 'personal' | 'shared'