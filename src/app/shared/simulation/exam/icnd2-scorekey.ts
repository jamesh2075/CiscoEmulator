import { ExamItemScoreKey, ITaskScoreKey, IVerification } from './score/scorekey';

export let icnd2ScoreKey: ExamItemScoreKey = {
  'A': {
    points: 1,
    verify: [{
      devices: 'SW1',
      interfaces: ['gi1/0', 'gi1/1'],
      verify: {
          'switchport access vlan': 10,
          'switchport mode access': true,
          'shutdown': false,
          'channel-protocol': 'LACP',
          'channel-group 1 mode active': true,
        }
    }, {
      devices: 'SW1',
      interfaces: 'PortChannel 1',
      verify: {
          'switchport access vlan': 10,
          'switchport mode access': true,
          'shutdown': false
        }
    }],
    description: [
      'GigabitEthernet1/0 and GigabitEthernet1/1 on SW1 must be members of the same channel-group, configured in active mode',
      'GigabitEthernet1/0 and GigabitEthernet1/1 on SW1 must be enabled (no shutdown)',
      'Port-channel interface, associated with GigabitEthernet1/0 and GigabitEthernet1/1 on SW1 and both physical interfaces must ' +
      'be in access mode. Access VLAN must be VLAN 10'
    ]
  },
  'B': {
    points: 1,
    verify: {
      devices: 'SW2',
      verify: {
          'vtp mode transparent': true
      }
    },
    description: 'VTP Transparent Mode must be set'
  },
  'C': {
    points: 1,
    verify: [{
      devices: 'SW1',
      interfaces: ['gi3/0', 'gi3/1'],
      verify: {
          'shutdown': false,
          'channel-protocol': 'PAgP',
          'channel-group 2 mode desirable': true
        }
    }, {
      devices: 'SW1',
      interfaces: 'Port-channel 2',
      verify: {
         // 'shutdown': false, //commenting this out because it isn't required in the scenario
        }
    }, {
      devices: 'SW2',
      interfaces: ['gi3/0', 'gi3/1'],
      verify: {
          'shutdown': false,
          'channel-protocol': 'PAgP',
          'channel-group 2 mode auto': true
        }
    }, {
      devices: 'SW2',
      interfaces: 'Port-channel 2',
      verify: {
         // 'shutdown': false,
        }
    }],
    description: [
      'GigabitEthernet3/0 and GigabitEthernet3/1 on SW1 must be members of the same channel-group, configured in desirable mode.' +
      'GigabitEthernet3/0 and GigabitEthernet3/1 on SW2 must be members of the same channel-group, configured in auto mode',
      'GigabitEthernet1/0 and GigabitEthernet1/1 on SW1 must be enabled (no shutdown)',
      'GigabitEthernet3/0 and GigabitEthernet3/1 on SW1 and GigabitEthernet3/0 ' +
      'and GigabitEthernet3/1 on SW2 must be enabled (no shutdown)'
    ]
  },
  'D': {
    points: 1,
    verify: [{
      devices: ['SW1', 'SW2'],
      interfaces: ['gi3/0', 'gi3/1'],
      verify: {
          'switchport trunk allowed vlan 1-39,41-4094': true,
          'switchport trunk encapsulation dot1q': true,
          'switchport mode trunk': true
        }
    }, {
      devices: ['SW1', 'SW2'],
      interfaces: 'Port-channel2',
      verify: {
          'switchport trunk allowed vlan 1-39,41-4094': true,
          'switchport trunk encapsulation dot1q': true,
          'switchport mode trunk': true
        }
    }],
    description: [
      'Interfaces GigabitEthernet3/0 and GigabitEthernet3/1 and port-channel X (X is the number used for creating ' +
      'channel-group in Task C) on both switches must be configured with dot1q encapsulation and trunk mode',
      'Interfaces GigabitEthernet3/0 and GigabitEthernet3/1 and port-channel X (X is the number used for creating ' +
      'channel-group in Task C) on both switches must allow all VLANs except VLAN 40'
    ]
  },
  'E': {
    points: 1,
    verify: {
      devices: 'SW1',
      interfaces: 'gi2/0',
      verify: { 'switchport nonegotiate': true }
    },
    description: ['GigabitEthernet2/0 must be configured with “switchport nonegotiate” command']
  },
  'F': {
    points: 1,
    verify: {
      devices: ['SW1', 'SW2'],
      verify: { 'spanning-tree mode rapid-pvst': true }
    },
    description: ['RPVST+ must be configured on both switches']
  },
  'G': {
    points: 1,
    verify: {
      devices: 'SW2',
      verify: { 'no spanning-tree vlan 40': true }
    },
    description: ['RPVST+ must be disabled in VLAN 40']
  },
  'H': {
    points: 1,
    verify: {
      devices: 'SW1',
      verify: { 'spanning-tree vlan 10 priority 0': true }
    },
    description: ['SW1 must be root bridge for VLAN 10']
  }
};
