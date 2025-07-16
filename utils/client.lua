local utils = {}

---@param jobs string | string[]
---@return boolean
function utils.hasJob(jobs)
    if type(jobs) == 'string' then
        jobs = { jobs } ---@cast jobs string[]
    end

    for _, name in ipairs(jobs) do
        if Framework.getJob() == name then
            return true
        end
    end

    return false
end

return utils