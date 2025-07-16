export type CleanVehicle = Omit<Vehicle, 'model' | 'image'> & { model: string, image: string };

export interface Vehicle {
    type: 'personal' | 'shared';
    plate: string;
    status: 'stored' | 'impound' | 'outside';
    model: string | number;
    owner?: boolean;
    image?: string;
    displayName?: string;
    data: {
        fuelLevel: number;
        engine: number;
        body: number;
    },
    sharable?: { id: string, name: string }[]
}