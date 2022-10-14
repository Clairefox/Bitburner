/** @param {NS} ns **/
export async function main(ns) {
	//ns.tprint(GetNextLevelXp(ns));

	//ns.tprint(HasFormulas(ns));

	// const servers = GetAllServers(ns);
	// ns.tprint(servers.length + ' ' + servers);

	// ns.tprint('path of ecorp is ' + GetServerPath(ns, 'ecorp'));
}

// Iterative network scan
export function GetAllServers(ns) {
	let servers = ['home'];
	for (const server of servers) {
		const found = ns.scan(server);
		if (server != 'home') found.splice(0, 1);
		servers.push(...found);
	}
	return servers;
}

// Find the path to a server
export function GetServerPath(ns, server) {
	const path = [server];
	while (server != 'home') {
		server = ns.scan(server)[0];
		path.unshift(server);
	}
	return path;
}

// Prints colored text to console. Arguments must be passed in pairs
// Usage: ColorPrint('red', 'This is some red text', '#FFFFFF', ' This is some white text);
export function ColorPrint(/* pass pairs of color, text */) {
	let findProp = propName => {
		for (let div of eval("document").querySelectorAll("div")) {
			let propKey = Object.keys(div)[1];
			if (!propKey) continue;
			let props = div[propKey];
			if (props.children?.props && props.children.props[propName]) return props.children.props[propName];
			if (props.children instanceof Array) for (let child of props.children) if (child?.props && child.props[propName]) return child.props[propName];
		}
	};
	let term = findProp("terminal");

	let out = [];
	for (let i = 0; i < arguments.length; i += 2) {
		let style = arguments[i];
		if (style.style == undefined) {
			style = { style: { color: arguments[i], backgroundColor: '#000000' } };
		}
		out.push(React.createElement("span", style, arguments[i + 1]))
	}
	try {
		term.printRaw(out);
	}
	catch { }
}

export function ServerReport(ns, server, metrics = undefined, printfunc = ns.print) {
	// Get server object for this server
	var so = ns.getServer(server);

	// weaken threads
	const tweaken = Math.ceil((so.hackDifficulty - so.minDifficulty) / 0.05 /*ns.weakenAnalyze(1, 1)*/);
	// grow threads
	const tgrow = Math.ceil(ns.growthAnalyze(server, so.moneyMax / Math.max(so.moneyAvailable, 1), 1));
	// hack threads
	const thack = Math.ceil(ns.hackAnalyzeThreads(server, so.moneyAvailable));

	printfunc('┌─────────────────────────────────────────────────────┐');
	printfunc('│ ' + server.padStart(52 / 2 + server.length / 2).padEnd(52) + '│');
	printfunc('├─────────────────────────────────────────────────────┤');
	printfunc('│ ' + ('Money        : ' + ns.nFormat(so.moneyAvailable, "$0.000a") + ' / ' + ns.nFormat(so.moneyMax, "$0.000a") + ' (' + (so.moneyAvailable / so.moneyMax * 100).toFixed(2) + '%)').padEnd(52) + '│');
	printfunc('│ ' + ('Security     : ' + (so.hackDifficulty - so.minDifficulty).toFixed(2) + ' min= ' + so.minDifficulty.toFixed(2) + ' current= ' + so.hackDifficulty.toFixed(2)).padEnd(52) + '│');
	printfunc('├─────────────────────────────────────────────────────┤');
	printfunc('│ ' + ('Weaken time  : ' + ns.tFormat(ns.formulas.hacking.hackTime(so, ns.getPlayer()) * 4) + ' (t=' + tweaken + ')').padEnd(52) + '│');
	printfunc('│ ' + ('Grow         : ' + ns.tFormat(ns.formulas.hacking.hackTime(so, ns.getPlayer()) * 3.2) + ' (t=' + tgrow + ')').padEnd(52) + '│');
	printfunc('│ ' + ('Hack         : ' + ns.tFormat(ns.formulas.hacking.hackTime(so, ns.getPlayer())) + ' (t=' + thack + ')').padEnd(52) + '│');
	printfunc('└─────────────────────────────────────────────────────┘');

	if (metrics != undefined) {
		metrics.Report(ns, printfunc);
	}
}