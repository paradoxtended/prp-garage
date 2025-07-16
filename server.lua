local garage = require 'modules.garage.server'
local impound = require 'modules.impound.server'
local transfer = require 'modules.transfer.server'
local share = require 'modules.share.server'

--- Variable storing active vehicles ([plate] = vehicle)
---@type table<string, number>
activeVehicles = {}