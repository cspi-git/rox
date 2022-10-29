"use strict";

// Dependencies
const request = require("request-async")
const chalk = require("chalk")

// Variables
var plugin = {}

//Main
plugin.information = function(){
    return {
        name: "Roblox: Game universal id",
        description: function(){
            return "Get game universal id."
        },
        date: "2021-10-1",
        working: "✓",
        rate: "good",
        options: {
            gameID: 0
        },
        authors: ["I2rys"]
    }
}

plugin.gameExists = function(gameID, callback){
    return new Promise(async(resolve)=>{
        var response = await request(`https://api.roblox.com/universes/get-universe-containing-place?placeid=${gameID}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
            }
        })

        response = response.body

        response.match("Error") ? resolve({ exists: false, result: response }) : resolve({ exists: true, result: JSON.parse(response) })
    })
}

plugin.main = function(options, callback){
    return new Promise(async(resolve, reject)=>{
        if(!typeof(options.gameid) === "number"){
            console.log(`[${chalk.rgb(255, 0, 128)("!")}] Variable GAME_ID should be a number not others.`)
            return resolve()
        }

        console.log(`[${chalk.rgb(108, 153, 187)("!")}] Checking if the game exists & grabbing the game universal id.`)
        const results = await plugin.gameExists(options.gameid)
       
        results.exists ? console.log(`[${chalk.rgb(108, 153, 187)("!")}] Game universal id is ${results.result.UniverseId}.`) : console.log(`[${chalk.rgb(255, 0, 128)("!")}] Unable to find the place with the id you specified.`)

        resolve()
    })
}

module.exports = {
    information: plugin.information,
    main: plugin.main
}