local Queries = {
    SELECT_OWNED_VEHICLES = Framework.name == 'es_extended' and 'SELECT * FROM owned_vehicles WHERE owner = ?' 
                            or 'SELECT * FROM player_vehicles WHERE citizenid = ?',
}

local db = {}

function db.getOwnedVehicles(identifier)
    return MySQL.query.await(Queries.SELECT_OWNED_VEHICLES, { identifier })
end

return db