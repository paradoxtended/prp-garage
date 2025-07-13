local garage = require 'modules.garage.server'
local impound = require 'modules.impound.server'
local transfer = require 'modules.transfer.server'

---@type table<string, number>
activeVehicles = {}