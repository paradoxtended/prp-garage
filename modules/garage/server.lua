local db = require 'modules.db.server'

--- Spawn a persistent vehicle
---@param model number
---@param coords vector4
---@param type string
---@return number
local function createVehicle(model, coords, type)
    local vehicle = CreateVehicleServerSetter(model, type, coords.x, coords.y, coords.z - 0.70, coords.w)

    for seatIndex = -1, 6 do
        local ped = GetPedInVehicleSeat(vehicle, seatIndex)
        local type = GetEntityPopulationType(ped)

        if type > 0 and type < 6 then
            DeleteEntity(ped)
        end
    end

    return vehicle
end

---@param source number
lib.callback.register('prp-garage:getOwnedVehicles', function(source)
    local player = Framework.getPlayerFromId(source)
    if not player then return end

    local identifier = player:getIdentifier()

    return db.getOwnedVehicles(identifier)
end)

---@param source number
---@param plate string
---@param type string
lib.callback.register('prp-garage:takeOutVehicle', function(source, plate, type)
    local player = Framework.getPlayerFromId(source)
    if not player then return end

    local vehicle = db.getVehicle(plate)
    if not vehicle then return end

    if vehicle.stored == 0 then
        local coords = GetEntityCoords(activeVehicles[plate])
        TriggerClientEvent('prp-garage:setWaypoint', source, coords)
        return
    end

    db.updateVehicle(plate, 0, true)

    local garageIndex = lib.callback.await('prp-garage:getGarage', source)
    local coords = Config.garages[garageIndex].spawnCoords
    local props = json.decode(vehicle.mods or vehicle.vehicle)
    local entity = createVehicle(props.model, coords, type)

    if entity == 0 then return end

    while NetworkGetEntityOwner(entity) == -1 do Wait(0) end

    local netId, owner = NetworkGetNetworkIdFromEntity(entity), NetworkGetEntityOwner(entity)

    TriggerClientEvent('prp-garage:setVehicleProperties', owner, netId, props)

    activeVehicles[plate] = entity

    return netId
end)