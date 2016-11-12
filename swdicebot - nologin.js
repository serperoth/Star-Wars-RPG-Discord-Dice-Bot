//Star Wars RPG Discord Dice Bot
//by @Serperoth#8607, with a major overhaul and some code borrowed from @Tezzeret#5206
//version 1.5b
//needs: testing on result display, testing, bugchecking, options for duty/obligation/morality, as well as destiny and the like



// dice rolling now seperate functions
// dice functions take numbers as arguments and can roll multiple dice
// this should serve as better base for XdY format

var Discord = require('discord.js')
var bot = new Discord.Client()
var abs = Math.abs

var success = 0
var failure = 0
var advantage = 0
var threat = 0
var triumph = 0
var despair = 0
var light = 0
var dark = 0
var result = 0
var resultstext = ''
var verbose = 1

bot.on('message', msg => {
	// Set the prefix
	let prefix = '!'
	// Exit and stop if it's not there
	if (!msg.content.startsWith(prefix)) return
	// Exit and stop if it would be responding to a bot
	if (msg.author.bot) return
	if (msg.content.startsWith(prefix + 'roll')) {
		resetVariables()
		let args = msg.content.split(' ').slice(1)
		let dice = args.join(' ')
		for (var i = 0, len = dice.length; i < len; i++) {
			switch (dice.charAt(i).toUpperCase()) {
				case 'B': boostDie(1); break
				case 'S': setbackDie(1); break
				case 'A': abilityDie(1); break
				case 'D': difficultyDie(1); break
				case 'P': proficiencyDie(1); break
				case 'C': challengeDie(1); break
				case 'F': forceDie(1); break
				default: break
			}
		}
		// tally up net success/failure
		let success_total = success - failure
		let success_state = ' success\n'
		if (success_total < 1) {
			success_state = ' failure\n'
		}
		let advantage_total = advantage - threat
		let advantage_state = ' advantage/threat\n'
		if (advantage_total > 0) {
			advantage_state = ' advantage\n'
		} else if (advantage_total < 0) {
			advantage_state = ' threat\n'
		}
		let force_result = ''
		if ((light > 0) || (dark > 0)) {
			force_result = '' + light + ' light and ' + dark + ' dark'
		}
		let verbosetext = ''
		if (verbose == 1) {
			verbosetext += resultstext
		}
		//msg.channel.sendMessage("rolled a " + result + '\n' + "failure: " + failure + '\n' + "threat: " + threat + '\n' + "despair: " + despair)
		msg.channel.sendMessage(verbosetext + 'final result:\n' + abs(success_total) + success_state + abs(advantage_total) + advantage_state + force_result + '\ntriumph: ' + triumph + ' despair: ' + despair)
	}
	if (msg.content.startsWith(prefix + 'orokos')){	//kinda wanna rewrite the whole section, it was working earlier
		resetVariables()
		let args = msg.content.split(' ').slice(1)
		let dice = args.join(' ')
		dice = dice.split(' ')	//Ideally, should have each set of XdY as a string in the array, we know it works
		for (var i = 0, len = dice.length; i < len; i++) {	//Do the thing for every XdY I think the issue might be here???
			switch (dice[i].charAt(dice[i].length - 1).toUpperCase()) {	//for the current XdY, look at the last character 
				case 'B': boostDie(parseInt(dice[i])); break
				case 'S': setbackDie(parseInt(dice[i])); break
				case 'A': abilityDie(parseInt(dice[i])); break
				case 'D': difficultyDie(parseInt(dice[i])); break
				case 'P': proficiencyDie(parseInt(dice[i])); break
				case 'C': challengeDie(parseInt(dice[i])); break
				case 'F': forceDie(parseInt(dice[i])); break
				default: break
			}
		}
		// tally up net success/failure
		let success_total = success - failure
		let success_state = ' success\n'
		if (success_total < 1) {
			success_state = ' failure\n'
		}
		let advantage_total = advantage - threat
		let advantage_state = ' advantage/threat\n'
		if (advantage_total > 0) {
			advantage_state = ' advantage\n'
		} else if (advantage_total < 0) {
			advantage_state = ' threat\n'
		}
		let force_result = ''
		if ((light > 0) || (dark > 0)) {
			force_result = '' + light + ' light and ' + dark + ' dark'
		}

		//msg.channel.sendMessage("rolled a " + result + '\n' + "failure: " + failure + '\n' + "threat: " + threat + '\n' + "despair: " + despair)
		msg.channel.sendMessage(resultstext + 'final result:\n' + abs(success_total) + success_state + abs(advantage_total) + advantage_state + force_result + '\ntriumph: ' + triumph + ' despair: ' + despair)
	}
	if (msg.content.startsWith(prefix + 'help')){
		msg.channel.sendMessage("Use !roll then write the dice by their first letter (AADD would roll two Ability dice, and two Difficulty dice)\nUse !orokos then write the dice in XY format, with X being the amount you need and Y being the kind of die.\nIn orokos format, separate the dice sets with spaces, and it doesn't matter what's between X and Y.")
	}
	if (msg.content.startsWith(prefix + 'verboseon')){
		verbose = 1 

	}
	if (msg.content.startsWith(prefix + 'verboseoff')){
		verbose = 0
		msg.channel.sendMessage('Results will not include individual rolls')

	}
	if (msg.content.startsWith(prefix + 'duty')){
		msg.channel.sendMessage(verbose)
	}
})

