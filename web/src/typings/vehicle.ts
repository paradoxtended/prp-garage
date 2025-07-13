export type CleanVehicle = Omit<Vehicle, 'model'> & { model: string };

export interface Vehicle {
    type: 'personal' | 'shared';
    plate: string;
    status: 'stored' | 'impound' | 'outside';
    model: string | number;
    vehType?: string;
    data: {
        fuelLevel: number;
        engine: number;
        body: number;
    }
}