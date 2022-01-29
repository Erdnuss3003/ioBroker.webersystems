'use strict';

/*
 * Created with @iobroker/create-adapter v1.26.3
 */
// The adapter-core module gives you access to the core ioBroker functions
// Das Adapter-Core-Modul gibt Ihnen Zugriff auf die Kernfunktionen von ioBroker 
// you need to create an adapter
// Sie müssen einen Adapter erstellen 
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const fs = require("fs");
var snmp = require ("net-snmp");

/**
 * The adapter instance
 * @type {ioBroker.Adapter}
 */
let adapter;

/**
 * Starts the adapter instance
 * @param {Partial<utils.AdapterOptions>} [options]
 */
function startAdapter(options) {
    // Create the adapter and define its methods
    // Den Adapter erstellen und seine Methoden definieren 
    return adapter = utils.adapter(Object.assign({}, options, {
        name: 'webersystems',

        // The ready callback is called when databases are connected and adapter received configuration.
	// Der Ready-Callback wird aufgerufen, wenn Datenbanken verbunden sind und der Adapter die Konfiguration erhalten hat. 
        // start here!

        ready: main, // Main method defined below for readability


        // is called when adapter shuts down - callback has to be called under any circumstances!
        // wird beim Beenden des Adapters aufgerufen - Callback muss auf jeden Fall aufgerufen werden!
        unload: (callback) => {
            try {
                // Here you must clear all timeouts or intervals that may still be active
                // Hier müssen Sie alle eventuell noch aktiven Timeouts oder Intervalle löschen 
                // clearTimeout(timeout1);
                // clearTimeout(timeout2);
                // ...
                // clearInterval(interval1);

                callback();
            } catch (e) {
                callback();
            }
        },

        // If you need to react to object changes, uncomment the following method.
        // Wenn Sie auf Objektänderungen reagieren müssen, kommentieren Sie die folgende Methode aus. 
        // You also need to subscribe to the objects with `adapter.subscribeObjects`, similar to `adapter.subscribeStates`.
        // objectChange: (id, obj) => {
        //     if (obj) {
        //         // The object was changed
        //         adapter.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
        //     } else {
        //         // The object was deleted
        //         adapter.log.info(`object ${id} deleted`);
        //     }
        // },

        // is called if a subscribed state changes
        // wird aufgerufen, wenn sich ein abonnierter Status ändert 
        stateChange: (id, state) => {
            if (state) {
                // The state was changed
                // adapter.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
				var changeoid = id;				
				changeoid = changeoid.replace(/webersystems\.\d\./, ''); 
				changeoid = changeoid.replace(/_/g, '.');
				
				adapter.log.info(changeoid + state.val);
				
				
				
				
				var varbindss = [
					{
						oid: changeoid,
						type: snmp.ObjectType.OctetString,
						value: state.val
					}
				];
				var session = snmp.createSession (adapter.config.ipadresse, adapter.config.snmpcommunity);
				session.set (varbindss, function (error, varbindss) {
					if (error) {
						adapter.log.info('snmp error');
					} else {
						}
				});
				
				
				
				
				
				
            } else {
                // The state was deleted
                adapter.log.info(`state ${id} deleted`);
            }
        },

        // If you need to accept messages in your adapter, uncomment the following block.
        // Wenn Sie Nachrichten in Ihrem Adapter akzeptieren müssen, kommentieren Sie den folgenden Block aus.
        // /**
        //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
        //  * Using this method requires "common.message" property to be set to true in io-package.json
        //  */
        // message: (obj) => {
        //     if (typeof obj === 'object' && obj.message) {
        //         if (obj.command === 'send') {
        //             // e.g. send email or pushover or whatever
        //             adapter.log.info('send command');

        //             // Send response in callback if required
        //             if (obj.callback) adapter.sendTo(obj.from, obj.command, 'Message received', obj.callback);
        //         }
        //     }
        // },
    }));
}

