local blips = require 'modules.blips.client'
local garage = require 'modules.garage.client'

local currentGarage

lib.callback.register('prp-garage:getGarage', function()
    return currentGarage
end)

---------------------------------------------------------------------------------------------------------------------------------
--- BLIPS
---------------------------------------------------------------------------------------------------------------------------------

for _, data in ipairs(Config.garages) do
    blips.createBlip(data.coords, Config.blips.garage)
end

---------------------------------------------------------------------------------------------------------------------------------
--- KEYBIND LISTENING
---------------------------------------------------------------------------------------------------------------------------------

local interactKey = lib.addKeybind({
    name = 'prp-garage:openGarage',
    description = 'Open garage',
    defaultKey = 'E',
    onReleased = function()
        garage.open()
    end
})

local saveKey = lib.addKeybind({
    name = 'prp-garage:saveVehicle',
    description = 'Save vehicle',
    defaultKey = 'G',
    onReleased = function()
        if not cache.vehicle then return end
        garage.saveVehicle()
    end
})

interactKey:disable(true)
saveKey:disable(true)

for index, data in ipairs(Config.garages) do
    lib.points.new({
        coords = data.coords,
        distance = 5,
        onEnter = function()
            local textUi = cache.vehicle and { key = saveKey.currentKey, text = locale('save_vehicle') } or nil

            prp.showTextUI({
                { key = interactKey.currentKey, text = locale('parking') },
                textUi
            })

            currentGarage = index
            interactKey:disable(false)
            saveKey:disable(false)
        end,
        onExit = function()
            prp.hideTextUI()
            currentGarage = nil
            interactKey:disable(true)
            saveKey:disable(true)
        end
    })
end




RegisterNuiCallback('closeGarage', function(_, cb)
    cb(1)
    SetNuiFocus(false, false)
end)