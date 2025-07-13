local Queries = {
    SELECT_OWNED_VEHICLES = 'SELECT * FROM %s WHERE (owner = ? or job = ?) and type = ?',
    SELECT_VEHICLE = 'SELECT * FROM %s WHERE (owner = ? or job = ?) and plate = ?',
    UPDATE_STORED = 'UPDATE %s SET stored = ? WHERE plate = ?',
    SELECT_IMPOUNDED_VEHICLES = 'SELECT * FROM %s WHERE (owner = ? or job = ?) and stored = ? and type = ?',
    SELECT_VEHICLE_STRICT = 'SELECT * FROM %s WHERE owner = ? and plate = ?',
    TRANSFER_TO_PLAYER = 'UPDATE %s SET owner = ? WHERE plate = ?',
    TRANSFER_TO_SOCIETY = 'UPDATE %s SET job = ? WHERE plate = ?',
    WITHDRAW_FROM_SOCIETY = 'UPDATE %s SET job = NULL WHERE plate = ?'
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

function db.getOwnedVehicles(identifier, job, type)
    return MySQL.query.await(Queries.SELECT_OWNED_VEHICLES, { identifier, job, type })
end

function db.getImpoundedVehicles(identifier, job, type)
    return MySQL.query.await(Queries.SELECT_IMPOUNDED_VEHICLES, { identifier, job, 2, type })
end

function db.getVehicle(plate, owner, job)
    return MySQL.single.await(Queries.SELECT_VEHICLE, { owner, job, plate })
end

function db.getStrictVehicle(plate, owner)
    return MySQL.single.await(Queries.SELECT_VEHICLE_STRICT, { owner, plate })
end

function db.transferVehicle(plate, player, job)
    return job ~= nil and 
        (job == false and MySQL.update.await(Queries.WITHDRAW_FROM_SOCIETY, { plate })
        or MySQL.update.await(Queries.TRANSFER_TO_SOCIETY, { job, plate }))
    or MySQL.update.await(Queries.TRANSFER_TO_PLAYER, { player, plate })
end

function db.updateVehicle(plate, data, onlyStored)
    return onlyStored and MySQL.update.await(Queries.UPDATE_STORED, { data, plate }) or MySQL.update.await(Queries.SET_VEHICLE_PROPS, { data, plate })
end

return db