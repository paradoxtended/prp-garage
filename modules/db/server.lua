local Queries = {
    SELECT_OWNED_VEHICLES = 'SELECT * FROM %s WHERE owner = ?',
    SELECT_VEHICLE = 'SELECT * FROM %s WHERE plate = ?',
    UPDATE_STORED = 'UPDATE %s SET stored = ? WHERE plate = ?'
}

local table
if Framework.name == 'es_extended' then
    table = 'owned_vehicles'
    Queries.SET_VEHICLE_PROPS = 'UPDATE %s SET vehicle = ? WHERE plate = ?'
elseif Framework.name == 'qb-core' then
    table = 'player_vehicles'
    Queries.SET_VEHICLE_PROPS = 'UPDATE %s SET mods = ? WHERE plate = ?'
else
    error(('%s framework isn\'t supported by default, you have to implement it yourself.'))
end

for key, query in pairs(Queries) do
    Queries[key] = query:format(table)
    if Framework.name == 'qb-core' then
        Queries[key] = Queries[key]:gsub('owner', 'citizenid')
    end
end

local db = {}

function db.getOwnedVehicles(identifier)
    return MySQL.query.await(Queries.SELECT_OWNED_VEHICLES, { identifier })
end

function db.getVehicle(plate)
    return MySQL.single.await(Queries.SELECT_VEHICLE, { plate })
end

function db.updateVehicle(plate, data, onlyStored)
    return onlyStored and MySQL.update.await(Queries.UPDATE_STORED, { data, plate }) or MySQL.update.await(Queries.SET_VEHICLE_PROPS, { data, plate })
end

return db