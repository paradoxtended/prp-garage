import type { Vehicle } from "../typings/vehicle";

const Header: React.FC<{
    vehicles: Vehicle[];
}> = ({ vehicles }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="font-[Oswald]">
                <p className="glowing-text font-medium text-2xl">GARAGE SYSTEM</p>
                <p className="font-[Poppins] text-[13px] text-gray-400">Get vehicles from your garage.</p>
            </div>
            <div className="inline-flex items-end gap-3">
                <div className="bg-gray-300/15 w-8 h-8 flex justify-center items-center rounded-md text-2xl font-bold text-gray-800">P</div>
                <div className="text-white leading-3">
                    <p className="text-sm font-light">Parked</p>
                    <p className="font-medium text-[17px]">Cars</p>
                </div>
                <div className="w-2 h-2 bg-[#0bd9b0] shadow-[0_0_15px_#0bd9b0]"></div>
                <p className="text-white font-semibold leading-3">{vehicles.filter(veh => veh.status === 'stored').length}<span className="text-gray-400 font-normal text-[13px]">/{vehicles.length}</span></p>
            </div>
            <div className="flex items-center bg-gray-700 rounded-sm text-sm text-gray-400 p-0.5">
                <p className="bg-gray-800 px-2">Exit</p>
                <p className="px-2">ESC</p>
            </div>
        </div>
    )
};

export default Header;