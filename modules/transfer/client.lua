local transfer = {}

---@param playerId number
function transfer.toPlayer(vehicle, playerId)
    local plate = vehicle.plate
    local result = lib.callback.await('prp-garage:transferToPlayer', false, plate, playerId)

    if result then
        prp.notify({
            description = locale('vehicle_transfered'),
            type = 'inform'
        })
    end
end

function transfer.toSociety(vehicle)
    local plate = vehicle.plate
    local result = lib.callback.await('prp-garage:transferToSociety', false, plate)

    if result then
        prp.notify({
            description = locale('vehicle_transfered'),
            type = 'inform'
        })
    end
end

RegisterNUICallback('transferVehicle', function(data, cb)
    cb(1)

    ---@type 'society' | 'player'
    local type, vehicle, playerId in data

    if type == 'society' then
        transfer.toSociety(vehicle)
    elseif type == 'player' then
        transfer.toPlayer(vehicle, playerId)
    end
end)

return transfer