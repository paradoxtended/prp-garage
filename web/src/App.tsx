import { useEffect, useState } from "react";
import Header from "./components/Header";
import { debugData } from "./utils/debugData";
import useNuiEvent from "./hooks/useNuiEvent";
import type { Vehicle } from "./typings/vehicle";
import type { ActiveCategory, OpenData } from "./typings/main";
import Categories from "./components/Categories";

debugData<OpenData>([
  {
    action: 'openGarage',
    data: {
      vehicles: [
        { type: 'personal', plate: '8GS744TD', fuelLevel: 65, stored: true, model: 'Bison' },
        { type: 'shared', plate: '7421SADG', fuelLevel: 32, stored: false, model: 'Kuruma' },
      ]
    }
  }
])

const App: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('all');

  useNuiEvent('openGarage', (data: OpenData) => {
    setVehicles(data.vehicles);
    setVisible(true);
  });

  function handleClose() {
    const container = document.querySelector('.slideIn') as HTMLElement;
    container!.style.animation = 'slideOut 250ms forwards';
    setTimeout(() => setVisible(false), 250);
  };

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
      <Categories activeCategory={activeCategory} setActiveCategory={(cat: ActiveCategory) => setActiveCategory(cat)} />
      <div className="border h-[500px] mt-3 border-gray-600 mx-3">

      </div>
    </div>
  )
};

export default App;