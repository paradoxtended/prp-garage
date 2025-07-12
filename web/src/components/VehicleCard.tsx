import { useEffect, useState } from "react";
import type { CleanVehicle } from "../typings/vehicle";

const fallbackImage = './car-icon.webp';

const VehicleCard: React.FC<{
    vehicle: CleanVehicle;
    setSelectedVehicle: (data: CleanVehicle) => void;
}> = ({ vehicle, setSelectedVehicle }) => {
    const [imageSrc, setImageSrc] = useState<string | undefined>();

    useEffect(() => {
        setImageSrc(`https://docs.fivem.net/vehicles/${vehicle.model}.webp`);
    }, [vehicle])

    function handleImageError() {
        setImageSrc(fallbackImage);
    };

    return (
        <div className="w-full h-60 bg-vehicle-card border-b border-gray-400 relative cursor-pointer
        hover:border-[#0bd9b0] hover:bg-vehicle-card-hover"
        onClick={() => setSelectedVehicle(vehicle)}>
            <div className="absolute top-1 left-1 w-0 h-0 drop-shadow-[0_0_8px_#0bd9b0]
                    border-l-[8px] border-l-[#0bd9b0] 
                    border-b-[8px] border-b-transparent">
            </div>
            <div className="relative">
                <img src="./license-plate.png"
                className="absolute top-0 right-0 w-[108px] h-14"/>
                <p className="absolute top-[18px] right-3 text-slate-800 font-semibold">{vehicle.plate}</p>
            </div>
            <img 
                src={imageSrc}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                max-w-[175px] max-h-[175px]"
                onError={handleImageError}
            />
            <div className="w-full h-[50px] bg-gray-800/50 absolute bottom-0 px-5 flex items-center justify-between">
                <div className="flex flex-col leading-4">
                    <p className="text-white font-medium text-sm">{vehicle.model.charAt(0).toUpperCase() + vehicle.model.slice(1)}</p>
                    <p className="text-[13px] glowing-text">{vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}</p>
                </div>
                <div className="flex items-center text-[13px] text-white h-5">
                    <p className="w-5 h-full bg-yellow-500 flex items-center justify-center">F</p>
                    <p className="bg-gray-900/50 h-full px-2">{vehicle.data.fuelLevel}</p>
                </div>
            </div>
        </div>
    )
};

export default VehicleCard;