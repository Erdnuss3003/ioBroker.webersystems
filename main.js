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

async function systemiods() {

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

async function interfaceiods() {


		
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
		
		var oidadminstatus = "1.3.6.1.2.1.2.2.1.7";
		var oidadminstatusvalue = "0";
		var oidadminstatusvaluee = "0";
		
		var oidoperstatus = "1.3.6.1.2.1.2.2.1.8";
		var oidoperstatusvalue = "0";
		var oidoperstatusvaluee = "0";
		
		var oidlastchange = "1.3.6.1.2.1.2.2.1.9";
		var oidlastchangevalue = "0";
		var oidlastchangevaluee = "0";
		
		var oidinoctets = "1.3.6.1.2.1.2.2.1.10";
		var oidinoctetsvalue = "0";
		var oidinoctetsvaluee = "0";
		
		var oidinucastpkts = "1.3.6.1.2.1.2.2.1.11";
		var oidinucastpktsvalue = "0";
		var oidinucastpktsvaluee = "0";
		
		var oidinnucastpkts = "1.3.6.1.2.1.2.2.1.12";
		var oidinnucastpktsvalue = "0";
		var oidinnucastpktsvaluee = "0";
		
		var oidindiscards = "1.3.6.1.2.1.2.2.1.13";
		var oidindiscardsvalue = "0";
		var oidindiscardsvaluee = "0";
		
		var oidinerrors = "1.3.6.1.2.1.2.2.1.14";
		var oidinerrorsvalue = "0";
		var oidinerrorsvaluee = "0";
		
		var oidinunkownprotos = "1.3.6.1.2.1.2.2.1.15";
		var oidinunkownprotosvalue = "0";
		var oidinunkownprotosvaluee = "0";
		
		var oidoutoctets = "1.3.6.1.2.1.2.2.1.16";
		var oidoutoctetsvalue = "0";
		var oidoutoctetsvaluee = "0";
		
		var oidoutucastpkts = "1.3.6.1.2.1.2.2.1.17";
		var oidoutucastpktsvalue = "0";
		var oidoutucastpktsvaluee = "0";
		
		var oidoutnucastpkts = "1.3.6.1.2.1.2.2.1.18";
		var oidoutnucastpktsvalue = "0";
		var oidoutnucastpktsvaluee = "0";
		
		var oidoutdiscards = "1.3.6.1.2.1.2.2.1.19";
		var oidoutdiscardsvalue = "0";
		var oidoutdiscardsvaluee = "0";
		
		var oidouterrors = "1.3.6.1.2.1.2.2.1.20";
		var oidouterrorsvalue = "0";
		var oidouterrorsvaluee = "0";
		
		var oidoutqlen = "1.3.6.1.2.1.2.2.1.21";
		var oidoutqlenvalue = "0";
		var oidoutqlenvaluee = "0";
		
		var oidspecific = "1.3.6.1.2.1.2.2.1.22";
		var oidspecificvalue = "0";
		var oidspecificvaluee = "0";

		
		var session = snmp.createSession (adapter.config.ipadresse, adapter.config.snmpcommunity);
		
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
					
					oidoperstatusvalue = oidoperstatus + "." + varbinds[i].value;
					oidoperstatusvaluee = oidoperstatusvalue.replace(/\./g, '_');
					oidoperstatusvaluee = "interface." + varbinds[i].value + "." + oidoperstatusvaluee;
					
					oidlastchangevalue = oidlastchange + "." + varbinds[i].value;
					oidlastchangevaluee = oidlastchangevalue.replace(/\./g, '_');
					oidlastchangevaluee = "interface." + varbinds[i].value + "." + oidlastchangevaluee;
					
					oidinoctetsvalue = oidinoctets + "." + varbinds[i].value;
					oidinoctetsvaluee = oidinoctetsvalue.replace(/\./g, '_');
					oidinoctetsvaluee = "interface." + varbinds[i].value + "." + oidinoctetsvaluee;
					
					oidinucastpktsvalue = oidinucastpkts + "." + varbinds[i].value;
					oidinucastpktsvaluee = oidinucastpktsvalue.replace(/\./g, '_');
					oidinucastpktsvaluee = "interface." + varbinds[i].value + "." + oidinucastpktsvaluee;
					
					oidinnucastpktsvalue = oidinnucastpkts + "." + varbinds[i].value;
					oidinnucastpktsvaluee = oidinnucastpktsvalue.replace(/\./g, '_');
					oidinnucastpktsvaluee = "interface." + varbinds[i].value + "." + oidinnucastpktsvaluee;
					
					oidindiscardsvalue = oidindiscards + "." + varbinds[i].value;
					oidindiscardsvaluee = oidindiscardsvalue.replace(/\./g, '_');
					oidindiscardsvaluee = "interface." + varbinds[i].value + "." + oidindiscardsvaluee;
					
					oidinerrorsvalue = oidinerrors + "." + varbinds[i].value;
					oidinerrorsvaluee = oidinerrorsvalue.replace(/\./g, '_');
					oidinerrorsvaluee = "interface." + varbinds[i].value + "." + oidinerrorsvaluee;
					
					oidinunkownprotosvalue = oidinunkownprotos + "." + varbinds[i].value;
					oidinunkownprotosvaluee = oidinunkownprotosvalue.replace(/\./g, '_');
					oidinunkownprotosvaluee = "interface." + varbinds[i].value + "." + oidinunkownprotosvaluee;
					
					oidoutoctetsvalue = oidoutoctets + "." + varbinds[i].value;
					oidoutoctetsvaluee = oidoutoctetsvalue.replace(/\./g, '_');
					oidoutoctetsvaluee = "interface." + varbinds[i].value + "." + oidoutoctetsvaluee;
					
					oidoutucastpktsvalue = oidoutucastpkts + "." + varbinds[i].value;
					oidoutucastpktsvaluee = oidoutucastpktsvalue.replace(/\./g, '_');
					oidoutucastpktsvaluee = "interface." + varbinds[i].value + "." + oidoutucastpktsvaluee;
					
					oidoutnucastpktsvalue = oidoutnucastpkts + "." + varbinds[i].value;
					oidoutnucastpktsvaluee = oidoutnucastpktsvalue.replace(/\./g, '_');
					oidoutnucastpktsvaluee = "interface." + varbinds[i].value + "." + oidoutnucastpktsvaluee;
					
					oidoutdiscardsvalue = oidoutdiscards + "." + varbinds[i].value;
					oidoutdiscardsvaluee = oidoutdiscardsvalue.replace(/\./g, '_');
					oidoutdiscardsvaluee = "interface." + varbinds[i].value + "." + oidoutdiscardsvaluee;
					
					oidouterrorsvalue = oidouterrors + "." + varbinds[i].value;
					oidouterrorsvaluee = oidouterrorsvalue.replace(/\./g, '_');
					oidouterrorsvaluee = "interface." + varbinds[i].value + "." + oidouterrorsvaluee;
					
					oidoutqlenvalue = oidoutqlen + "." + varbinds[i].value;
					oidoutqlenvaluee = oidoutqlenvalue.replace(/\./g, '_');
					oidoutqlenvaluee = "interface." + varbinds[i].value + "." + oidoutqlenvaluee;
					
					oidspecificvalue = oidspecific + "." + varbinds[i].value;
					oidspecificvaluee = oidspecificvalue.replace(/\./g, '_');
					oidspecificvaluee = "interface." + varbinds[i].value + "." + oidspecificvaluee;
											
					
					var oids = [oiddescrvalue, oidtypevalue, oidmtuvalue, oidspeedvalue, oidphysaddressvalue, oidadminstatusvalue, oidoperstatusvalue, oidlastchangevalue, oidinoctetsvalue, oidinucastpktsvalue, oidinnucastpktsvalue, oidindiscardsvalue, oidinerrorsvalue, oidinunkownprotosvalue, oidoutoctetsvalue, oidoutucastpktsvalue, oidoutnucastpktsvalue, oidoutdiscardsvalue, oidouterrorsvalue, oidoutqlenvalue, oidspecificvalue];
					
					session.get (oids, function (error, varbinds) {
						if (error) {
							// adapter.log.info('snmp error' + oid);
							} else {
								
								// adapter.log.info('ifDescr: ' 		+ varbinds[0].value);
								// adapter.log.info('ifType: ' 		+ varbinds[1].value);
								// adapter.log.info('ifMtu: ' 		+ varbinds[2].value);
								// adapter.log.info('ifSpeed: ' 		+ varbinds[3].value);
								// adapter.log.info('ifPhysAddress: ' 		+ varbinds[4].value);
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
								
								adapter.setObjectNotExistsAsync(oidoperstatusvaluee, {type: 'state', common: {name: 'ifOpenStatus', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidoperstatusvaluee, varbinds[6].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidlastchangevaluee, {type: 'state', common: {name: 'ifLastChange', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidlastchangevaluee, varbinds[7].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidinoctetsvaluee, {type: 'state', common: {name: 'ifInOctets', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidinoctetsvaluee, varbinds[8].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidinucastpktsvaluee, {type: 'state', common: {name: 'ifInUcastPkts', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidinucastpktsvaluee, varbinds[9].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidinnucastpktsvaluee, {type: 'state', common: {name: 'ifInNUcastPkts', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidinnucastpktsvaluee, varbinds[10].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidindiscardsvaluee, {type: 'state', common: {name: 'ifInDiscards', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidindiscardsvaluee, varbinds[11].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidinerrorsvaluee, {type: 'state', common: {name: 'ifInErrors', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidinerrorsvaluee, varbinds[12].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidinunkownprotosvaluee, {type: 'state', common: {name: 'ifInUnknownProtos', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidinunkownprotosvaluee, varbinds[13].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidoutoctetsvaluee, {type: 'state', common: {name: 'ifOutOctets', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidoutoctetsvaluee, varbinds[14].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidoutucastpktsvaluee, {type: 'state', common: {name: 'ifOutUcastPkts', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidoutucastpktsvaluee, varbinds[15].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidoutnucastpktsvaluee, {type: 'state', common: {name: 'ifOutNUcastPkts', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidoutnucastpktsvaluee, varbinds[16].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidoutdiscardsvaluee, {type: 'state', common: {name: 'ifOutDiscards', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidoutdiscardsvaluee, varbinds[17].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidouterrorsvaluee, {type: 'state', common: {name: 'ifOutErrors', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidouterrorsvaluee, varbinds[18].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidoutqlenvaluee, {type: 'state', common: {name: 'ifOutQLen', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidoutqlenvaluee, varbinds[19].value.toString(), true);
								
								adapter.setObjectNotExistsAsync(oidspecificvaluee, {type: 'state', common: {name: 'ifSpecific', type: 'string', role: 'value', read: true, write: false}, native: {}, });								 
								adapter.setState(oidspecificvaluee, varbinds[20].value.toString(), true);
								
								
								
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
		
		setInterval(systemiods, timer);
		setInterval(interfaceiods, timer);
		
		
	}


if (module.parent) {

    module.exports = startAdapter;
} else {
   
    startAdapter();
}