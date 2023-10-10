import { IExamItemTask, IExamItemTasks } from './tester/examitem-spec';


export let icnd2SimSpec: IExamItemTasks = {
  'A': [{
    label: 'A1',
    devices: 'SW1',
    interfaces: ['gi1/0', 'gi1/1'], // implies 'interface range gi1/0-1'
    steps: [{
      label: 'Create channel group',
      commandLine: 'channel-group 1 mode active',
      distractors: []
    }, {
      label: 'Bring interface up',
      commandLine: 'no shutdown',
      distractors: []
    }]
  }, {
    label: 'A2',
    devices: 'SW1',
    interfaces: 'Port-channel 1',
    // dependencies: ['A1'],
    steps: [
      { commandLine: 'switchport access vlan 10', distractors: null },
      { commandLine: 'switchport mode access', distractors: null }
    ]
  }
  ],
  'B': {
    devices: 'SW2',
    //interfaces: 'Port-channel 1',
    label: 'Set VTP mode',
    steps: {
      commandLine: 'vtp mode transparent',
      distractors: []
    }
  },
  'C': [{
    devices: 'SW1',
    interfaces: ['gi3/0', 'gi3/1'], // implies 'interface range gi3/0-1'
    steps: [{
      label: 'Create channel group 2',
      commandLine: 'channel-group 2 mode desirable',
      distractors: []
    }, {
      commandLine: 'no shutdown',
      distractors: []
    }]
  }, {
    devices: 'SW2',
    interfaces: ['gi3/0', 'gi3/1'], // implies 'interface range gi3/0-1'
    steps: [{
      label: 'Create channel group 2',
      commandLine: 'channel-group 2 mode auto',
      distractors: []
    }, {
      commandLine: 'no shutdown',
      distractors: []
    }]
  },
  ],
  'D': [
    {
      label: 'D1',
      devices: ['SW1', 'SW2'],
      interfaces: 'Port-channel2',
      steps: {
        commandLine: 'switchport trunk encapsulation dot1q',
        distractors: []
      }
    },
    {
      label: 'D2',
      devices: ['SW1', 'SW2'],
      interfaces: 'Port-channel2',
      steps: {
        commandLine: 'switchport mode trunk',
        distractors: []
      }
    },
    {
      label: 'D3',
      devices: ['SW1', 'SW2'],
      interfaces: 'Port-channel2',
      selectOneStep: {
        commandLine: [
          'switchport trunk allowed vlan except 40',
          'switchport trunk allowed vlan remove 40',
          'switchport trunk allowed vlan 1-39,41-4096',
        ],
        distractors: []
      }
    },
  ],
  'E': {
    devices: 'SW1',
    interfaces: 'gi2/0',
    steps: {
      commandLine: 'switchport nonegotiate',
      distractors: []
    }
  },
  'F': {
    devices: ['SW1', 'SW2'],
    selectOneStep: {
      commandLine: [
        'spanning-tree mode rapid-pvst',
        'no spanning-tree mode'
      ],
      distractors: []
    }
  },
  'G': {
    devices: 'SW2',
    steps: {
      commandLine: 'no spanning-tree vlan 40',
      distractors: []
    }
  },
  'H': {
    devices: 'SW1',
    steps: {
      commandLine: 'spanning-tree vlan 10 priority 0',
      distractors: []
    }
  }
};
