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

    local data = lib.callback.await('prp-garage:getGarage', source)
    local type = data.garage and Config.garages[data.index].type or nil

    if not type then return end

    return db.getOwnedVehicles(identifier, player:getJob(), type)
end)

---@param source number
---@param plate string
---@param type string
lib.callback.register('prp-garage:takeOutVehicle', function(source, plate, type)
    local player = Framework.getPlayerFromId(source)
    if not player then return end

    local vehicle = db.getVehicle(plate, player:getIdentifier(), player:getJob())
    if not vehicle then return end

    if vehicle.stored == 0 then
        local coords = GetEntityCoords(activeVehicles[plate])
        TriggerClientEvent('prp-garage:setWaypoint', source, coords)
        return
    end

    local data = lib.callback.await('prp-garage:getGarage', source)

    -- Impound logic
    if data.impound then
        local price = Config.impound.price

        if player:getAccountMoney(Config.impound.account) < price then
            TriggerClientEvent('prp-garage:notify', source, {
                description = locale('not_enough_' .. Config.impound.account, price),
                type = 'error'
            })

            return
        end

        player:removeAccountMoney(Config.impound.account, price)
        db.updateVehicle(plate, 1, true)

        return
    end

    if vehicle.stored == 2 then
        TriggerClientEvent('prp-garage:notify', source, {
            description = locale('impounded'),
            type = 'error'
        })
        return
    end

    local garage = Config.garages[data.index]

    if garage.restricted and not player:hasOneOfJobs(garage.restricted) then return end

    local checkCoords = vec3(garage.coords.x, garage.coords.y, garage.coords.z)

    if #(GetEntityCoords(GetPlayerPed(source)) - checkCoords) > 5.0 then return end

    local contested = lib.getClosestVehicle(checkCoords, 3.0)

    if contested then return end

    db.updateVehicle(plate, 0, true)

    local props = json.decode(vehicle.mods or vehicle.vehicle)
    local entity = createVehicle(props.model, garage.spawnCoords, type)

    if entity == 0 then return end

    while NetworkGetEntityOwner(entity) == -1 do Wait(0) end

    local netId, owner = NetworkGetNetworkIdFromEntity(entity), NetworkGetEntityOwner(entity)

    TriggerClientEvent('prp-garage:setVehicleProperties', owner, netId, props)

    activeVehicles[plate] = entity

    return netId
end)

---@param source number
---@param props any
---@param netId integer
lib.callback.register('prp-garage:saveVehicle', function(source, props, netId)
    local player = Framework.getPlayerFromId(source)
    if not player then return end

    local vehicle = db.getVehicle(props.plate, player:getIdentifier(), player:getJob())

    if not vehicle then
        return false
    end

    local oldProps = json.decode(vehicle.mods or vehicle.vehicle)

    if props.model ~= oldProps.model then
        return false
    end

    db.updateVehicle(props.plate, 1, true)
    db.updateVehicle(props.plate, json.encode(props))

    SetTimeout(500, function()
        local vehicle = NetworkGetEntityFromNetworkId(netId)

        if DoesEntityExist(vehicle) then
            DeleteEntity(vehicle)
        end
    end)

    activeVehicles[props.plate] = nil

    return true
end)