async function main() {
	var oids = ["1.3.6.1.2.1.1.1.0", "1.3.6.1.2.1.1.3.0", "1.3.6.1.2.1.1.4.0", "1.3.6.1.2.1.1.5.0", "1.3.6.1.2.1.1.6.0"];
	var oidss = Array.from(oids);
	oidss[0] = oidss[0].replace(/\./g, '_');
	oidss[1] = oidss[1].replace(/\./g, '_');
	oidss[2] = oidss[2].replace(/\./g, '_');
	oidss[3] = oidss[3].replace(/\./g, '_');
	oidss[4] = oidss[4].replace(/\./g, '_');
    await adapter.setObjectNotExistsAsync(oidss[0], {
        type: 'state',
        common: {name: 'sysdescr', type: 'string', role: 'value', read: true, write: false},
        native: {},
    });
	await adapter.setObjectNotExistsAsync(oidss[1], {
        type: 'state',
        common: {name: 'sysuptime', type: 'string', role: 'value', read: true, write: false},
        native: {},
    });
	await adapter.setObjectNotExistsAsync(oidss[2], {
        type: 'state',
        common: {name: 'syscontact', type: 'string', role: 'value', read: true, write: true},
        native: {},
    });
	await adapter.setObjectNotExistsAsync(oidss[3], {
        type: 'state',
        common: {name: 'sysname', type: 'string', role: 'value', read: true, write: true},
        native: {},
    });
	await adapter.setObjectNotExistsAsync(oidss[4], {
        type: 'state',
        common: {name: 'syslocation', type: 'string', role: 'value', read: true, write: true},
        native: {},
    });
	
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // Die Adapterkonfiguration (im Instanzobjekt alles unter dem Attribut "native") ist erreichbar über
    // adapter.config:
    // adapter.log.info('config option1: ' + adapter.config.option1);
    // adapter.log.info('config option2: ' + adapter.config.option2);
    adapter.log.info('config IP Adresse: ' + adapter.config.ipadresse);
    adapter.log.info('config SNMP Community: ' + adapter.config.snmpcommunity);
       var session = snmp.createSession (adapter.config.ipadresse, adapter.config.snmpcommunity);
       session.get (oids, function (error, varbinds) {
          if (error) {
             adapter.log.info('snmp error');
          } else {
			 adapter.log.info('SNMP sysDescr: ' + varbinds[0].value);
			 adapter.log.info('SNMP sysUpTime: ' + varbinds[1].value);
			 adapter.log.info('SNMP sysContact: ' + varbinds[2].value);
             adapter.log.info('SNMP sysName: ' + varbinds[3].value);			 
             adapter.log.info('SNMP sysLocation: ' + varbinds[4].value);
			 adapter.setState(oidss[0], varbinds[0].value.toString(), true);			 
			 adapter.setState(oidss[1], varbinds[1].value.toString(), true);			 
			 adapter.setState(oidss[2], varbinds[2].value.toString(), true);			 
			 adapter.setState(oidss[3], varbinds[3].value.toString(), true);			 
			 adapter.setState(oidss[4], varbinds[4].value.toString(), true);
          }
        });
		var oids = ["1.3.6.1.2.1.2.2.1.2"];
		var nonRepeaters = 0;

			session.getBulk (oids, nonRepeaters, function (error, varbinds) {
				if (error) {
					adapter.log.info (error.toString ());
				} else {
					// step through the non-repeaters which are single varbinds
					for (var i = 0; i < nonRepeaters; i++) {
						if (i >= varbinds.length)
							break;

						if (snmp.isVarbindError (varbinds[i]))
							adapter.log.info (snmp.varbindError (varbinds[i]));
						else
							adapter.log.info (varbinds[i].oid + "|" + varbinds[i].value);
					}

					// then step through the repeaters which are varbind arrays
					for (var i = nonRepeaters; i < varbinds.length; i++) {
						for (var j = 0; j < varbinds[i].length; j++) {
							if (snmp.isVarbindError (varbinds[i][j]))
								adapter.log.info (snmp.varbindError (varbinds[i][j]));
							else
								adapter.log.info (varbinds[i][j].oid + "|"
									+ varbinds[i][j].value);
						}
					}
				}
			});

    /*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
        Für jeden Zustand im System muss es auch ein Objekt vom Typ Zustand geben
        Hier eine einfache Vorlage für eine boolesche Variable namens "testVariable"
        Da jede Adapterinstanz ihren eigenen eindeutigen Namespace verwendet, können Variablennamen nicht mit anderen Adaptervariablen kollidieren
    */
	/*
	await adapter.setObjectNotExistsAsync('testVariable', {
        type: 'state',
        common: {name: 'testVariable', type: 'boolean', role: 'indicator', read: true, write: true},
        native: {},
    });
	*/

    // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
	adapter.subscribeStates(oidss[2]);
	adapter.subscribeStates(oidss[3]);
	adapter.subscribeStates(oidss[4]);
    adapter.subscribeStates('testVariable');
    // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
    // adapter.subscribeStates('lights.*');
    // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
    // adapter.subscribeStates('*');

    /*
        setState examples
        you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
    */

    // the variable testVariable is set to true as command (ack=false)
    // await adapter.setStateAsync('testVariable', true);

    // same thing, but the value is flagged "ack"
    // ack should be always set to true if the value is received from or acknowledged from the target system
    // await adapter.setStateAsync('testVariable', { val: true, ack: true });

    // same thing, but the state is deleted after 30s (getState will return null afterwards)
    // await adapter.setStateAsync('testVariable', { val: true, ack: true, expire: 30 });

    // examples for the checkPassword/checkGroup functions
    /*
	adapter.checkPassword('admin', 'iobroker', (res) => {
        adapter.log.info('check user admin pw iobroker: ' + res);
    });

    adapter.checkGroup('admin', 'admin', (res) => {
        adapter.log.info('check group user admin group admin: ' + res);
    });
	*/
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export startAdapter in compact mode
    module.exports = startAdapter;
} else {
    // otherwise start the instance directly
    startAdapter();
}