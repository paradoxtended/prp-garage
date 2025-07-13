-- DO NOT EDIT !!
local LoadResourceFile = LoadResourceFile
local context = IsDuplicityVersion() and 'server' or 'client'

local frameworkName = GetResourceState('es_extended') == 'started' and 'esx' or 'qb'
local framework = LoadResourceFile('prp_lib', ('resource/callbacks/%s/%s.lua'):format(context, frameworkName))

local configFile = LoadResourceFile(GetCurrentResourceName(), 'static/config.json')

Config = json.decode(configFile)
Framework = assert(load(framework))()

return context == 'client' and require 'client' or require 'server'