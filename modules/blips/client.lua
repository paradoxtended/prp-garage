---@class BlipData
---@field sprite integer;
---@field color integer;
---@field name string;
---@field scale number;

local blips = {}

---@param coords vector3 | vector4
---@param data BlipData
function blips.createBlip(coords, data)
    if not data then return end

    local blip = AddBlipForCoord(coords.x, coords.y, coords.z)

    SetBlipSprite (blip, data.sprite)
    SetBlipDisplay(blip, 4)
    SetBlipScale  (blip, data.scale)
    SetBlipColour (blip, data.color)
    SetBlipAsShortRange(blip, true)

    BeginTextCommandSetBlipName('STRING')
    AddTextComponentSubstringPlayerName(data.name)
    EndTextCommandSetBlipName(blip)

    return blip
end

return blips