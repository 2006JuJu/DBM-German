module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Read File",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Other Stuff",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
    const info1 = data.filename;
    return `Read File "${data.filename}"`;
},

    //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------

    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "EliteArtz",

    // The version of the mod (Defaults to 1.0.0)
    version: "1.8.7", //Added in 1.8.6

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Reads a File you wan't",

    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


    //---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    const filename = parseInt(data.filename);
    let dataType = 'File';
    return ([data.varName2, dataType]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["filename", "storage", "varName2"],

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editting actions.
//
// The "isEvent" parameter will be true if this action is being used
// for an event. Due to their nature, events lack certain information,
// so edit the HTML to reflect this.
//
// The "data" parameter stores constants for select elements to use.
// Each is an array: index 0 for commands, index 1 for events.
// The names are: sendTargets, members, roles, channels,
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
    return `
<div>
    <p>
        <u>Mod Info:</u><br>
        Created by EliteArtz<br><br>

        <u>Notice:</u><br>
        - Use currently "Parse from Stored Json" Mod by General Wrex. for getting Json object's etc<br>
        - Find Json Object's etc will added soon!<br>
        - The Files can only be read when they are in the bot files. e.g. "./data/commands.json"<br>
    </p>
    <div style="float: left; width: 60%">
        Path:
        <input id="filename" class="round" type="text">
    </div><br>
</div><br><br><br>
<div>
    <div style="float: left; width: 35%;">
        Store In:<br>
        <select id="storage" class="round">
            ${data.variables[1]}
        </select>
    </div>
    <div id="varNameContainer2" style="float: right; width: 60%;">
        Variable Name:<br>
        <input id="varName2" class="round" type="text"><br>
    </div>
</div>`
    },

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function (cache) {
    const
        data = cache.actions[cache.index],
        fs = require('fs'),
        FILENAME = this.evalMessage(data.filename, cache);
    var output = {};
    try {
        if (FILENAME) {
            output = fs.readFileSync(FILENAME, 'utf8');
            this.storeValue(output, parseInt(data.storage), this.evalMessage(data.varName2, cache), cache);
        } else {
            console.log(`Path is missing.`);
         }
    } catch (err) {
        console.error("ERROR!" + err.stack ? err.stack : err);
    }
    this.callNextAction(cache);
},

//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

mod: function(DBM) {}

}; // End of module
