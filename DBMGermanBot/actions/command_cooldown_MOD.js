module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Adjust Time Restriction",

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

	subtitle: function (data) {

		let value = parseInt(data.value);
		return `Command Cooldown: ${value} seconds`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "Aamon#9130",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.5", //Added in 1.9.5

	mod_version: "2",

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "This mod will restrict a command",

	donate_url: "https://paypal.me/Aamoneel",

	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	//variableStorage: function (data, varType) {
	//},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["value", "iftrue", "iffalse", "iftrueVal", "iffalseVal", "iftrueValue", "iffalseValue"],

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

	html: function (isEvent, data) {
		return `
	<div>
		<div>
			<p>
			Made by ${this.author}.<br>
			<span style="color: #FF0080; cursor: pointer" class="dntlink" data-url="${this.donate_url}"><b><u>Donate!</u></b></span>
			</p>
		</div>
		<div style="float: left; width: 90%; padding-top: 15px;">
			Time<br>
			<input id="value" class="round" type="text" placeholder="Insert Seconds Here (eg: 60 -for 1 min)..."><br>
		</div><br><br><br><br>
		<div style="float: left; width: 35%; padding-top: 8px;">
			If Cooldown is active:<br>
			<select id="iftrue" class="round" onchange="glob.onTrueChange(this)">
				<option value="0" selected>Continue Actions</option>
				<option value="1">Stop Action Sequence</option>
				<option value="2">Jump to Action</option>
				<option value="3">Skip Actions</option>
			</select>
		</div>
		<div id="iftrueVal" style="float: right; display: none; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="iftrueValue" class="round" type="text">
		</div><br><br><br><br>
		<div style="float: left; width: 35%; padding-top: 8px;">
			If Cooldown is inactive:<br>
			<select id="iffalse" class="round" onchange="glob.onFalseChange(this)">
				<option value="0">Continue Actions</option>
				<option value="1" selected>Stop Action Sequence</option>
				<option value="2">Jump to Action</option>
				<option value="3">Skip Actions</option>
			</select>
		</div>
		<div id="iffalseVal" style="float: right; display: none; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="iffalseValue" class="round" type="text">
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

	init: function () {
		const { glob, document } = this;
		try {
			const link = document.getElementsByClassName("dntlink");
			for (let x = 0; x < link.length; x++) {
				const dntlink = link[x],
					url = dntlink.getAttribute('data-url');
				if (url) {
					dntlink.setAttribute("title", url);
					dntlink.addEventListener("click", function (e) {
						e.stopImmediatePropagation();
						require('child_process').execSync('start ' + url);
					});
				}
			}
		} catch (err) {
			console.log(err);
		};
		glob.onTrueChange = function() {
			const iftrueVal = document.getElementById('iftrueVal');
			const iftrue = document.getElementById('iftrue').value;
			switch(parseInt(iftrue)) {
				case 0:
				case 1:
					iftrueVal.style.display = 'none';
					break;
				case 2:
				case 3:
					iftrueVal.style.display = null;
					break;
			};
		};
		glob.onFalseChange = function() {
			const iffalseVal = document.getElementById('iffalseVal');
			const iffalse = document.getElementById('iffalse').value;
			switch(parseInt(iffalse)) {
				case 0:
				case 1:
					iffalseVal.style.display = 'none';
					break;
				case 2:
				case 3:
					iffalseVal.style.display = null;
					break;
			};
		};
		glob.onTrueChange(document.getElementById('iftrue'));
		glob.onFalseChange(document.getElementById('iffalse'));
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {
		const data = cache.actions[cache.index];
		const value = parseInt(data.value);//Amount of Cooldown
		const iftrue = parseInt(data.iftrue);
		const iftrueValue = parseInt(this.evalMessage(data.iftrueValue, cache));
		const iffalse = parseInt(data.false);
		const iffalseValue = parseInt(this.evalMessage(data.iffalseValue, cache));

		console.log('Running...');

		//in the future update---- verify member permission/ add to dbm editor (maybe yes, maybe not)

		var check = this.getDBM().Actions.Cooldown(cache.msg.author.id, value);
		setTimeout(function() {
			console.log('Checking input...');
			console.log(check);
			if(check) {
				console.log('RUNNING: true');
				const index = Math.max(iftrueValue - 1, 0);
				const index2 = cache.index + iftrueValue + 1;
				switch(iftrue) {
					case 0:
						this.callNextAction(cache);
						break;
					case 1:
						break;
					case 2:
						if(cache.actions[index]) {
							cache.index = index - 1;
							this.callNextAction(cache);
						};
						break;
					case 3:
						if(cache.actions[index2]) {
							cache.index = index2 - 1;
							this.callNextAction(cache);
						};
						break;
				};
			} else {
				console.log('RUNNING: false');
				const index = Math.max(iffalseValue - 1, 0);
				const index2 = cache.index + iffalseValue + 1;
				switch(iffalse) {
					case 0:
						this.callNextAction(cache);
						break;
					case 1:
						break;
					case 2:
						if(cache.actions[index]) {
							cache.index = index - 1;
							this.callNextAction(cache);
						};
						break;
					case 3:
						if(cache.actions[index2]) {
							cache.index = index2 - 1;
							this.callNextAction(cache);
						};
						break;
				};
			};
		}, 3500);
	},

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function (DBM) {
		
		/*
		DBM.Actions.userCooldown = {};
		*/

		DBM.Actions.initCooldown = function() {
			const WrexMods = this.getWrexMods();
			const del = WrexMods.require('del');
			const fs = require('fs');
			fs.mkdir('./data/cooldowns', { recursive: true }, (error) => {});
			(async () => {
				const deletedPaths = await del(['data/cooldowns/*']);
				console.log('Cooldown directory cleared:\n', deletedPaths.join('\n'));
			})();
		};

		DBM.Actions.Cooldown = function(id, amount) {
			console.log('Checking...');
			const fs = require('fs');
			var file;
			fs.readFile(`./data/cooldowns/${id}/cooldown.txt`, function(error, data) {
				if(error) {
					fs.mkdir(`./data/cooldowns/${id}/`, { recursive: true }, (error) => {
						if(error) {
							console.log('MRDIR Error:');
							console.error(error);
						} else {
							fs.writeFile(`./data/cooldowns/${id}/cooldown.txt`, 'false', function (error) {
								if(error) {
									console.log('WRITE FILE Error:');
									console.error(error);
								};
							});
							fs.readFile(`./data/cooldowns/${id}/cooldown.txt`, function(error, data) {
								if(error) {
									console.log('READ FILE Error:');
									console.error(error);
								} else {
									file = false;
								};
							});
						};
					});
				} else if(data !== undefined) {
					file = data;
				};
			});
			var check;
			console.log('Loading Data...');
			setTimeout(function() {
				console.log('Reloading...');
				file = fs.readFileSync(`./data/cooldowns/${id}/cooldown.txt`, 'utf8');
				if(file == 'true') {
					//Member has time restriction
					console.log('true');
					check = true;
				} else {
					//Member can use the command
					fs.writeFile(`./data/cooldowns/${id}/cooldown.txt`, 'true', function (error) {
						if(error) console.error(error);
					});
					setTimeout(() => {
						fs.writeFile(`./data/cooldowns/${id}/cooldown.txt`, 'false', function (error) {
							if(error) console.error(error);
						});
					}, amount * 1000)
					console.log('false');
					check = false;
				};
			}, 3000);
			while(true) {
				if(check !== undefined) {
					console.log('Returning Data...');
					return check;
				};
				console.log(check);
				console.log('Waiting...');
			};
		};

		DBM.Actions.initCooldown();

		/* Aamon's old function: (It doesn't cause those dumb errors in your console...)
		DBM.Actions.Cooldown = function(id, amount) {
			if(DBM.Actions.userCooldown[id]) {
				//Member has time restriction
				return true;
			} else {
				//Member can use the command
				DBM.Actions.userCooldown[id] = true;
				setTimeout(() => {
					userCooldown[id] = false;
				}, amount * 1000)
				return false;
			};
		};
		*/
	}

}; // End of module