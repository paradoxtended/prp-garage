local db = require 'modules.db.server'

---@param source number
lib.callback.register('prp-garage:getOwnedVehicles', function(source)
    local player = Framework.getPlayerFromId(source)
    if not player then return end

    local identifier = player:getIdentifier()

    return db.getOwnedVehicles(identifier)
end)