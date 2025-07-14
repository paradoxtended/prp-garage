import { useRef, useState } from "react";
import type { CleanVehicle } from "../typings/vehicle";

type AccordionType = 'properties' | 'actions';

const VehicleDetails: React.FC<{
    vehicle: CleanVehicle;
    close: () => void;
    handleClose: () => void;
}> = ({ vehicle, close, handleClose }) => {
    const [accordion, setAccordion] = useState<AccordionType[]>([]);

    function handleAccordion(type: AccordionType) {
        if (accordion.includes(type)) {
            setAccordion((prev) => prev.filter((t) => t !== type));
        } else {
            setAccordion((prev) => [...prev, type]);
        }
    }

    return (
        <div className="main-background p-5 pr-0 leftSide">
            <div className="flex items-center justify-between pr-5">
                <div>
                    <p className="text-2xl">{(vehicle.displayName || vehicle.model).toUpperCase()}</p>
                    <p className="text-zinc-400">Vehicle details</p>
                </div>
                <i className="fa-regular fa-circle-xmark cursor-pointer hover:opacity-50 duration-200" onClick={close}></i>
            </div>
            <div className="mt-5 flex flex-col gap-3 max-h-[800px] overflow-auto pr-2.5 mr-2.5">
                <div className="bg-black/65 rounded">
                    <div className="flex items-center px-5 py-3 justify-between cursor-pointer"
                    onClick={() => handleAccordion('properties')}>
                        <p className="text-2xl">Properties</p>
                        <i className={`fa-solid fa-chevron-down ${accordion.includes('properties') && '-rotate-180'} transition-all`}></i>
                    </div>
                    <AccordionSection open={accordion.includes('properties')}>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xl">Vehicle Type:</p>
                                <p className="font-medium text-lime-500">{vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</p>
                            </div>
                            <div>
                                <p className="text-xl">Vehicle Plate:</p>
                                <p className="font-medium text-lime-500">{vehicle.plate}</p>
                            </div>
                            <div>
                                <p className="text-xl">Vehicle Status:</p>
                                <p className={`font-medium ${vehicle.status === 'stored' ? 'text-lime-500' : 'text-red-500'}`}>{vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}</p>
                            </div>
                            <div>
                                <p className="text-xl">Vehicle Model:</p>
                                <p className="font-medium text-lime-500">{vehicle.model}</p>
                            </div>
                            <div>
                                <p className="text-xl">Vehicle Body Health:</p>
                                <p className="font-medium text-lime-500">{vehicle.data.body.toFixed(1)}%</p>
                            </div>
                            <div>
                                <p className="text-xl">Vehicle Engine Health:</p>
                                <p className="font-medium text-lime-500">{vehicle.data.engine.toFixed(1)}%</p>
                            </div>
                            <div className="col-span-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xl">Vehicle Fuel:</p>
                                    <p className="font-medium text-lime-500">{vehicle.data.fuelLevel.toFixed(1)}%</p>
                                </div>
                                <div className="bg-black/50 h-2 mt-2 rounded-full border border-zinc-700/50 overflow-hidden">
                                    <div className="h-full bg-lime-500" style={{ width: `${vehicle.data.fuelLevel}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </AccordionSection>
                </div>
                <div className="bg-black/65 rounded">
                    <div className="flex items-center px-5 py-3 justify-between cursor-pointer"
                    onClick={() => handleAccordion('actions')}>
                        <p className="text-2xl">Actions</p>
                        <i className={`fa-solid fa-chevron-down ${accordion.includes('actions') && '-rotate-180'} transition-all`}></i>
                    </div>
                    <AccordionSection open={accordion.includes('actions')}>
                        <p>TOMORROW</p>
                    </AccordionSection>
                </div>
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
        <div className="px-5 py-3">
            {children}
        </div>
    </div>
  );
};

export default VehicleDetails;