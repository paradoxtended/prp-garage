const Header: React.FC<{
    setQuery: (query: string) => void;
}> = ({ setQuery }) => {
    return (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-semibold">Garage</p>
            <p className="text-zinc-400">Get your vehicle from the garage</p>
          </div>
          <div className="flex items-center gap-3">
            <input type="text"
            className="bg-black/75 border border-zinc-700/50 rounded focus:outline-none px-3 py-1"
            onChange={(e) => setQuery(e.target.value)}
            />
            <i className="fa-solid fa-magnifying-glass text-xl"></i>
          </div>
        </div>
    )
};

export default Header;