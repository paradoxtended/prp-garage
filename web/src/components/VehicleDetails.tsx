import { useRef, useState } from "react";
import type { CleanVehicle } from "../typings/vehicle";
import { fetchNui } from "../utils/fetchNui";

const VehicleDetails: React.FC<{
    vehicle: CleanVehicle;
    close: () => void;
    handleClose: () => void;
}> = ({ vehicle, close, handleClose }) => {
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [playerId, setPlayerId] = useState<number>();
    
    function takeOutVehicle() {
        fetchNui('takeOutVehicle', vehicle)
        close();
        handleClose();
    }

    function transferVehicle(type: 'society' | 'player') {
        fetchNui('transferVehicle', {
            type: type,
            vehicle: vehicle,
            playerId: type === 'player' ? playerId : undefined
        })
        close();
        handleClose();
    };

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
                {vehicle.owner && (
                    <button className="text-sm bg-[#0bd9b025] text-[#0bd9b0] py-1.5 w-full
                    hover:bg-[#0bd9b040] duration-150" onClick={() => transferVehicle('society')}>{vehicle.type === 'shared' ? 'Withdraw From Society' : 'Transfer To Society'}</button>
                )}
                <div className="details-card-bg px-3 py-1.5 rounded">
                    <p className="text-sm glowing-text font-medium lea">Vehicle Status</p>
                    <p className="text-xs text-gray-400">
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)} | 
                        Engine: {vehicle.data.engine}% | 
                        Body: {vehicle.data.body}%
                    </p>
                </div>
                {vehicle.status !== 'impound' && vehicle.owner && (
                    <div className="details-card-bg px-3 py-1.5 rounded">
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setAccordionOpen(!accordionOpen)}>
                            <div>
                                <p className="text-sm glowing-text font-medium lea">Transfer To Player</p>
                                <p className="text-xs text-gray-400">Transfer vehicle to player</p>
                            </div>
                            <i className={`fa-solid fa-chevron-down ${accordionOpen && '-rotate-180'} scale-75 glowing-text bg-[#0bd9b025] w-6 h-6 flex items-center justify-center rounded transition-all`}></i>
                        </div>
                        <AccordionSection open={accordionOpen}>
                            <input
                                type="number"
                                className="input-bg placeholder:text-zinc-400"
                                placeholder="Target ID"
                                onChange={(e) => setPlayerId(Number(e.target.value))}
                            />
                            <button className="text-[13px] bg-[#0bd9b025] text-[#0bd9b0] py-1.5 w-full
                            hover:bg-[#0bd9b040] duration-150" onClick={() => {
                                if (!playerId) return;
                                transferVehicle('player')
                            }}>Transfer To Player</button>
                        </AccordionSection>
                    </div>
                )}
            </div>
        </div>
    )
};

const AccordionSection: React.FC<{ open: boolean, children: any }> = ({ open, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={contentRef}
      className={`transition-all duration-300 ease-in-out overflow-hidden`}
      style={{
        maxHeight: open ? contentRef.current?.scrollHeight : 0,
        opacity: open ? 1 : 0,
      }}
    >
        <div className="flex flex-col gap-3 mt-3">
            {children}
        </div>
    </div>
  );
};

export default VehicleDetails;