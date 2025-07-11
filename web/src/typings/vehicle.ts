export interface Vehicle {
    type: 'personal' | 'shared';
    plate: string;
    fuelLevel: number;
    stored: boolean;
    model: string | number;
}