import { TerminalCommand } from '../../../../interfaces/terminal-command';
import { CommandState } from '../../../../interfaces/command-state';
import { CiscoCommandContext } from '../../../cisco-terminal-command';
import { NotSupportedCommand } from "../../notsupported";
import { CommandConstants } from '../../../common/cisco-constants';

export class BuildInterfacesDataOutput {
    static getOutput(interfaces: any[]) {
        let result = '';
        let loopbackResult = '';
        let portChannelResult = '';


        interfaces.forEach(function (port: any) {
            let name = port.name;
            let address = (port.address || 'fa16.3e6a.502e');
            let status = (port.status === 'up') ? port.status : `administratively down`;
            let duplex = (port.duplex) ? `${port.duplex}-duplex` : `unknown`;
            let speed = (port.speed) ? `${port.speed}-speed` : `unknown`;
            let statusText = (port.status === 'up') ? 'connected' : `disabled`;
            let internetAddress = (!port.internetAddress) ? `Internet address is ${port.internetAddress}/${port.subnet}` : '';
            if (port.$class === 'GigabitEthernet') {
                result += `${port.name} is ${status} , line protocol is ${port.protocol} (${statusText}) 
  Hardware is ${port.hardware}, address is ${address} (bia ${address})\n`;
                if (port.description) {
                    result += `  Description: ${port.description}\n`;
                };
                if (port.internetAddress) {
                    result += `  Internet address is ${port.internetAddress}/${port.subnet}\n`;
                }
                result += `  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec, 
     reliability 255/255, txload 1/255, rxload 1/255
  Encapsulation ARPA, loopback not set
  Keepalive set (10 sec)
  ${duplex}, ${speed}, link type is auto, media type is unknown media type
  output flow-control is unsupported, input flow-control is unsupported
  Auto-duplex, Auto-speed, link type is auto, media type is unknown
  input flow-control is off, output flow-control is unsupported 
  ARP type: ARPA, ARP Timeout 04:00:00
  Last input never, output 00:00:01, output hang never
  Last clearing of "show interface" counters never
  Input queue: 0/75/0/0 (size/max/drops/flushes); Total output drops: 0
  Queueing strategy: fifo
  Output queue: 0/0 (size/max)
  5 minute input rate 0 bits/sec, 0 packets/sec
  5 minute output rate 0 bits/sec, 0 packets/sec
     0 packets input, 0 bytes, 0 no buffer
     Received 0 broadcasts (0 multicasts)
     0 runts, 0 giants, 0 throttles 
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
     0 watchdog, 0 multicast, 0 pause input \n`;
                if (port.protocol === 'down') {
                    result += `     0 packets output, 0 bytes, 0 underruns \n`;
                }
                else {
                    let p = Math.floor(Math.random() * 6000) + 3000;
                    let b = p * 137;
                    result += `     ${p} packets output, ${b} bytes, 0 underruns \n`;
                }
                result += `     0 output errors, 0 collisions, 2 interface resets
     0 unknown protocol drops
     0 babbles, 0 late collision, 0 deferred
     0 lost carrier, 0 no carrier, 0 pause output
     0 output buffer failures, 0 output buffers swapped out \n`;

            }

            else if (port.$class === 'Port') {
                result += `${port.name} is up , line protocol is up (connected) 
  Hardware is EthernetChannel, address is 0000.0000.0000 (bia 0000.0000.0000)
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec, 
     reliability 255/255, txload 1/255, rxload 1/255
  Encapsulation ARPA, loopback not set
  Keepalive set (10 sec)
  Auto-duplex, Auto-speed, media type is unknown
  input flow-control is off, output flow-control is unsupported 
  ARP type: ARPA, ARP Timeout 04:00:00
  Last input never, output never, output hang never
  Last clearing of "show interface" counters never
  Input queue: 0/2000/0/0 (size/max/drops/flushes); Total output drops: 0
  Queueing strategy: fifo
  Output queue: 0/40 (size/max)
  5 minute input rate 0 bits/sec, 0 packets/sec
  5 minute output rate 0 bits/sec, 0 packets/sec
     0 packets input, 0 bytes, 0 no buffer
     Received 0 broadcasts (0 multicasts)
     0 runts, 0 giants, 0 throttles 
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
	 0 input packets with dribble condition detected
     0 packets output, 0 bytes, 0 underruns
     0 output errors, 0 collisions, 0 interface resets
     0 unknown protocol drops
     0 babbles, 0 late collision, 0 deferred
     0 lost carrier, 0 no carrier, 0 pause output
     0 output buffer failures, 0 output buffers swapped out \n`
            }
            else {
                loopbackResult += `${port.name} is up, line protocol is up 
  Hardware is ${port.hardware}
  Description: Loopback
  MTU 1514 bytes, BW 8000000 Kbit/sec, DLY 5000 usec, 
  reliability 255/255, txload 1/255, rxload 1/255
  Encapsulation LOOPBACK, loopback not set
  Keepalive set (10 sec)
  Last input never, output never, output hang never
  Last clearing of "show interface" counters never
  Input queue: 0/75/0/0 (size/max/drops/flushes); Total output drops: 0
  Queueing strategy: fifo
  Output queue: 0/0 (size/max)
  5 minute input rate 0 bits/sec, 0 packets/sec
  5 minute output rate 0 bits/sec, 0 packets/sec
     0 packets input, 0 bytes, 0 no buffer
     Received 0 broadcasts (0 IP multicasts)
     0 runts, 0 giants, 0 throttles 
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored, 0 abort
     0 packets output, 0 bytes, 0 underruns
     0 output errors, 0 collisions, 0 interface resets
     0 unknown protocol drops
     0 output buffer failures, 0 output buffers swapped out \n`;

            }
        });
        result += loopbackResult;

        return result;
    }
}