bot.on('ready', () => {
	console.log('I am ready!')
})

bot.login("")



//reset all variables for a new roll
function resetVariables(){
	success = 0
	failure = 0
	advantage = 0
	threat = 0
	triumph = 0
	despair = 0
	light = 0
	dark = 0
	result = 0
	resultstext = ''
}

// Boost Die, d6
function boostDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 6) + 1
		resultstext += 'Rolled a Boost Die and got a ' + result + ' for a result of '
		switch (result) {
			case 3:	// 1 success
				resultstext += '1 success.\n'
				success++
				break
			case 4:	// 1 success, 1 advantage
				resultstext += '1 success and 1 advantage.\n'
				success++
				advantage++
				break
			case 5:	// 2 advantage
				resultstext += '2 advantage.\n'
				advantage++
				advantage++
				break
			case 6:	// 1 advantage
				resultstext += '1 advantage.\n'
				advantage++
				break
			default:
				resultstext += 'nothing.\n'
				break
		}
		i++
	}
}

// Setback Die, d6
function setbackDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 6) + 1
		resultstext += 'Rolled a Setback Die and got a ' + result + ' for a result of '
		switch (result) {
			case 3:	// 1 failure
				resultstext += '1 failure.\n'
				failure++
				break
			case 4:	// 1 failure
				resultstext += '1 failure.\n'
				failure++
				break
			case 5:	// 1 threat
					resultstext += '1 threat.\n'
				threat++
				break
			case 6:	// 1 threat
				resultstext += '1 threat.\n'
				threat++
				break
			default:
				resultstext += 'nothing.\n'
				break
		}
		i++
	}
}

// Ability Die, d8
function abilityDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 8) + 1
		resultstext += 'Rolled an Ability Die and got a ' + result + ' for a result of '
		switch (result) {
			case 2:	// 1 success
				resultstext += '1 success.\n'
				success++
				break
			case 3:	// 1 success
				resultstext += '1 success.\n'
				success++
				break
			case 4:	// 2 success
				resultstext += '2 successes.\n'
				success++
				success++
				break
			case 5:	// 1 advantage
				resultstext += '1 advantage.\n'
				advantage++
				break
			case 6:	// 1 advantage
				resultstext += '1 advantage.\n'
				advantage++
				break
			case 7:	// 1 success, 1 advantage
				resultstext += '1 success and 1 advantage.\n'
				success++
				advantage++
				break
			case 8:	// 2 advantage
				resultstext += '2 advantages.\n'
				advantage++
				advantage++
				break
			default:
				resultstext += 'nothing.\n'
				break
		}
		i++
	}
}

// Difficulty Die, d8
function difficultyDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 8) + 1
		resultstext += 'Rolled a Difficulty Die and got a ' + result + ' for a result of '
		switch (result) {
			case 2:	// 1 failure
				resultstext += '1 failure.\n'
				failure++
				break
			case 3:	// 2 failure
				resultstext += '2 failures.\n'
				failure++
				failure++
				break
			case 4:	// 1 threat
				resultstext += '1 threat.\n'
				threat++
				break
			case 5:	// 1 threat
				resultstext += '1 threat.\n'
				threat++
				break
			case 6:	// 1 threat
				resultstext += '1 threat.\n'
				threat++
				break
			case 7:	// 2 threat
				resultstext += '2 threats.\n'
				threat++
				threat++
				break
			case 8:	// 1 failure, 1 threat
				resultstext += '1 failure and 1 threat.\n'
				failure++
				threat++
				break
			default:
				resultstext += 'nothing.\n'
				break

		}
		i++
	}
}

