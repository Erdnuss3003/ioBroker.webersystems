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
                adapter.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
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
    await adapter.setObjectNotExistsAsync('sysname', {
        type: 'state',
        common: {name: '1.3.6.1.2.1.1.5.0', type: 'string', role: 'value', read: true, write: true},
        native: {},
    });
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // Die Adapterkonfiguration (im Instanzobjekt alles unter dem Attribut "native") ist erreichbar über
    // adapter.config:
    adapter.log.info('config option1: ' + adapter.config.option1);
    adapter.log.info('config option2: ' + adapter.config.option2);
    adapter.log.info('config IP Adresse: ' + adapter.config.ipadresse);
    adapter.log.info('config SNMP Community: ' + adapter.config.snmpcommunity);
       var session = snmp.createSession (adapter.config.ipadresse, adapter.config.snmpcommunity);
       var oids = ["1.3.6.1.2.1.1.5.0", "1.3.6.1.2.1.1.6.0"];
       session.get (oids, function (error, varbinds) {
          if (error) {
             adapter.log.info('snmp error');
          } else {
             adapter.log.info('SNMP sysname: ' + varbinds[0].value);
             adapter.log.info('SNMP syslocation: ' + varbinds[1].value);
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
	
	await adapter.setObjectNotExistsAsync('testVariable', {
        type: 'state',
        common: {name: 'testVariable', type: 'boolean', role: 'indicator', read: true, write: true},
        native: {},
    });


    // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
    adapter.subscribeStates('sysname');
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
    await adapter.setStateAsync('testVariable', true);

    // same thing, but the value is flagged "ack"
    // ack should be always set to true if the value is received from or acknowledged from the target system
    await adapter.setStateAsync('testVariable', { val: true, ack: true });

    // same thing, but the state is deleted after 30s (getState will return null afterwards)
    await adapter.setStateAsync('testVariable', { val: true, ack: true, expire: 30 });

    // examples for the checkPassword/checkGroup functions
    adapter.checkPassword('admin', 'iobroker', (res) => {
        adapter.log.info('check user admin pw iobroker: ' + res);
    });

    adapter.checkGroup('admin', 'admin', (res) => {
        adapter.log.info('check group user admin group admin: ' + res);
    });
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export startAdapter in compact mode
    module.exports = startAdapter;
} else {
    // otherwise start the instance directly
    startAdapter();
}