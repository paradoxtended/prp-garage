import { useEffect, useState } from "react";
import { debugData } from "./utils/debugData";
import useNuiEvent from "./hooks/useNuiEvent";
import type { CleanVehicle, Vehicle } from "./typings/vehicle";
import type { ActiveCategory, OpenData } from "./typings/main";
import { checkImageExists, Vehicles } from "./components/utils";
import { fetchNui } from "./utils/fetchNui";
import Header from "./components/Header";
import VehicleCard from "./components/VehicleCard";
import VehicleDetails from "./components/VehicleDetails";

debugData<OpenData>([
  {
    action: 'openGarage',
    data: {
      vehicles: [
        { type: 'personal', plate: '8GS744TD', status: 'stored', model: 2139203625, data: { engine: 100, body: 72, fuelLevel: 32 }, owner: true },
        { type: 'shared', plate: '7421SADG', status: 'outside', model: 3061199846, data: { engine: 38, body: 12, fuelLevel: 96 }, owner: false },
        { type: 'personal', plate: '84ASD310', status: 'impound', model: 'urus', data: { engine: 79, body: 52, fuelLevel: 64 }, owner: true }
      ]
    }
  }
])

const App: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<CleanVehicle[]>([]);
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('personal');
  const [filtered, setFiltered] = useState<CleanVehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<CleanVehicle | null>(null);

  useNuiEvent('openGarage', async (data: OpenData) => {
    const vehicles: Vehicle[] = await Promise.all(
      data.vehicles.map(async (veh: Vehicle) => {
        let model = veh.model;
        let image;

        if (typeof model === 'number') {
          model = Vehicles.find((raw: any) => raw.Hash === model)?.Name || 'unknown';
        }

        const imgUrl = `https://docs.fivem.net/vehicles/${model}.webp`;
        const exists = await checkImageExists(imgUrl);
        image = exists ? imgUrl : '/car-icon.png';

        const displayName = Vehicles.find(
          (raw: any) => raw.Hash === model || raw.Name === model
        )?.DisplayName.English;

        return {
          ...veh,
          model,
          image,
          displayName
        };
      })
    );

    setVehicles(vehicles as CleanVehicle[]);
    setSelectedVehicle(null);
    setVisible(true);
  });

  function handleClose() {
    const container = document.querySelector('.rightSide') as HTMLElement;
    container!.style.animation = 'slideOut 250ms forwards';

    const tooltip = document.querySelector('.tooltip') as HTMLElement;
    tooltip!.style.animation = 'slideOut 250ms forwards';

    const leftSide = document.querySelector('.leftSide') as HTMLElement;
    if (leftSide !== null) leftSide!.style.animation = 'slideOutLeft 250ms forwards';

    setTimeout(() => setVisible(false), 250);
    fetchNui('closeGarage');
  };

  useEffect(() => {
    let filteredByCategory = vehicles.filter(veh => veh.type === activeCategory);

    const filteredBySearch = filteredByCategory.filter(veh =>
      veh.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      veh.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      veh.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFiltered(filteredBySearch);
  }, [searchQuery, activeCategory, vehicles]);

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      // Ignore if typing in an input, textarea, or contenteditable element
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      const key = event.key.toLowerCase();

      switch (key) {
        case 'escape':
          return handleClose()
        case 'q':
          return setActiveCategory('personal')
        case 'e':
          return setActiveCategory('shared')
      }
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  function showVehicleDetails(vehicle: CleanVehicle) {
    if (selectedVehicle) {
      const wrapper = document.querySelector('.leftSide') as HTMLElement;
      wrapper!.style.animation = 'slideOutLeft 250ms forwards';

      setTimeout(() => setSelectedVehicle(null), 250);

      if (selectedVehicle.plate === vehicle.plate) return;

      setTimeout(() => setSelectedVehicle(vehicle), 275);
    } else {
      setSelectedVehicle(vehicle);
    }
  }

  return ( visible &&
    <>
      <div className="absolute top-5 right-5 flex items-center gap-3 text-white tooltip transform-none font-[Oswald]">
        <div className={`flex items-center gap-3 bg-black/65 px-5 py-2 rounded border transition-all duration-200 ${activeCategory === 'personal' ? 'border-lime-500 bg-lime-900/75' : 'border-neutral-600'}`}>
          <p className="bg-black/50 px-1.5 rounded-sm text-[13px]">Q</p>
          <p>PERSONAL</p>
        </div>
        <div className={`flex items-center gap-3 bg-black/65 px-5 py-2 rounded border transition-all duration-200 ${activeCategory === 'shared' ? 'border-lime-500 bg-lime-900/75' : 'border-neutral-600'}`}>
          <p className="bg-black/50 px-1.5 rounded-sm text-[13px]">E</p>
          <p>SHARED</p>
        </div>
      </div>
      <div className="absolute top-1/2 left-[15%] w-[550px] -translate-x-1/2 -translate-y-1/2">
        {selectedVehicle && (
          <VehicleDetails key={selectedVehicle.plate} vehicle={selectedVehicle} close={() => showVehicleDetails(selectedVehicle)} handleClose={() => handleClose()} /> 
        )}
      </div>
      <div className="absolute top-1/2 left-[85%] w-[550px] -translate-x-1/2 -translate-y-1/2">
        <div className="main-background rightSide p-5 h-[500px]">
          <Header setQuery={setSearchQuery} />
          <div className="grid grid-cols-2 mt-5 gap-3">
            {filtered.map((veh, index) => (
              <VehicleCard key={`vehicle-card-${index}`} vehicle={veh} setSelectedVehicle={(vehicle: CleanVehicle) => showVehicleDetails(vehicle)} />
            ))}        
          </div>
        </div>
      </div>
    </>
  )
};

export default App;