// Proficiency Die, d12
function proficiencyDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 12) + 1
		resultstext += 'Rolled a Proficiency Die and got a ' + result + ' for a result of '
		switch (result) {
			case 2:	// 1 success
				resultstext += '1 success.\n'
				success++
				break
			case 3:	// 1 success
				resultstext += '1 success.\n'
				success++
				break
			case 4:	// 2 success
				resultstext += '2 successes.\n'
				success++
				success++
				break
			case 5:	// 2 success
				resultstext += '1 successes.\n'
				success++
				success++
				break
			case 6:	// 1 advantage
				resultstext += '1 advantage.\n'
				advantage++
				break
			case 7:	// 1 success, 1 advantage
				resultstext += '1 success and 1 advantage.\n'
				success++
				advantage++
				break
			case 8:	// 1 success, 1 advantage
				resultstext += '1 success and 1 advantage.\n'
				success++
				advantage++
				break
			case 9:	// 1 success, 1 advantage
				resultstext += '1 success and 1 advantage.\n'
				success++
				advantage++
				break
			case 10:	// 2 advantage
				resultstext += '2 advantages.\n'
				advantage++
				advantage++
				break
			case 11:	// 2 advantage
				resultstext += '2 advantages.\n'
				advantage++
				advantage++
				break
			case 12:	// 1 triumph (also includes 1 success)
				resultstext += '1 triumph.\n'
				success++
				triumph++
				break
			default:
				resultstext += 'nothing.\n'
				break
		}
		i++
	}
}

// Challenge Die, d12
function challengeDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 12) + 1
		resultstext += 'Rolled a Challenge Die and got a ' + result + ' for a result of '
		switch (result) {
			case 2:	// 1 failure
				resultstext += '1 failure.\n'
				failure++
				break
			case 3:	// 1 failure
				resultstext += '1 failure.\n'
				failure++
				break
			case 4:	// 2 failure
				resultstext += '2 failures.\n'
				failure++
				failure++
				break
			case 5:	// 2 failure
				resultstext += '2 failures.\n'
				failure++
				failure++
				break
			case 6:	// 1 threat
				resultstext += '1 threat.\n'
				threat++
				break
			case 7:	// 1 threat
				resultstext += '1 threat.\n'
				threat++
				break
			case 8:	// 1 failure, 1 threat
				resultstext += '1 failure and 1 threat.\n'
				failure++
				threat++
				break
			case 9:	// 1 failure, 1 threat
				resultstext += '1 failure and 1 threat.\n'
				failure++
				threat++
				break
			case 10:	// 2 threat
				resultstext += '2 threats.\n'
				threat++
				threat++
				break
			case 11:	// 2 threat
				resultstext += '2 threats.\n'
				threat++
				threat++
				break
			case 12:	// 1 despair (also includes 1 failure)
				resultstext += '1 despair.\n'
				failure++
				despair++
				break
			default:
				resultstext += 'nothing.\n'
				break
		}
		i++
	}
}

// Force Die, d12
function forceDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 12) + 1
		resultstext += 'Rolled a Force Die and got a ' + result + ' for a result of '
		switch (result) {
			case 1:	// 1 dark
				resultstext += '1 dark.\n'
				dark++
				break
			case 2:	// 1 dark
				resultstext += '1 dark.\n'
				dark++
				break
			case 3:	// 1 dark
				resultstext += '1 dark.\n'
				dark++
				break
			case 4:	// 1 dark
				resultstext += '1 dark.\n'
				dark++
				break
			case 5:	// 1 dark
				resultstext += '1 dark.\n'
				dark++
				break
			case 6:	// 1 dark
				resultstext += '1 dark.\n'
				dark++
				break
			case 7:	// 2 dark
				resultstext += '2 dark.\n'
				dark++
				dark++
				break
			case 8:	// 1 light
				resultstext += '1 light.\n'
				light++
				break
			case 9:	// 1 light
				resultstext += '1 light.\n'
				light++
				break
			case 10:	// 2 light
				resultstext += '2 light.\n'
				light++
				light++
				break
			case 11:	// 2 light
				resultstext += '2 light.\n'
				light++
				light++
				break
			case 12:	// 2 light
				resultstext += '2 light.\n'
				light++
				light++
				break
			default:
				resultstext += 'nothing.\n'
				break
		}
		i++
	}
}
