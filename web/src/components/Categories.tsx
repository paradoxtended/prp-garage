import { useEffect, useRef, useState } from "react";
import type { ActiveCategory } from "../typings/main";

const tabList: ActiveCategory[] = ["all", "personal", "shared"];

const Categories: React.FC<{
    activeCategory: ActiveCategory;
    setActiveCategory: (name: ActiveCategory) => void;
    setSearchQuery: (query: any) => void;
}> = ({ activeCategory, setActiveCategory, setSearchQuery }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
    
    useEffect(() => {
        if (containerRef.current) {
        const activeIndex = tabList.indexOf(activeCategory);
        const tabElement = containerRef.current.children[activeIndex] as HTMLElement;

        if (tabElement) {
            const { offsetLeft, offsetWidth } = tabElement;
            setSliderStyle({ left: offsetLeft, width: offsetWidth });
        }
        }
    }, [activeCategory]);

    return (
        <div className="mt-3 flex items-center gap-3">
            <div className="relative w-full">
                <input type="text" className="pl-8 placeholder:text-zinc-400 w-full text-xs" placeholder="Search automobile..." onChange={(e) => setSearchQuery(e.target.value)}/>
                <i className="fa-solid fa-magnifying-glass glowing-text absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"></i>
            </div>
            <div className="relative flex items-center h-full w-fit text-xs text-gray-400 font-light border-b border-gray-600" ref={containerRef}>
                {tabList.map((tab) => (
                    <p
                        key={tab}
                        onClick={() => setActiveCategory(tab)}
                        className={`px-5 py-1.5 cursor-pointer  z-20 ${
                        activeCategory === tab ? "text-[#0bd9b0]" : ""
                        }`}
                    >
                        {tab.toUpperCase()}
                    </p>
                ))}
                <div
                    className="absolute -bottom-[2px] h-[2px] bg-[#0bd9b0] shadow-[0_0_10px_#0bd9b0] rounded-full z-10 transition-all duration-300"
                    style={{
                        left: sliderStyle.left,
                        width: sliderStyle.width,
                    }}
                />
                <div
                    className="absolute h-full bg-[#0d777250] z-10 transition-all duration-300"
                    style={{
                        left: sliderStyle.left,
                        width: sliderStyle.width,
                    }}
                />
            </div>
        </div>
    )
};

export default Categories;