local blips = require 'modules.blips.client'
local garage = require 'modules.garage.client'

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

interactKey:disable(true)

for _, data in ipairs(Config.garages) do
    lib.points.new({
        coords = data.coords,
        distance = 5,
        onEnter = function()
            prp.showTextUI({
                { key = interactKey.currentKey, text = locale('parking') }
            })
            interactKey:disable(false)
        end,
        onExit = function()
            prp.hideTextUI()
            interactKey:disable(true)
        end
    })
end




RegisterNuiCallback('closeGarage', function(_, cb)
    cb(1)
    SetNuiFocus(false, false)
end)