---@param data { vehicle: any, playerId: number }
RegisterNUICallback('shareVehicle', function(data, cb)
    cb(1)

    local response = lib.callback.await('prp-garage:shareVehicle', false, data)

    if response then
        prp.notify({
            description = locale('player_granted_access'),
            type = 'inform'
        })
    end
end)

---@param data { vehicle: any, index: number }
RegisterNUICallback('removeSharedVehicle', function (data, cb)
    cb(1)

    local response = lib.callback.await('prp-garage:removeSharedVehicle', false, data)

    if response then
        prp.notify({
            description = locale('player_took_access'),
            type = 'inform'
        })
    end
end)