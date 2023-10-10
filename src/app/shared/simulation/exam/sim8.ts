import {
    SimDefinition,
    SimTask,
    SimDevice,
    SimConnection,
    SimConnectionEndpoint,
    SimDeviceType,
    SimCommandData
} from '../sim-definition';

let deviceTypes: { [key: string]: SimDeviceType } = {
    'IOSv': {
        commands: {
            'enable': {},
            'configure terminal': {},
            'interface': {}
        },
    }
};

let devices: SimDevice[] = [
    {
        name: 'SPOKE1',
        type: 'SIMPLE',
        subtype: 'IOSv',
        ipv4: '192.168.0.1',
        interfaces: [{
            id: 0,
            name: 'GigabitEthernet0/1',
            ipv4: '10.0.0.14',
            netPrefixLenV4: 30
        }]
        // interface Loopback0
        //  description Loopback
        //  ip address 2.2.2.2 255.255.255.255
        //
        // interface Loopback1
        //  ip address 10.2.2.1 255.255.255.0
        //
        // interface Tunnel2
        //  ip address 10.0.0.2 255.255.255.0
        //  ip nhrp authentication ACMEpass
        //  ip nhrp map multicast 1.1.1.1
        //  ip nhrp map 10.0.0.1 1.1.1.1
        //  ip nhrp network-id 1
        //  ip nhrp nhs 10.0.0.1
        //  tunnel source Loopback0
        //  tunnel destination 1.1.1.1
        //  tunnel key 2
        //  tunnel protection ipsec profile DMVPN
        //
        // interface GigabitEthernet0/0
        //  description OOB Management
        //  vrf forwarding Mgmt-intf
        //  ip address 10.255.0.54 255.255.0.0
        //  duplex full
        //  speed auto
        //  media-type rj45
        //
        // interface GigabitEthernet0/1
        //  description to ISP
        //  ip address 22.0.0.2 255.255.255.252
        //  ip access-group 100 in
        //  duplex full
        //  speed auto
        //  media-type rj45
    }, {
        name: 'SPOKE2',
        type: 'SIMPLE',
        subtype: 'IOSv',
        ipv4: '192.168.0.2',
        interfaces: [{
            id: 0,
            name: 'GigabitEthernet0/1',
            ipv4: '10.0.0.18',
            netPrefixLenV4: 30
        }, {
            name: 'Loopback0',
            ipv4: '3.3.3.3',
            ipv4Mask: '255.255.255.255'
        }, {
            name: 'Loopback1',
            ipv4: '10.3.3.1',
            ipv4Mask: '255.255.255.0'
        }, {
            name: 'Tunnel3',
            ipv4: '10.0.0.3',
            ipv4Mask: '255.255.255.255'
            // ip nhrp map multicast 1.1.1.1
            // ip nhrp map 10.0.0.1 1.1.1.1
            // ip nhrp network-id 1
            // ip nhrp nhs 10.0.0.1
            // tunnel source Loopback0
            // tunnel destination 1.1.1.1
            // tunnel key 3
            // tunnel protection ipsec profile DMVPN

            // interface Loopback0
            //  description Loopback
            //  ip address 3.3.3.3 255.255.255.255
            //
            // interface Loopback1
            //  ip address 10.3.3.1 255.255.255.0
            //
            // interface Tunnel3
            //  ip address 10.0.0.3 255.255.255.0
            //  ip nhrp authentication ACMEpass
            //  ip nhrp map multicast 1.1.1.1
            //  ip nhrp map 10.0.0.1 1.1.1.1
            //  ip nhrp network-id 1
            //  ip nhrp nhs 10.0.0.1
            //  tunnel source Loopback0
            //  tunnel destination 1.1.1.1
            //  tunnel key 3
            //  tunnel protection ipsec profile DMVPN
            //
            // interface GigabitEthernet0/0
            //  description OOB Management
            //  vrf forwarding Mgmt-intf
            //  ip address 10.255.0.55 255.255.0.0
            //  duplex full
            //  speed auto
            //  media-type rj45
            //
            // interface GigabitEthernet0/1
            //  description to ISP
            //  ip address 23.0.0.2 255.255.255.252
            //  ip access-group 100 in
            //  duplex full
            //  speed auto
            //  media-type rj45
        }]
    }, {
        name: 'OTHER',
        type: 'SIMPLE',
        subtype: 'IOSv',
        ipv4: '192.168.0.4',
        interfaces: [{
            id: 0,
            name: 'GigabitEthernet0/1',
            ipv4: '10.0.0.10',
            netPrefixLenV4: 30
        }]
        // interface Loopback0
        //  description Loopback
        //  ip address 4.4.4.4 255.255.255.255
        //
        // interface GigabitEthernet0/0
        //  description OOB Management
        //  vrf forwarding Mgmt-intf
        //  ip address 10.255.0.53 255.255.0.0
        //  duplex full
        //  speed auto
        //  media-type rj45
        //
        // interface GigabitEthernet0/1
        //  description to ISP
        //  ip address 24.0.0.2 255.255.255.252
        //  duplex full
        //  speed auto
        //  media-type rj45
    }, {
        name: 'HUB',
        type: 'SIMPLE',
        subtype: 'IOSv',
        ipv4: '192.168.0.3',
        interfaces: [{
            id: 0,
            name: 'GigabitEthernet0/1',
            ipv4: '10.0.0.5',
            netPrefixLenV4: 30
        }]
        // interface Loopback0
        //  description Loopback
        //  ip address 1.1.1.1 255.255.255.255
        //
        // interface Loopback1
        //  ip address 10.1.1.1 255.255.255.0
        //
        // interface Tunnel0
        //  no ip address
        //  tunnel protection ipsec profile DMVPN
        //
        // interface Tunnel1
        //  ip address 10.0.0.1 255.255.255.0
        //  no ip redirects
        //  no ip split-horizon eigrp 100
        //  ip nhrp authentication ACMEpass
        //  ip nhrp map multicast dynamic
        //  ip nhrp network-id 1
        //  tunnel source Loopback0
        //  tunnel mode gre multipoint
        //  tunnel key 1
        //  tunnel protection ipsec profile DMVPN
        //
        // interface GigabitEthernet0/0
        //  description OOB Management
        //  vrf forwarding Mgmt-intf
        //  ip address 10.255.0.51 255.255.0.0
        //  duplex full
        //  speed auto
        //  media-type rj45
        //
        // interface GigabitEthernet0/1
        //  description to ISP
        //  ip address 21.0.0.2 255.255.255.252
        //  ip access-group 100 in
        //  duplex full
        //  speed auto
        //  media-type rj45
    }, {
        name: 'ISP',
        type: 'SIMPLE',
        subtype: 'IOSv',
        ipv4: '192.168.0.5',
        interfaces: [{
            id: 0,
            name: 'GigabitEthernet0/1',
            ipv4: '10.0.0.6',
            netPrefixLenV4: 30
        }, {
            id: 1,
            name: 'GigabitEthernet0/2',
            ipv4: '10.0.0.13',
            netPrefixLenV4: 30
        }, {
            id: 2,
            name: 'GigabitEthernet0/3',
            ipv4: '10.0.0.17',
            netPrefixLenV4: 30
        }, {
            id: 3,
            name: 'GigabitEthernet0/4',
            ipv4: '10.0.0.9',
            netPrefixLenV4: 30
        }],
        noTerminal: true
    }
];

