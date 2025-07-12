export type CleanVehicle = Omit<Vehicle, 'model'> & { model: string };

export interface Vehicle {
    type: 'personal' | 'shared';
    plate: string;
    fuelLevel: number;
    status: 'stored' | 'impound' | 'outside';
    model: string | number;
}