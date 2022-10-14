import { GetAllServers } from '/scripts/utils.js';

// Color Text
	const black 		  = "\u001b[30m",
	const red 		 	  = "\u001b[31m",
	const green 		  = "\u001b[32m",
	const yellow 		  = "\u001b[33m",
	const blue 			  = "\u001b[34m",
	const magenta 	 	  = "\u001b[35m",
	const cyan 		 	  = "\u001b[36m",
	const white 		  = "\u001b[37m",
	const brightBlack  	  = "\u001b[30;1m",
	const brightRed 	  = "\u001b[31;1m",
	const brightGreen     = "\u001b[32;1m",
	const brightYellow    = "\u001b[33;1m",
	const brightBlue 	  = "\u001b[34;1m",
	const brightMagenta   = "\u001b[35;1m",
	const brightCyan 	  = "\u001b[36;1m",
	const brightWhite     = "\u001b[37;1m",
	const reset           = "\u001b[0m"

/** @param {NS} ns */
export async function main(ns) {
	// Create our number formatter.
	var formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',

	// These options are needed to round to whole numbers if that's what you want.
	//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
	//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	});

	const servers = GetAllServers(ns);
	for (const server of servers) {
		var skill 	 = await ns.getHackingLevel(server);
		var ports	 = await ns.getServerNumPortsRequired(server);
		var ram 	 = await ns.getServerMaxRam(server);
		var money 	 = await formatter.format(ns.getServerMaxMoney(server));
		ns.tprint(green + "Server: " + server + cyan + " Ports: " + ports + magenta + yellow + " RAM: " + ram + red + " Skill: " + skill + white + " Money: " + money + reset);
	}
}