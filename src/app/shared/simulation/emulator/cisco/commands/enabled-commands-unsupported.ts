import {TerminalCommand} from '../../interfaces/terminal-command';
import {NotSupportedCommand} from './notsupported';

export let unsupportedEnableCommands: TerminalCommand[] = [
        {
            name: 'access-enable',
            description: 'Create a temporary Access-List entry'
        },
        {name: 'access-profile', description: 'Apply user-profile to interface'},
        {
            name: 'access-template',
            description: 'Create a temporary Access-List entry'
        },
        {name: 'alps', description: 'ALPS exec commands'},
        {name: 'archive', description: 'manage archive files'},
        {
            name: 'authentication',
            description: 'Authentication options for eEdge'
        },
        {
            name: 'beep',
            description: 'Blocks Extensible Exchange Protocol commands'
        },
        {name: 'bfe', description: 'For manual emergency modes setting'},
        {name: 'calendar', description: 'Manage the hardware calendar'},
        {name: 'cd', description: 'Change current directory'},
        {name: 'clear', description: 'Reset functions'},
        {name: 'clock', description: 'Manage the system clock'},
        {name: 'cns', description: 'CNS agents'},
        {name: 'connect', description: 'Open a terminal connection'},
        {name: 'copy', description: 'Copy from one file to another'},
        {name: 'crypto', description: 'Encryption related commands.'},
        {name: 'debug', description: 'Debugging functions (see also 'undebug')'},
        {name: 'delete', description: 'Delete a file'},
        {name: 'dir', description: 'List files on a filesystem'},
        {
            name: 'do-exec',
            description: `Mode-independent \'do-exec\' prefix support`
        },
        {name: 'dot1x', description: 'IEEE 802.1X Exec Commands', aliases: ['do']},
        {name: 'eap', description: 'EAP Exec Commands'},
        {name: 'enable', description: 'Turn on privileged commands'},
        {name: 'erase', description: 'Erase a filesystem'},
        {name: 'ethernet', description: 'Ethernet parameters'},
        {name: 'event', description: 'Event related commands'},
        {name: 'format', description: 'Format a filesystem'},
        {name: 'fsck', description: 'Fsck a filesystem'},
        {
            name: 'help',
            description: 'Description of the interactive help system'
        },
        {name: 'if-mgr', description: 'IF-MGR operations'},
        {name: 'ip', description: 'Global IP commands'},
        {name: 'lat', description: 'Open a lat connection'},
        {name: 'lock', description: 'Lock the terminal'},
        {name: 'logging', description: 'Handles logging operations'},
        {name: 'login', description: 'Log in as a particular user'},
        {name: 'macro', description: 'Exec level macro commands'},
        {name: 'mediatrace', description: 'Mediatrace Commands'},
        {name: 'mkdir', description: 'Create new directory'},
        {name: 'monitor', description: 'Monitoring different system events'},
        {name: 'more', description: 'Display the contents of a file'},
        {name: 'mpls', description: 'MPLS commands'},
        {
            name: 'mrinfo',
            description: 'Request neighbor and version information from a multicast router'
        },
        {name: 'mrm', description: 'IP Multicast Routing Monitor Test'},
        {
            name: 'mstat',
            description: 'Show statistics after multiple multicast traceroutes'
        },
        {
            name: 'mtrace',
            description: 'Trace reverse multicast path from destination to source'
        },
        {
            name: 'name-connection',
            description: 'Name an existing network connection'
        },
        {name: 'ncia', description: 'Start/Stop NCIA Server'},
        {name: 'onep', description: 'ONEP related commands'},
        {name: 'pad', description: 'Open a X.29 PAD connection'},
        {name: 'ping', description: 'Send echo messages'},
        {name: 'port-channel', description: 'lag auto persistent'},
        {name: 'ppp', description: 'Start IETF Point-to-Point Protocol (PPP)'},
        {name: 'pwd', description: 'Display current working directory'},
        {name: 'release', description: 'Release a resource'},
        {name: 'reload', description: 'Halt and perform a cold restart'},
        {name: 'rename', description: 'Rename a file'},
        {name: 'renew', description: 'Renew a resource'},
        {name: 'restart', description: 'Restart Connection'},
        {name: 'resume', description: 'Resume an active network connection'},
        {name: 'rlogin', description: 'Open an rlogin connection'},
        {name: 'rmdir', description: 'Remove existing directory'},
        {name: 'routing-context', description: 'Routing Context'},
        {name: 'rsh', description: 'Execute a remote command'},
        {name: 'sdlc', description: 'Send SDLC test frames'},
        {name: 'send', description: 'Send a message to other tty lines'},
        {name: 'set', description: 'Set system parameter (not config)'},
        {name: 'setup', description: 'Run the SETUP command facility'},
        {name: 'slip', description: 'Start Serial-line IP (SLIP)'},
        {name: 'software', description: 'Software commands'},
        {name: 'software', description: 'Software commands'},
        {name: 'spec-file', description: 'format spec file commands'},
        {name: 'ssh', description: 'Open a secure shell client connection'},
        {name: 'start-chat', description: 'Start a chat-script on a line'},
        {
            name: 'systat',
            description: 'Display information about terminal lines'
        },
        {
            name: 'tarp',
            description: 'TARP (Target ID Resolution Protocol) commands'
        },
        {name: 'tclquit', description: 'Quit Tool Command Language shell'},
        {name: 'tclsh', description: 'Tool Command Language shell'},
        {name: 'telnet', description: 'Open a telnet connection'},
        {name: 'terminal', description: 'Set terminal line parameters'},
        {name: 'test', description: 'Test subsystems, memory, and interfaces'},
        {name: 'tn3270', description: 'Open a tn3270 connection'},
        {name: 'traceroute', description: 'Trace route to destination'},
        {name: 'tunnel', description: 'Open a tunnel connection'},
        {name: 'udld', description: 'UDLD protocol commands'},
        {name: 'udptn', description: 'Open an udptn connection'},
        {
            name: 'undebug',
            description: 'Disable debugging functions (see also 'debug')'
        },
        {name: 'upgrade', description: 'Upgrade commands'},
        {name: 'verify', description: 'Verify a file'},
        {name: 'where', description: 'List active connections'},
        {
            name: 'which-route',
            description: 'Do OSI route table lookup and display results'
        },
        {
            name: 'write',
            description: 'Write running configuration to memory, network, or terminal'
        },
        {name: 'x28', description: 'Become an X.28 PAD'},
        {name: 'x3', description: 'Set X.3 parameters on PAD'},
        {name: 'xconnect', description: 'Xconnect EXEC commands'},
        {name: 'xremote', description: 'Enter XRemote mode'}
    ];
