local impound = {}

function impound.getVehicles()
    local rawVehicles = lib.callback.await('prp-garage:getImpoundedVehicles', false)
    local vehicles = {}

    for _, vehicle in ipairs(rawVehicles) do
        local props = json.decode(vehicle.mods or vehicle.vehicle)
        local status = vehicle.stored == 0 and 'outside'
                    or vehicle.stored == 1 and 'stored'
                    or 'impound'

        table.insert(vehicles, {
            type = vehicle.job and 'shared' or 'personal',
            plate = vehicle.plate,
            status = status,
            model = props.model,
            data = {
                engine = props.engineHealth / 10,
                body = props.bodyHealth / 10,
                fuelLevel = props.fuelLevel
            }
        })
    end

    return vehicles
end

function impound.open()
    local vehicles = impound.getVehicles()

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'openGarage',
        data = {
            vehicles = vehicles
        }
    })
end

return impound