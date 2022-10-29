"use strict";

// Dependencies
const request = require("request-async")
const jsonHood = require("json-hood")
const chalk = require("chalk")
const fs = require("fs")

// Variables
var plugin = {}

// Main
plugin.information = function(){
    return {
        name: "Roblox: User friends",
        description: function(){
            return "Get user friends list."
        },
        date: "2021-9-30",
        working: "✓",
        rate: "good",
        options: {
            userID: 0,
            outputFile: "none"
        },
        authors: ["I2rys"]
    }
}

plugin.userIDExists = function(userID, callback){
    return new Promise(async(resolve)=>{
        var response = await request(`https://api.roblox.com/users/${userID}/friends`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
            }
        })

        response = response.body

        response.match('"errors"') ? resolve({ exists: false, results: response }) : resolve({ exists: true, results: JSON.parse(response) })
    })
}

plugin.main = function(options, callback){
    return new Promise(async(resolve, reject)=>{
        if(!typeof(options.userid) === "number"){
            console.log(`[${chalk.rgb(255, 0, 128)("!")}] Variable USERID should be a number not others.`)
            return resolve()
        }

        if(!typeof(options.userid) === "string"){
            console.log(`[${chalk.rgb(255, 0, 128)("!")}] Variable OUTPUTFILE should be a string not others.`)
            return resolve()
        }

        console.log(`[${chalk.rgb(108, 153, 187)("!")}] Checking if the user exists & grabbing user friends.`)
        const results = await plugin.userIDExists(options.userid)
        
        if(results.exists){
            if(!options.userid.match(".")){
                console.log(`[${chalk.rgb(255, 0, 128)("!")}] Variable OUTPUTFILE is invalid. Example: set OUTPUTFILE test.txt`)
                return resolve()
            }

            console.log(`[${chalk.rgb(108, 153, 187)("!")}] Saving the results.`)
            fs.writeFileSync(options.outputfile, jsonHood.getJSONasArrowDiagram(results.results), "utf8")
            console.log(`[${chalk.rgb(108, 153, 187)("!")}] Results has been saved to ${options.outputfile}`)
        }else{
            console.log(`[${chalk.rgb(255, 0, 128)("!")}] Unable to find the user with the id you specified.`)
        }

        resolve()
})
}

module.exports = {
    information: plugin.information,
    main: plugin.main
}