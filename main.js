'use strict';


const utils = require('@iobroker/adapter-core');


var snmp = require ("net-snmp");



let adapter;




function startAdapter(options) {
   
    return adapter = utils.adapter(Object.assign({}, options, {
        name: 'webersystems',
		
        ready: dataPolling, 
		
        unload: (callback) => {
            try {
                clearInterval(systmiods);

                callback();
            } catch (e) {
                callback();
            }
        },

         stateChange: (id, state) => {
            if (state) {
                // The state was changed
                // adapter.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
				

				
				
				
				
				var changeoid = id;				
				changeoid = changeoid.replace(/webersystems\.\d\./, ''); 
				changeoid = changeoid.replace(/(.*)\./, '');
				changeoid = changeoid.replace(/_/g, '.');
				
				// adapter.log.info(changeoid + " " + state.val);
							
								

				var regex = /1.3.6.1.2.1.2.2.1.7.[0-9]+/g;
				
				
				if (changeoid.match(regex)) {
					state.val = Number(state.val);
					var varbindss = [
						{
						oid: changeoid,
						type: snmp.ObjectType.Integer32,
						value: state.val
						}];
					// adapter.log.info("change to Interger");
				} else {
					var varbindss = [
						{
						oid: changeoid,
						type: snmp.ObjectType.OctetString,
						value: state.val
						}];
					// adapter.log.info("change to String");
				}
		
				var session = snmp.createSession (adapter.config.ipadresse, adapter.config.snmpcommunity);
				session.set (varbindss, function (error, varbindss) {
					if (error) {
						// adapter.log.info("setfunktion" + error);
					} else {
						}
				});		
				
            } else {
               
                adapter.log.info(`state ${id} deleted`);
            }
        },


    }));
}

async function systemoids() {

	var oids = ["1.3.6.1.2.1.1.1.0", "1.3.6.1.2.1.1.3.0", "1.3.6.1.2.1.1.4.0", "1.3.6.1.2.1.1.5.0", "1.3.6.1.2.1.1.6.0"];
	var oidss = Array.from(oids);
	oidss[0] = oidss[0].replace(/\./g, '_');
	oidss[1] = oidss[1].replace(/\./g, '_');
	oidss[2] = oidss[2].replace(/\./g, '_');
	oidss[3] = oidss[3].replace(/\./g, '_');
	oidss[4] = oidss[4].replace(/\./g, '_');
	
	oidss[0] = "system." + oidss[0];
	oidss[1] = "system." + oidss[1];
	oidss[2] = "system." + oidss[2];
	oidss[3] = "system." + oidss[3];
	oidss[4] = "system." + oidss[4];
	
    await adapter.setObjectNotExistsAsync(oidss[0], {
        type: 'state',
        common: {name: 'sysDescr', type: 'string', role: 'value', read: true, write: false},
        native: {},
    });
	await adapter.setObjectNotExistsAsync(oidss[1], {
        type: 'state',
        common: {name: 'sysUpTime', type: 'string', role: 'value', read: true, write: false},
        native: {},
    });
	await adapter.setObjectNotExistsAsync(oidss[2], {
        type: 'state',
        common: {name: 'sysContact', type: 'string', role: 'value', read: true, write: true},
        native: {},
    });
	await adapter.setObjectNotExistsAsync(oidss[3], {
        type: 'state',
        common: {name: 'sysName', type: 'string', role: 'value', read: true, write: true},
        native: {},
    });
	await adapter.setObjectNotExistsAsync(oidss[4], {
        type: 'state',
        common: {name: 'sysLocation', type: 'string', role: 'value', read: true, write: true},
        native: {},
    });
	

    adapter.log.info('config IP Adresse: ' + adapter.config.ipadresse);
    adapter.log.info('config SNMP Community: ' + adapter.config.snmpcommunity);
		var session = snmp.createSession (adapter.config.ipadresse, adapter.config.snmpcommunity);
		session.get (oids, function (error, varbinds) {
			if (error) {
				 adapter.log.info('snmp error');
			} else {
				// adapter.log.info('SNMP sysDescr: ' 		+ varbinds[0].value);
				// adapter.log.info('SNMP sysUpTime: ' 	+ varbinds[1].value);
				// adapter.log.info('SNMP sysContact: ' 	+ varbinds[2].value);
				// adapter.log.info('SNMP sysName: ' 		+ varbinds[3].value);			 
				// adapter.log.info('SNMP sysLocation: ' 	+ varbinds[4].value);
				adapter.setState(oidss[0], varbinds[0].value.toString(), true);			 
				adapter.setState(oidss[1], varbinds[1].value.toString(), true);			 
				adapter.setState(oidss[2], varbinds[2].value.toString(), true);			 
				adapter.setState(oidss[3], varbinds[3].value.toString(), true);			 
				adapter.setState(oidss[4], varbinds[4].value.toString(), true);
				adapter.subscribeStates(oidss[2]);
				adapter.subscribeStates(oidss[3]);
				adapter.subscribeStates(oidss[4]);
			}
        });
		


}

async function dataPolling() {
		var timer = 30000;
		
		setInterval(systmiods);
		
		
	}


if (module.parent) {

    module.exports = startAdapter;
} else {
   
    startAdapter();
}