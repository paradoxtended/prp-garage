import { useEffect, useRef, useState } from "react";
import type { CleanVehicle } from "../typings/vehicle";
import { fetchNui } from "../utils/fetchNui";

type AccordionType = 'properties' | 'transfer' | 'transfer_to_player' | 'share';

const VehicleDetails: React.FC<{
    vehicle: CleanVehicle;
    close: () => void;
    handleClose: () => void;
}> = ({ vehicle, close, handleClose }) => {
    const [accordion, setAccordion] = useState<AccordionType[]>([]);
    const [playerId, setPlayerId] = useState<number | null>(null);

    function handleAccordion(type: AccordionType) {
        if (accordion.includes(type)) {
            setAccordion((prev) => prev.filter((t) => t !== type));
        } else {
            setAccordion((prev) => [...prev, type]);
        }
    }

    function takeOutVehicle(vehicle: CleanVehicle) {
        fetchNui('takeOutVehicle', vehicle)

        close();
        handleClose();
    }

    function transferVehicle(type: 'player' | 'society') {
        if (type === 'player' && (playerId === null || !playerId)) return;

        fetchNui('transferVehicle', {
            type: type,
            vehicle: vehicle,
            playerId: type === 'player' ? playerId : undefined
        })

        close();
        handleClose();
    }

    function shareVehicle() {
        if (playerId === null || !playerId) return;

        fetchNui('shareVehicle', {
            vehicle: vehicle,
            playerId: playerId
        })

        close();
        handleClose();
    }

    function removeVehicleFromPlayer(index: number) {
        fetchNui('removeSharedVehicle', {
            vehicle: vehicle,
            index: index
        })

        close();
        handleClose();
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
                <div className={`bg-black/65 rounded ${!vehicle.owner && 'opacity-50 pointer-events-none'}`}>
                    <div className="flex items-center px-5 py-3 justify-between cursor-pointer"
                    onClick={() => handleAccordion('transfer')}>
                        <p className="text-2xl">Transfer</p>
                        <i className={`fa-solid fa-chevron-down ${accordion.includes('transfer') && '-rotate-180'} transition-all`}></i>
                    </div>
                    <AccordionSection open={accordion.includes('transfer')}>
                        <div className="flex flex-col gap-3">
                            <div className="rounded bg-black/65">
                                <div className="flex items-center px-5 py-3 justify-between cursor-pointer"
                                onClick={() => handleAccordion('transfer_to_player')}>
                                    <p className="text-xl">Transfer To Player</p>
                                    <i className={`fa-solid fa-chevron-down ${accordion.includes('transfer_to_player') && '-rotate-180'} transition-all`}></i>
                                </div>
                                <AccordionSection open={accordion.includes('transfer_to_player')}>
                                    <div className="flex flex-col gap-5 w-fit">
                                        <input type="number" className="bg-lime-950/50 rounded px-2 py-1 focus:outline-none border border-lime-500
                                        placeholder:text-gray-300" placeholder="Player ID"
                                        onChange={(e) => setPlayerId(Number(e.target.value))}/>
                                        <button className="bg-lime-400/10 rounded-full border border-lime-500 py-1 hover:bg-lime-400/20 duration-200"
                                        onClick={() => transferVehicle('player')}>Transfer To Player</button>
                                    </div>
                                </AccordionSection>
                            </div>
                            <button className="bg-black/65 rounded-full text-lg py-1.5 border border-transparent hover:border-lime-500 duration-200 w-full
                            hover:bg-black/50" onClick={() => transferVehicle('society')}>{vehicle.type === 'shared' ? 'Widthraw From Society' : 'Transfer To Society'}</button>
                        </div>
                    </AccordionSection>
                </div>
                <div className={`bg-black/65 rounded ${!vehicle.owner && 'opacity-50 pointer-events-none'}`}>
                    <div className="flex items-center px-5 py-3 justify-between cursor-pointer"
                    onClick={() => handleAccordion('share')}>
                        <p className="text-2xl">Share</p>
                        <i className={`fa-solid fa-chevron-down ${accordion.includes('share') && '-rotate-180'} transition-all`}></i>
                    </div>
                    <AccordionSection open={accordion.includes('share')}>
                        {vehicle?.sharable && (
                            <>
                                <p className="text-xl">Shared players</p>
                                <div className="grid grid-cols-4 my-3">
                                    {vehicle.sharable.map((shared, index) => (
                                        <p key={`sharable-player-${index}`} className="hover:text-lime-500 cursor-pointer duration-200"
                                        onClick={() => removeVehicleFromPlayer(index)}>{shared.name}</p>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="flex items-center gap-3">
                            <input type="number" className="rounded bg-transparent border border-lime-600 focus:outline-none px-2 py-1" placeholder="Player ID"
                            onChange={(e) => setPlayerId(Number(e.target.value))}/>
                            <button className="border border-lime-600 rounded-full px-5 py-1 hover:bg-lime-600/25 duration-200"
                            onClick={() => shareVehicle()}>Share vehicle</button>
                        </div>
                    </AccordionSection>
                </div>
                <button className="bg-black/65 rounded-full text-lg py-1.5 border border-transparent hover:border-lime-500 duration-200
                hover:bg-black/50" onClick={() => takeOutVehicle(vehicle)}>{vehicle.status === 'outside' ? 'Set Waypoint' : 'Take Out Vehicle'}</button>
            </div>
        </div>
    )
};

const AccordionSection: React.FC<{ open: boolean; children: any}> = ({ open, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (open) {
      setMaxHeight(`${el.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [children]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      if (open) {
        setMaxHeight(`${el.scrollHeight}px`);
      }
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [open]);

  return (
    <div
      style={{
        maxHeight,
        opacity: open ? 1 : 0,
        overflow: "hidden",
        transition: "all 0.3s",
      }}
    >
      <div ref={contentRef} className="px-5 py-3">
        {children}
      </div>
    </div>
  );
};

export default VehicleDetails;