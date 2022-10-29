//Dependencies
const rra = require("recursive-readdir-async")
const readLine = require("readline-sync")
const columnify = require("columnify")
const chalk = require("chalk")
const path = require("path")
const _ = require("lodash")

//Variables
var rox = {
    plugins: [],
    use: ">"
}

rox.randomBanner = function(){
    require("./modules/banners.js")()
}

rox.information = function(){
    console.log()
    console.log(chalk.rgb(57, 107, 215)(`―――――─━[ Developed by Hanaui ]━─―――――
――――─━[      Rox v1.0.0     ]━─――――
―――─━[  ${rox.plugins.length} plugins loaded   ]━─―――`))
}

rox.parsePlugins = async function(files){
    return new Promise((resolve, reject)=>{
        for( const file of files ){
            rox.plugins.push({
                path: file.path.match(/Rox\/plugins\/.*/)[0].replace("Rox/plugins/", ""),
                fullPath: file.fullname
            })
        }

        resolve()
    })
}

rox.useHandler = function(commandArgs, backType){
    if(!commandArgs[1]){
        console.log("Usage: use <plugin>")
        
        if(backType === "navigation"){
            rox.navigation()
        }else if(backType === "useNavigation"){
            rox.useNavigation()
        }

        return
    }

    if(!_.find(rox.plugins, { path: commandArgs[1] })){
        console.log(`[${chalk.rgb(255, 0, 128)("!")}] Unable to use the plugin, please make sure It's valid.`)

        if(backType == "navigation"){
            rox.navigation()
        }else if(backType == "useNavigation"){
            rox.useNavigation()
        }

        return
    }

    if(backType === "navigation"){
        if(_.find(rox.plugins, { path: commandArgs[1] })){
            rox.use = `${commandArgs[1]}>`
            rox.useNavigation(require(path.resolve(`${__dirname}\\plugins`, commandArgs[1], "main.js")).information(), commandArgs[1])
        }else{
            console.log(`[${chalk.rgb(255, 0, 128)("!")}] Unable to use the plugin, please check If It's valid.`)
            rox.useNavigation(require(path.resolve(`${__dirname}\\plugins`, commandArgs[1], "main.js")).information(), commandArgs[1])
        }
    }else if(backType === "useNavigation"){
        if(_.find(rox.plugins, { path: commandArgs[1] })){
            rox.use = `${commandArgs[1]}>`
            rox.useNavigation(require(path.resolve(`${__dirname}\\plugins`, commandArgs[1], "main.js")).information(), commandArgs[1])
        }else{
            console.log(`[${chalk.rgb(255, 0, 128)("!")}] Unable to use the plugin, please check If It's valid.`)
            rox.navigation()
        }
    }
}

rox.searchPlugins = function(commandArgs, callback, extra){
    if(!commandArgs[1]){
        console.log("Usage: search <keyword>")
        return callback(extra)
    }
    
    commandArgs[1] = commandArgs[1].toLowerCase()

    var matchedPlugins = []

    for( let i in rox.plugins ){
        var result = {
            highlighted: null,
            fullPath: null
        }

        result.fullPath = rox.plugins[i].fullPath
        result.description = require(result.fullPath).information().description()
        result.working = require(result.fullPath).information().working
        result.rate = require(result.fullPath).information().rate
        result.date = require(result.fullPath).information().date
        result.authors = require(result.fullPath).information().authors

        if(rox.plugins[i].path.match(commandArgs[1])){
            var splitted = rox.plugins[i].path.split("/")

            for( let i in splitted ) if(splitted[i] == commandArgs[1]) splitted[i] = chalk.rgb(255, 0, 128)(splitted[i])
            for( let i in splitted ) result.highlighted ? result.highlighted += `/${splitted[i]}` : result.highlighted = splitted[i]

            if(JSON.stringify(result).indexOf("[") !== -1) matchedPlugins.push(result)
        }
    }
    if(!matchedPlugins.length){
        console.log(`[${chalk.rgb(255, 0, 128)("!")}] No plugins found using the keyword you specified.`)
        return rox.navigation()
    }
    
    console.log()
    console.log(columnify(matchedPlugins, {
        minWidth: 15,
        config: {
            "highlighted": {
                headingTransform: function(){
                    return "Use"
                }
            },
            "working": {
                headingTransform: function(){
                    return "Working"
                }
            },
            "rate": {
                headingTransform: function(){
                    return "Rate"
                }
            },
            "description": {
                headingTransform: function(){
                    return "Description"
                }
            },
            "authors": {
                headingTransform: function(){
                    return "Authors"
                }
            },
            "date": {
                headingTransform: function(){
                    return "Date"
                }
            }
        },
        columns: ["highlighted", "working", "rate", "description", "authors", "date"]
    }))

    console.log()
    callback(extra)
}

