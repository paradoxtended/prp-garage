import { useEffect, useState } from "react";
import Header from "./components/Header";
import { debugData } from "./utils/debugData";
import useNuiEvent from "./hooks/useNuiEvent";
import type { CleanVehicle, Vehicle } from "./typings/vehicle";
import type { ActiveCategory, OpenData } from "./typings/main";
import Categories from "./components/Categories";
import VehicleCard from "./components/VehicleCard";
import { Vehicles } from "./components/utils";

debugData<OpenData>([
  {
    action: 'openGarage',
    data: {
      vehicles: [
        { type: 'personal', plate: '8GS744TD', fuelLevel: 65, status: 'stored', model: 2139203625 },
        { type: 'shared', plate: '7421SADG', fuelLevel: 32, status: 'outside', model: 'kuruma' },
        { type: 'personal', plate: '84ASD310', fuelLevel: 12, status: 'stored', model: 'urus' }
      ]
    }
  }
])

const App: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<CleanVehicle[]>([]);
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('all');
  const [filtered, setFiltered] = useState<CleanVehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useNuiEvent('openGarage', (data: OpenData) => {
    let vehicles: Vehicle[] = data.vehicles.map((veh: Vehicle) => {
      let model = veh.model;

      if (typeof model === 'number') {
        model = Vehicles.find((raw: any) => raw.Hash === model)?.Name || 'unknown';
      }

      return {
        ...veh,
        model: model,
      };
    });

    setVehicles(vehicles as CleanVehicle[]);
    setVisible(true);
  });

  function handleClose() {
    const container = document.querySelector('.slideIn') as HTMLElement;
    container!.style.animation = 'slideOut 250ms forwards';
    setTimeout(() => setVisible(false), 250);
  };

  useEffect(() => {
    let filteredByCategory = vehicles;

    if (activeCategory !== 'all') {
      filteredByCategory = vehicles.filter(veh => veh.type === activeCategory);
    }

    const filteredBySearch = filteredByCategory.filter(veh =>
      veh.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      veh.plate.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFiltered(filteredBySearch);
  }, [searchQuery, activeCategory, vehicles]);

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) handleClose();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  return ( visible &&
    <div className="absolute top-1/2 left-[84%] -translate-x-1/2 -translate-y-1/2 w-[550px] box-bg rounded-3xl p-7 slideIn">
      <Header vehicles={vehicles} />
      <Categories activeCategory={activeCategory} setActiveCategory={(cat: ActiveCategory) => setActiveCategory(cat)} setSearchQuery={setSearchQuery} />
      <div className="border h-[500px] mt-3 border-gray-600 mx-3 grid grid-cols-2 gap-5 py-3 px-6 overflow-auto">
          {filtered.map((vehicle, index) => (
            <VehicleCard key={`vehicle-card-${index}`} vehicle={vehicle}/>
          ))}
      </div>
    </div>
  )
};

export default App;