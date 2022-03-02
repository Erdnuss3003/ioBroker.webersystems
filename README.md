![Logo](admin/webersystems.png)
# ioBroker.webersystems

[![NPM version](http://img.shields.io/npm/v/iobroker.webersystems.svg)](https://www.npmjs.com/package/iobroker.webersystems)
[![Downloads](https://img.shields.io/npm/dm/iobroker.webersystems.svg)](https://www.npmjs.com/package/iobroker.webersystems)
![Number of Installations (latest)](http://iobroker.live/badges/webersystems-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/webersystems-stable.svg)
[![Dependency Status](https://img.shields.io/david/Erdnuss3003/iobroker.webersystems.svg)](https://david-dm.org/Erdnuss3003/iobroker.webersystems)
[![Known Vulnerabilities](https://snyk.io/test/github/Erdnuss3003/ioBroker.webersystems/badge.svg)](https://snyk.io/test/github/Erdnuss3003/ioBroker.webersystems)

[![NPM](https://nodei.co/npm/iobroker.webersystems.png?downloads=true)](https://nodei.co/npm/iobroker.webersystems/)

## SNMP Netzwork Switch Control adapter for ioBroker

Webersystems Test

Sopport for SNMP v2c

## Beschreibung

### System

| Name                	| Beschreibung             											|
|:------------------    |:-------------------:      										|
| sysDescr      		| System Beschreibung        										|
| sysUpTime				| Uptime vom System (hundertstel Sekunden seit Neustart)       		|
| sysContact       		| SNMP Contact        												|
| sysName				| SNMP Name        													|
| sysLocation			| SNMP Location        												|

### Interfaces

Die Interfaces können Hardware, Systeminterne oder VLAN Interfaces sein.

| Name                	| Beschreibung             											|
|:------------------    |:-------------------:      										|
| ifIndex      			| Index vom Interface  												|
| ifDescr				| Beschreibung vom Interface       									|
| ifType       			| Interface typ       												|
| ifMtu					| Maximale Paket größe       										|
| ifSpeed				| Interface Geschwindigkeit											|
| ifPhysAddress      	| Physikalische Adresse vom Interface       						|
| ifAdminStatus			| Interface Admin Status up (1) down (2) testing (3)       				|
| ifOperStatus       	| Interface Betrisbs Status up (1) down (2) testing (3) unknown (4) dormant (5) notPresent (6) lowerLayerDown (7)	|
| ifLastChange			| Uptime vom Interface       										|
| ifInOctets			| Eingegangene Octets         										|
| ifInUcastPkts      	| Eingegangene Unicast Pakete      									|
| ifInNUcastPkts		| Eingegangene Unknon Unicast Pakete (veraltet)						|
| ifInDiscards       	| Eingegangene verworfene Pakete          							|
| ifInErrors			| Eingegangene fehlerhafte Pakete        							|
| ifInUnknownProtos		| Eingegangene         							|
| ifOutOctets      		| System Beschreibung        										|
| ifOutUcastPkts		| Uptime vom System (hundertstel Sekunden seit Neustart)       		|
| ifOutNUcastPkts       | SNMP Contact        												|
| ifOutDiscards			| SNMP Name        													|
| ifOutErrors			| SNMP Location        												|
| ifOutQLen				| SNMP Name        													|
| ifSpecific			| SNMP Location        												|

## Changelog

### 0.0.1
* (Erdnuss3003) initial release

## License
MIT License

Copyright (c) 2022 Erdnuss3003 <christophweber2@gmx.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.