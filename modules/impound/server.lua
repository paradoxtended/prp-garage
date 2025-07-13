local db = require 'modules.db.server'

-- Impounding function is in takeOutVehicle in garage

lib.callback.register('prp-garage:getImpoundedVehicles', function(source)
    local player = Framework.getPlayerFromId(source)
    if not player then return end

    local identifier = player:getIdentifier()

    local data = lib.callback.await('prp-garage:getGarage', source)
    local type = data.impound and Config.garages[data.index].type or nil

    if not type then return end

    return db.getImpoundedVehicles(identifier, player:getJob(), type)
end)