rox.listPlugins = function(callback, extra){
    const plugins = []

    if(!rox.plugins){
        console.log(`[${chalk.rgb(255, 0, 128)("!")}] No loaded plugins found.`)
        return callback(extra)
    }

    for( const plugin of rox.plugins ){
        var information = require(plugin.fullPath).information()
        information.description = information.description()
        information.use = plugin.path

        plugins.push(information)
    }
    
    console.log()
    console.log(columnify(plugins, {
        minWidth: 15,
        config: {
            "use": {
                headingTransform: function(){
                    return "Use"
                }
            },
            "working": {
                headingTransform: function(){
                    return "Working"
                }
            },
            "rate": {
                headingTransform: function(){
                    return "Rate"
                }
            },
            "description": {
                headingTransform: function(){
                    return "Description"
                }
            },
            "authors": {
                headingTransform: function(){
                    return "Authors"
                }
            },
            "date": {
                headingTransform: function(){
                    return "Date"
                }
            }
        },
        columns: ["use", "working", "rate", "description", "authors", "date"]
    }))

    console.log()
    callback(extra)
}

rox.useNavigation = function(pluginInformation){
    var options = pluginInformation.options

    Object.keys(options).forEach(key =>{
        var value = options[key]

        delete options[key]

        options[key.toUpperCase()] = value
    })

    const command = readLine.question(`${chalk.rgb(122, 223, 242)("rox")} {${rox.use}} `)
    const commandArgs = command.split(" ")

    if(command === "help"){
        console.log(`
Command             Description
┉┉┉┉┉┉┉             ┉┉┉┉┉┉┉┉┉┉┉
help                Help menu
plugins             Show all loaded plugins.
options             Show plugin options
use                 Use specific plugin in plugins
run                 Run the plugin with your settings
set                 Set a value to the specific variable in the used plugin
search              Search for plugins that matched your keyword
clear               Clear the console
exit                Exit Rox
        `)
        rox.useNavigation(pluginInformation)
    }else if(command === "plugins"){
        rox.listPlugins(rox.useNavigation, pluginInformation)
    }else if(command === "run"){
        var tempOptions = options

        Object.keys(tempOptions).forEach(key =>{
            var value = tempOptions[key]
    
            delete tempOptions[key]
    
            tempOptions[key.toLowerCase()] = value
        })

        async function handler(){
            await require(`${__dirname}\\plugins\\${rox.use.replace(">", "")}\\main.js`).main(tempOptions).then(function(callback){
                rox.useNavigation(pluginInformation)
            })
        }

        handler()
    }else if(commandArgs[0] === "set"){
        if(!commandArgs[1]){
            console.log("Usage: set <variable> <value>")
            return rox.useNavigation(pluginInformation)
        }

        if(!commandArgs[2]){
            console.log(`[${chalk.rgb(255, 0, 128)("!")}] Unable to set the value to the variable, please check if the variable is valid.`)
            return rox.useNavigation(pluginInformation)
        }

        if(options[commandArgs[1]] !== undefined){
            options[commandArgs[1]] = commandArgs[2]

            console.log(`[${chalk.rgb(108, 153, 187)("!")}] ${commandArgs[1]} => ${commandArgs[2]}`)
            return rox.useNavigation(pluginInformation)
        }else{
            console.log(`[${chalk.rgb(255, 0, 128)("!")}] Unable to set the value to the variable, please check if the variable is valid.`)
            return rox.useNavigation(pluginInformation)
        }
    }else if(command === "options"){
        console.log("")
        console.log(columnify(options, {
            minWidth: 15,
            columns: ["Variable", "Value"],
            config: {
                "Variable": {
                    headingTransform: function(){
                        return "Variable"
                    }
                },
                "Value": {
                    headingTransform: function(){
                        return "Value"
                    }
                }
            }
        }))

        console.log()
        return rox.useNavigation(pluginInformation)
    }else if(command === "clear"){
        console.clear()
        return rox.useNavigation(pluginInformation)
    }else if(command === "exit"){
        console.clear()
        process.exit()
    }else if(commandArgs[0] === "use"){
        rox.useHandler(commandArgs, "navigation")
    }else if(commandArgs[0] === "search"){
        rox.searchPlugins(commandArgs, rox.useNavigation, pluginInformation)
    }else{
        console.log(`[${chalk.rgb(255, 0, 128)("!")}] Unknown command.`)
        rox.useNavigation(pluginInformation)
        return
    }
}

rox.navigation = function(){
    const command = readLine.question(`${chalk.rgb(122, 223, 242)("rox")} {${rox.use}} `)
    const commandArgs = command.split(" ")

    if(command === "help"){
        console.log(`
Command             Description
┉┉┉┉┉┉┉             ┉┉┉┉┉┉┉┉┉┉┉
help                Help menu
plugins             Show all loaded plugins.
use                 Use specific plugin in plugins
search              Search for plugins that matched your keyword
clear               Clear the console
exit                Exit Rox
        `)
        rox.navigation()
    }else if(command === "plugins"){
        rox.listPlugins(rox.navigation)
    }else if(command === "clear"){
        console.clear()
        rox.navigation()
    }else if(command === "exit"){
        console.clear()
        process.exit()
    }else if(commandArgs[0] === "use"){
        rox.useHandler(commandArgs, "navigation")
    }else if(commandArgs[0] === "search"){
        rox.searchPlugins(commandArgs, rox.navigation)
    }else{
        console.log(`[${chalk.rgb(255, 0, 128)("!")}] Unknown command.`)
        rox.navigation()
    }
}

rox.start = async function(){
    const files = await rra.list("./plugins", { realPath: true })

    await rox.parsePlugins(files)

    rox.randomBanner()
    rox.information()

    console.log()
    rox.navigation()
}

//Main
rox.start()