fx_version 'cerulean'
use_experimental_fxv2_oal 'yes'
lua54 'yes'
name 'prp-garage'
game 'gta5'
author 'Paradoxtended'
version '1.0.2'
repository 'https://github.com/paradoxtended/prp-garage'
description 'Advanced garage system for FiveM servers'

dependencies {
    'ox_lib'
}

ui_page 'web/dist/index.html'

shared_scripts {
    '@ox_lib/init.lua',
    '@prp_lib/init.lua'
}

client_script 'init.lua'

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'init.lua'
}

files {
    'client.lua',
    'server.lua',
    'web/dist/index.html',
    'web/dist/**/*',
    'locales/*.json',
    'modules/**/*.lua',
    'utils/*.lua',
    'static/*'
}