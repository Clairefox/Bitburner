/** @param {NS} ns */
export async function main(ns) {
    GetAllServers(ns).forEach(s => ns.ls(s, '.cct').forEach(c => ns.tprint('Found contract ' + c + ' on ' + s)));
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