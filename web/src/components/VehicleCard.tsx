import type { CleanVehicle } from "../typings/vehicle";

const VehicleCard: React.FC<{
    vehicle: CleanVehicle;
    setSelectedVehicle: (data: CleanVehicle) => void;
}> = ({ vehicle, setSelectedVehicle }) => {
    return (
        <div className="relative rounded-[7px] bg-[linear-gradient(135deg,_#a8a8a800_5%,_#a8a8a830)] cursor-pointer flex justify-center items-center flex-col gap-3 py-5
            before:content-[''] before:pointer-events-none before:absolute before:top-[-1px] before:left-[-1px] before:right-[-1px] before:bottom-[-1px]
            before:rounded-[7px] before:border before:border-[#636363] w-full h-full
            before:[mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)]
            before:[-webkit-mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)]
        "
        onClick={() => setSelectedVehicle(vehicle)}>
            <img src={vehicle.image} 
            className="max-h-[100px]"/>
            <p className="text-xl">{(vehicle.displayName || vehicle.model.charAt(0).toUpperCase() + vehicle.model.slice(1)).toUpperCase()}</p>
            <p className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 rounded border border-neutral-700/50">{vehicle.plate}</p>
        </div>
    )
};

export default VehicleCard;