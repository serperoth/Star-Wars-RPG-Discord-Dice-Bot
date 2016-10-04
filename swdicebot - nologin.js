//Star Wars RPG Discord Dice Bot
//by @Serperoth#8607, with a major overhaul and some code borrowed from @Tezzeret#5206
//version 1.0
//needs: proper calculation and display of results, orokos style input, testing



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
			switch (dice.charAt(i)) {
				case 'B':	boostDie(1); break
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

		//msg.channel.sendMessage("rolled a " + result + '\n' + "failure: " + failure + '\n' + "threat: " + threat + '\n' + "despair: " + despair)
		msg.channel.sendMessage('final result:\n' + abs(success_total) + success_state + abs(advantage_total) + advantage_state + force_result)
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
}

// Boost Die, d6
function boostDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 6) + 1
		switch (result) {
			case 3:	// 1 success
				success++
				break
			case 4:	// 1 success, 1 advantage
				success++
				advantage++
				break
			case 5:	// 2 advantage
				advantage++
				advantage++
				break
			case 6:	// 1 advantage
				advantage++
				break
			default: break
		}
		i++
	}
}

// Setback Die, d6
function setbackDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 6) + 1
		switch (result) {
			case 3:	// 1 failure
				failure++
				break
			case 4:	// 1 failure
				failure++
				break
			case 5:	// 1 threat
				threat++
				break
			case 6:	// 1 threat
				threat++
				break
			default: break
		}
		i++
	}
}

// Ability Die, d8
function abilityDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 8) + 1
		switch (result) {
			case 2:	// 1 success
				success++
				break
			case 3:	// 1 success
				success++
				break
			case 4:	// 2 success
				success++
				success++
				break
			case 5:	// 1 advantage
				advantage++
				break
			case 6:	// 1 advantage
				advantage++
				break
			case 7:	// 1 success, 1 advantage
				success++
				advantage++
				break
			case 8:	// 2 advantage
				advantage++
				advantage++
				break
			default: break
		}
		i++
	}
}

// Difficulty Die, d8
function difficultyDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 8) + 1
		switch (result) {
			case 2:	// 1 failure
				failure++
				break
			case 3:	// 2 failure
				failure++
				failure++
				break
			case 4:	// 1 threat
				threat++
				break
			case 5:	// 1 threat
				threat++
				break
			case 6:	// 1 threat
				threat++
				break
			case 7:	// 2 threat
				threat++
				threat++
				break
			case 8:	// 1 failure, 1 threat
				failure++
				threat++
				break
			default: break
		}
		i++
	}
}

// Proficiency Die, d12
function proficiencyDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 12) + 1
		switch (result) {
			case 2:	// 1 success
				success++
				break
			case 3:	// 1 success
				success++
				break
			case 4:	// 2 success
				success++
				success++
				break
			case 5:	// 2 success
				success++
				success++
				break
			case 6:	// 1 advantage
				advantage++
				break
			case 7:	// 1 success, 1 advantage
				success++
				advantage++
				break
			case 8:	// 1 success, 1 advantage
				success++
				advantage++
				break
			case 9:	// 1 success, 1 advantage
				success++
				advantage++
				break
			case 10:	// 2 advantage
				advantage++
				advantage++
				break
			case 11:	// 2 advantage
				advantage++
				advantage++
				break
			case 12:	// 1 triumph (also includes 1 success)
				success++
				triumph++
				break
			default: break
		}
		i++
	}
}

// Challenge Die, d12
function challengeDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 12) + 1
		switch (result) {
			case 2:	// 1 failure
				failure++
				break
			case 3:	// 1 failure
				failure++
				break
			case 4:	// 2 failure
				failure++
				failure++
				break
			case 5:	// 2 failure
				failure++
				failure++
				break
			case 6:	// 1 threat
				threat++
				break
			case 7:	// 1 threat
				threat++
				break
			case 8:	// 1 failure, 1 threat
				failure++
				threat++
				break
			case 9:	// 1 failure, 1 threat
				failure++
				threat++
				break
			case 10:	// 2 threat
				threat++
				threat++
				break
			case 11:	// 2 threat
				threat++
				threat++
				break
			case 12:	// 1 despair (also includes 1 failure)
				failure++
				despair++
				break
			default: break
		}
		i++
	}
}

// Force Die, d12
function forceDie (num) {
	var i = 0
	while (i < num) {
		result = Math.floor(Math.random() * 12) + 1
		switch (result) {
			case 1:	// 1 dark
				dark++
				break
			case 2:	// 1 dark
				dark++
				break
			case 3:	// 1 failure
				failure++
				break
			case 4:	// 1 dark
				dark++
				break
			case 5:	// 1 dark
				dark++
				break
			case 6:	// 1 dark
				dark++
				break
			case 7:	// 2 dark
				dark++
				dark++
				break
			case 8:	// 1 light
				light++
				break
			case 9:	// 1 light
				light++
				break
			case 10:	// 2 light
				light++
				light++
				break
			case 11:	// 2 light
				light++
				light++
				break
			case 12:	// 2 light
				light++
				light++
				break
			default: break
		}
	}
}
