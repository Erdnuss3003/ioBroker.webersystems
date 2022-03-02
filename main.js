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
                clearInterval(timer);

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
				
				adapter.log.info(changeoid + " " + state.val);
							
								

				var regex = /1.3.6.1.2.1.2.2.1.7.[0-9]+/g;
				
				
				if (changeoid.match(regex)) {
					state.val = Number(state.val);
					var varbindss = [
						{
						oid: changeoid,
						type: snmp.ObjectType.Integer32,
						value: state.val
						}];
					adapter.log.info("change to Interger");
				} else {
					var varbindss = [
						{
						oid: changeoid,
						type: snmp.ObjectType.OctetString,
						value: state.val
						}];
					adapter.log.info("change to String");
				}
		
				var session = snmp.createSession (adapter.config.ipadresse, adapter.config.snmpcommunity);
				session.set (varbindss, function (error, varbindss) {
					if (error) {
						adapter.log.info("setfunktion" + error);
					} else {
						}
				});		
				
            } else {
               
                adapter.log.info(`state ${id} deleted`);
            }
        },


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
	
	oidss[0] = "system." + oidss[0];
	oidss[1] = "system." + oidss[1];
	oidss[2] = "system." + oidss[2];
	oidss[3] = "system." + oidss[3];
	oidss[4] = "system." + oidss[4];
	
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
		
		var oid = "1.3.6.1.2.1.2.2.1.1";
		
		var oiddescr = "1.3.6.1.2.1.2.2.1.2";
		var oiddescrvalue = "0";
		var oiddescrvaluee = "0";
		
		var oidtype = "1.3.6.1.2.1.2.2.1.3";
		var oidtypevalue = "0";
		var oidtypevaluee = "0";
		
		var oidmtu = "1.3.6.1.2.1.2.2.1.4";
		var oidmtuvalue = "0";
		var oidmtuvaluee = "0";
		
		var oidspeed = "1.3.6.1.2.1.2.2.1.5";
		var oidspeedvalue = "0";
		var oidspeedvaluee = "0";
		
		var oidphysaddress = "1.3.6.1.2.1.2.2.1.6";
		var oidphysaddressvalue = "0";
		var oidphysaddressvaluee = "0";
		var ifphysaddressvar = "0";
		
		var oidadminstatus = "1.3.6.1.2.1.2.2.1.7";
		var oidadminstatusvalue = "0";
		var oidadminstatusvaluee = "0";
		

		
		function doneCb (error) {
			if (error)
				 adapter.log.info ("done Cb" + error.toString ());
		}
		function feedCb (varbinds) {
			for (var i = 0; i < varbinds.length; i++) {
				if (snmp.isVarbindError (varbinds[i]))
					 adapter.log.info ('error walk');
				else
					// adapter.log.info (varbinds[i].oid + "|" + varbinds[i].value);
					oids = varbinds[i].oid;
					oids = oids.replace(/\./g, '_');
					oids = "interface." + varbinds[i].value + "." + oids;
					adapter.setObjectNotExistsAsync(oids, {type: 'state', common: {name: 'ifIndex', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
					adapter.setState(oids, varbinds[i].value.toString(), true);
					
					oiddescrvalue = oiddescr + "." + varbinds[i].value;
					oiddescrvaluee = oiddescrvalue.replace(/\./g, '_');
					oiddescrvaluee = "interface." + varbinds[i].value + "." + oiddescrvaluee;
					
					oidtypevalue = oidtype + "." + varbinds[i].value;
					oidtypevaluee = oidtypevalue.replace(/\./g, '_');
					oidtypevaluee = "interface." + varbinds[i].value + "." + oidtypevaluee;
					
					oidmtuvalue = oidmtu + "." + varbinds[i].value;
					oidmtuvaluee = oidmtuvalue.replace(/\./g, '_');
					oidmtuvaluee = "interface." + varbinds[i].value + "." + oidmtuvaluee;
					
					oidspeedvalue = oidspeed + "." + varbinds[i].value;
					oidspeedvaluee = oidspeedvalue.replace(/\./g, '_');
					oidspeedvaluee = "interface." + varbinds[i].value + "." + oidspeedvaluee;
					
					oidphysaddressvalue = oidphysaddress + "." + varbinds[i].value;
					oidphysaddressvaluee = oidphysaddressvalue.replace(/\./g, '_');
					oidphysaddressvaluee = "interface." + varbinds[i].value + "." + oidphysaddressvaluee;
										
					oidadminstatusvalue = oidadminstatus + "." + varbinds[i].value;
					oidadminstatusvaluee = oidadminstatusvalue.replace(/\./g, '_');
					oidadminstatusvaluee = "interface." + varbinds[i].value + "." + oidadminstatusvaluee;
											
					
					oids = [oiddescrvalue, oidtypevalue, oidmtuvalue, oidspeedvalue, oidphysaddressvalue, oidadminstatusvalue];
					
					session.get (oids, function (error, varbinds) {
						if (error) {
							// adapter.log.info('snmp error' + oid);
							} else {
								ifphysaddressvar = varbinds[4].value;
								ifphysaddressvar = ifphysaddressvar.toString();
								ifphysaddressvar = ifphysaddressvar.replace(/ /g, '');
								ifphysaddressvar = ifphysaddressvar.replace(/\"/g, '');
								// var varbinds4physaddress = varbinds[4].value;
								// var varbinds4physaddressrepl = varbinds4physaddress.replace(/:/g, '_');
								
								// adapter.log.info('ifDescr: ' 		+ varbinds[0].value);
								// adapter.log.info('ifType: ' 		+ varbinds[1].value);
								// adapter.log.info('ifMtu: ' 		+ varbinds[2].value);
								// adapter.log.info('ifSpeed: ' 		+ varbinds[3].value);
								adapter.log.info('ifPhysAddress: ' 		+ ifphysaddressvar);
								// adapter.log.info('ifAdminStatus: ' 		+ varbinds[5].value);
								
								adapter.setObjectNotExistsAsync(oiddescrvaluee, {type: 'state', common: {name: 'ifDecsr', type: 'string', role: 'value', read: true, write: false}, native: {}, });									
								adapter.setState(oiddescrvaluee, varbinds[0].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidtypevaluee, {type: 'state', common: {name: 'ifType', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidtypevaluee, varbinds[1].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidmtuvaluee, {type: 'state', common: {name: 'ifMtu', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidmtuvaluee, varbinds[2].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidspeedvaluee, {type: 'state', common: {name: 'ifSpeed', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidspeedvaluee, varbinds[3].value.toString(), true);
								
								// adapter.setObjectNotExistsAsync(oidphysaddressvaluee, {type: 'state', common: {name: 'ifPhysAddress', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								// adapter.setState(oidphysaddressvaluee, varbinds[4].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidadminstatusvaluee, {type: 'state', common: {name: 'ifAdminStatus', type: 'string', role: 'value', read: true, write: true}, native: {}, });								 
								adapter.setState(oidadminstatusvaluee, varbinds[5].value.toString(), true);
								adapter.subscribeStates(oidadminstatusvaluee);
								
								
								
						}
					
					});					
					
			}
		}
		var maxRepetitions = 20;


oid = "1.3.6.1.2.1.2.2.1.1";
session.subtree (oid, maxRepetitions, feedCb, doneCb);

}

async function dataPolling() {
		var timer = 30000;
		
		setInterval(main, timer);
		
		
	}


if (module.parent) {

    module.exports = startAdapter;
} else {
   
    startAdapter();
}