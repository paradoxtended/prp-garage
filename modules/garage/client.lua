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

---@param vehicle integer
local function getVehicleFuel(vehicle)
    if GetResourceState('LegacyFuel') == 'started' then
        local fuelLevel = exports['LegacyFuel']:GetFuel(vehicle, fuelLevel)
        return math.floor(fuelLevel * 100) / 100
    else
        return GetVehicleFuelLevel(vehicle)
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

    if not vehicle and cache.seat ~= -1 then
        return prp.notify({
            description = locale('not_driver'),
            type = 'error'
        })
    end

    local props = lib.getVehicleProperties(vehicle)

    if not props then return end

    props.plate = props.plate:strtrim(' ')
    props.fuelLevel = getVehicleFuel(vehicle)
    local netId = NetworkGetNetworkIdFromEntity(vehicle)
    local result = lib.callback.await('prp-garage:saveVehicle', false, props, netId)

    if result then
        if cache.vehicle then
            TaskLeaveAnyVehicle(cache.ped, 0, 0)
            Wait(1000)
        end
    else
        prp.notify({
            description = locale('not_your_vehicle'),
            type = 'error'
        })
    end
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
        local sharable = json.decode(vehicle.shared)

        table.insert(vehicles, {
            type = (vehicle.job or sharable) and 'shared' or 'personal',
            plate = vehicle.plate,
            status = status,
            model = props.model,
            owner = vehicle[Framework.name == 'es_extended' and 'owner' or 'citizenid'] == Framework.getIdentifier(),
            data = {
                engine = props.engineHealth / 10,
                body = props.bodyHealth / 10,
                fuelLevel = props.fuelLevel
            },
            sharable = sharable
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