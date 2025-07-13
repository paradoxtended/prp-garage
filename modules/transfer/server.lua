local db = require 'modules.db.server'

---@param source number
---@param plate string
---@param targetId number
lib.callback.register('prp-garage:transferToPlayer', function(source, plate, targetId)
    local player = Framework.getPlayerFromId(source)
    if not player then return end

    local target = Framework.getPlayerFromId(targetId)
    if not target then
        TriggerClientEvent('prp-garage:notify', source, {
            description = locale('player_not_offline'),
            type = 'error'
        })

        return
    end

    local vehicle = db.getStrictVehicle(plate, player:getIdentifier())
    if not vehicle then return end

    if #(GetEntityCoords(GetPlayerPed(source)) - GetEntityCoords(GetPlayerPed(targetId))) > 10.0 then
        TriggerClientEvent('prp-garage:notify', source, {
            description = locale('player_far_away'),
            type = 'error'
        })

        return
    end

    db.transferVehicle(plate, target:getIdentifier())

    return true
end)

---@param source number
---@param plate string
lib.callback.register('prp-garage:transferToSociety', function(source, plate)
    local player = Framework.getPlayerFromId(source)
    if not player then return end
    
    local vehicle = db.getStrictVehicle(plate, player:getIdentifier())
    if not vehicle then return end

    if not vehicle.job and player:getJob() ~= 'unemployed' then
        db.transferVehicle(plate, nil, player:getJob())
        return true
    elseif vehicle.job then
        db.transferVehicle(plate, nil, false)
        return true
    end

    return false
end)