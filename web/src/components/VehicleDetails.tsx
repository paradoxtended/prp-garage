import type { CleanVehicle } from "../typings/vehicle";
import { fetchNui } from "../utils/fetchNui";

const VehicleDetails: React.FC<{
    vehicle: CleanVehicle;
    close: () => void;
    handleClose: () => void;
}> = ({ vehicle, close, handleClose }) => {
    function takeOutVehicle() {
        fetchNui('takeOutVehicle', vehicle.plate)
        close();
        handleClose();
    }

    return (
        <div className="absolute top-0 right-[103%] w-[325px] p-7 box-bg rounded-3xl h-full slideIn-left">
            <div className="flex items-center justify-between">
                <div>
                    <p className="glowing-text font-semibold font-[Oswald] text-2xl">DETAILS</p>
                    <p className="text-gray-400 text-[13px]">{vehicle.plate}</p>
                </div>
                <button className="text-gray-400 text-[13px] bg-gray-700 px-3 py-1
                hover:text-[#0bd9b0] hover:bg-[#0bd9b025] duration-150" onClick={close}>Close</button>
            </div>
            <div className="mt-2 border border-gray-600 h-[550px] p-2 flex flex-col gap-2">
                <button className="text-sm bg-[#0bd9b025] text-[#0bd9b0] py-1.5 w-full
                hover:bg-[#0bd9b040] duration-150" onClick={() => takeOutVehicle()}>Take Out Vehicle</button>
                <div className="details-card-bg px-3 py-1.5 rounded">
                    <p className="text-sm glowing-text font-medium lea">Vehicle Status</p>
                    <p className="text-xs text-gray-400">
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)} | 
                        Engine: {vehicle.data.engine}% | 
                        Body: {vehicle.data.body}%
                    </p>
                </div>
            </div>
        </div>
    )
};

export default VehicleDetails;