local blips = require 'modules.blips.client'
local garage = require 'modules.garage.client'
local impound = require 'modules.impound.client'
local transfer = require 'modules.transfer.client'
local share = require 'modules.share.client'

local utils = require 'utils.client'

local current = {}

lib.callback.register('prp-garage:getGarage', function()
    return current
end)

RegisterNetEvent('prp-garage:notify', prp.notify)

---------------------------------------------------------------------------------------------------------------------------------
--- BLIPS
---------------------------------------------------------------------------------------------------------------------------------

---@type integer[]
local activeBlips = {}

CreateThread(function()
    while true do
        -- Remove blips if exists in activeBlips
        for _, blip in ipairs(activeBlips) do
            RemoveBlip(blip)
        end

        for _, data in ipairs(Config.garages) do
            if data.visible and (not data.restricted or utils.hasJob(data.restricted)) then
                local blip = blips.createBlip(data.coords, Config.blips.garage)
                table.insert(activeBlips, blip)
            end
        end

        for _, data in ipairs(Config.impounds) do
            if data.visible then
                local blip = blips.createBlip(data.coords, Config.blips.impound)
                table.insert(activeBlips, blip)
            end
        end
        
        Wait(30 * 60000) -- 30 minutes
    end
end)

---------------------------------------------------------------------------------------------------------------------------------
--- KEYBIND LISTENING
---------------------------------------------------------------------------------------------------------------------------------

local interactKey = lib.addKeybind({
    name = 'prp-garage:openGarage',
    description = 'Open garage',
    defaultKey = 'E'
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
            if data.restricted and not utils.hasJob(data.restricted) then return end

            local textUi = cache.vehicle and { key = saveKey.currentKey, text = locale('save_vehicle') } or nil

            prp.showTextUI({
                { key = interactKey.currentKey, text = locale('parking') },
                textUi
            })

            current.garage = true
            current.index = index

            interactKey.onReleased = function ()
                garage.open()
            end

            interactKey:disable(false)
            saveKey:disable(false)
        end,
        onExit = function()
            prp.hideTextUI()
            current = {}
            interactKey:disable(true)
            saveKey:disable(true)
        end
    })
end

for index, data in ipairs(Config.impounds) do
    lib.points.new({
        coords = data.coords,
        distance = 5,
        onEnter = function()
            prp.showTextUI({
                { key = interactKey.currentKey, text = locale('impound') }
            })

            current.impound = true
            current.index = index

            interactKey.onReleased = function()
                impound.open()
            end

            interactKey:disable(false)
        end,
        onExit = function()
            prp.hideTextUI()
            current = {}
            interactKey:disable(true)
        end
    })
end



RegisterNuiCallback('closeGarage', function(_, cb)
    cb(1)
    SetNuiFocus(false, false)
end)