let connections: SimConnection[] = [
    {
        dest: {name: 'ISP', id: 3},
        src: {name: 'OTHER', id: 0}
    }, {
        dest: {name: 'ISP', id: 2},
        src: {name: 'SPOKE2', id: 0}
    }, {
        dest: {name: 'ISP', id: 1},
        src: {name: 'SPOKE1', id: 0}
    }, {
        dest: {name: 'ISP', id: 0},
        src: {name: 'HUB', id: 0}
    }
];

// let tasks: {[key: string]: SimTask} = {
//     // 'start': {
//     //   stateChanges: {
//     //     'SPOKE1': {}
//     //   }
//     // },
//     'A': {
//       description: 'Configure and Verify GRE',
//       // stateChanges: {
//       //   'SPOKE1': {},
//       //   'SPOKE2': {},
//       //   'HUB': {}
//       // },
//       // commandChanges: {
//       //   'SPOKE1': {},
//       //   'SPOKE2': {
//       //     'ip': {
//       //       'address': [{
//       //         parameters: '192.168.10.1 255.255.255.252',
//       //         handling: {}
//       //       },
//       //       {
//       //         // distractor
//       //         parameters: 'ipaddress ipmask',
//       //         handling: {}
//       //       }]
//       //     },
//       //     'tunnel': {
//       //       'source': [{
//       //           parameters: '[3.3.3.3 | loopback0]',
//       //           handling: {}
//       //         },
//       //         {
//       //           // distractor
//       //           parameters: '[loopback1 | tunnel2 | GigabitEthernet0/0 | GigabitEthernet0/1]',
//       //           handling: {}
//       //         }
//       //       ],
//       //       'destination': [{
//       //           parameters: '[4.4.4.4]',
//       //           handling: {}
//       //         },
//       //         {
//       //           // distractor
//       //           parameters: '[loopback0 | loopback1 | tunnel2 | GigabitEthernet0/0 | GigabitEthernet0/1 | ipaddress]',
//       //           handling: {}
//       //         }
//       //       ]
//       //     },
//       //     'keepalive': {}, // keepalive 15 2
//       //     'no ip address': {},
//       //     'no tunnel source': {},
//       //     'no tunnel destination': {}
//       //   },
//       //   'HUB': {}
//       // }
//     }
//   };

export let sim8: SimDefinition = {
    name: 'sim8',
    deviceTypes: deviceTypes,
    devices: devices,
    connections: connections
    //tasks: {}
    //commands: {},
    //strings: {}
};
