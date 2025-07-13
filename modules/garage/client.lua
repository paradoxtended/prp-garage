---@param model string | number
---@return string?
local function getVehicleType(model)
    if IsThisModelABike(model) then
        return 'bike'
    end

    if IsThisModelACar(model) or IsThisModelAQuadbike(model) then
        return 'automobile'
    end

    if IsThisModelABoat(model) or IsThisModelAJetski(model) then
        return 'boat'
    end

    if IsThisModelAPlane(model) then
        return 'plane'
    end

    if IsThisModelAHeli(model) then
        return 'heli'
    end
end

---@param vehicle integer
---@param fuelLevel number
local function fuelVehicle(vehicle, fuelLevel)
    if GetResourceState('LegacyFuel') == 'started' then
        exports['LegacyFuel']:SetFuel(vehicle, fuelLevel)
    elseif GetResourceState('ox_fuel') then
        Entity(vehicle).state.fuel = fuelLevel
    end
end

RegisterNetEvent('prp-garage:setVehicleProperties', function(netId, props)
    local timeout = 10000

    while not NetworkDoesEntityExistWithNetworkId(netId) and timeout > 0 do
        Wait(0)
        timeout -= 1
    end

    if timeout > 0 then
        local vehicle = NetToVeh(netId)

        if NetworkGetEntityOwner(vehicle) ~= cache.playerId then return end

        lib.setVehicleProperties(vehicle, props)
    end
end)

RegisterNetEvent('prp-garage:setWaypoint', function(coords)
    prp.notify({
        description = locale('vehicle_marked'),
        type = 'inform'
    })

    SetNewWaypoint(coords.x, coords.y)
end)

local garage = {}

function garage.saveVehicle()
    local vehicle = cache.vehicle

    
end

---@param cb? fun(data: any)
function garage.takeOutVehicle(props, cb)
    if cb then cb(1) end

    local type = getVehicleType(props.model)
    local netId = lib.callback.await('prp-garage:takeOutVehicle', false, props.plate, type)

    if not netId then return end

    for _ = 1, 2000 do
        if not NetworkDoesEntityExistWithNetworkId(netId) then
            Wait(0)
        else
            break
        end
    end

    local vehicle = NetworkGetEntityFromNetworkId(netId)

    fuelVehicle(vehicle, props.data.fuelLevel or 100.0)
end

RegisterNuiCallback('takeOutVehicle', garage.takeOutVehicle)

function garage.getVehicles()
    local rawVehicles = lib.callback.await('prp-garage:getOwnedVehicles', false)
    if not rawVehicles then return end

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

function garage.open()
    local vehicles = garage.getVehicles()

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'openGarage',
        data = {
            vehicles = vehicles
        }
    })
end

return garage