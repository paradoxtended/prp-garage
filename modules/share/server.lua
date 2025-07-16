local db = require 'modules.db.server'

---@param source number
---@param data { vehicle: any, playerId: number }
lib.callback.register('prp-garage:shareVehicle', function(source, data)
    local player = Framework.getPlayerFromId(source)
    local target = Framework.getPlayerFromId(data.playerId)

    if not player
    or not target then 
        return TriggerClientEvent('prp-garage:notify', source, {
            description = locale('player_not_offline'),
            type = 'error'
        })
    end

    local plate = data.vehicle.plate
    local vehicle = db.getStrictVehicle(plate, player:getIdentifier())

    if not vehicle then return end

    local targetIdentifier = target:getIdentifier()
    local shared = json.decode(vehicle.shared) or {}

    -- Check if player is in table
    for _, player in ipairs(shared) do
        if player.id == targetIdentifier then 
            return TriggerClientEvent('prp-garage:notify', source, {
                description = locale('player_has_access'),
                type = 'error'
            })
        end
    end

    table.insert(shared, {
        id = targetIdentifier,
        name = GetPlayerName(data.playerId)
    })

    db.updateShared(plate, json.encode(shared))

    return true
end)

---@param source number
---@param data { vehicle: any, index: number }
lib.callback.register('prp-garage:removeSharedVehicle', function(source, data)
    local player = Framework.getPlayerFromId(source)

    if not player then return end

    local plate = data.vehicle.plate
    local vehicle = db.getStrictVehicle(plate, player:getIdentifier())

    if not vehicle then return end

    local index = data.index + 1 -- Convert from TS
    local shared = json.decode(vehicle.shared)

    table.remove(shared, index)

    db.updateShared(plate, #shared > 0 and json.encode(shared) or nil)

    return true
end)