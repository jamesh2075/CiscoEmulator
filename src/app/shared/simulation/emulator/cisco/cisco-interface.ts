import { ICiscoDevice, ICiscoInterface, LinkStatus } from './icisco-device';
import { EmulatorDeviceState } from '../emulator-state';
import { EmulatedInterface, EmulatedInterfaceBase } from '../emulated-interface';
import { IEmulatedInterface } from '../interfaces/iemulated-device';
import { InterfaceModel } from '../../simulation-model';
import { CiscoFormatters } from './common/cisco-formatters';

export class CiscoInterface extends EmulatedInterfaceBase implements ICiscoInterface {
  onPeerStatusChanged(peerStatus: string): void {
    let newStatus = "";
    if (peerStatus === 'up') {
      // if(this.model.status === 'admin down') {} // no change
      //   newStatus = 'down';
      // }
      if (this.model.status === 'down') {
        newStatus = 'up';
      }
    } else if (peerStatus === 'admin down') {
      if (this.model.status !== 'admin down') {
        newStatus = 'down';
      }
    } else if (peerStatus === 'down') {
      if (this.model.status !== 'admin down') {
        newStatus = 'down';
      }
    } 

    if (newStatus && this.model.status !== newStatus) {
      this.changeStatus(newStatus);
    }
  }
  onStatusChanged(): void {
    let iface: any = this.model; // typed to 'any' so we can access $class
    let time: number = Date.now(); // now
    let statusText = iface.status;
    if (statusText === 'admin down') {
      statusText = 'administratively down';
    }
    let output = `*${CiscoFormatters.formatDate(new Date(time))}: %LINK-3-UPDOWN: Interface ${iface.$class}${iface.slot}/${iface.port}, changed state to ${statusText}
`;
    // TODO: this._output.next(output);
  };

  noShutdown() {
    if (!this.connection || ! this.connection.peer) {
      return;
    }
    let peerStatus = this.connection.peer.status;
    let newStatus = "";
    if (this.model.status === 'admin down') {
      if (peerStatus === 'admin down') {
        newStatus = 'down';
      }
      if (peerStatus === 'down') {
        newStatus = 'up';
      }
    } else if (this.model.status === 'admin down') {
    } else if (this.model.status === 'down') {
        if (peerStatus === 'down') {
          newStatus = 'up';
        }
    }

    this.changeStatus(newStatus);
  }

  shutdown() {
    if (!this.connection || ! this.connection.peer) {
      return;
    }
    let peerStatus = this.connection.peer.status;
    let newStatus: string = "";
    if (this.model.status === 'admin down') {
    } else if (this.model.status === 'down') {
        if (peerStatus === 'admin down') {
          newStatus = 'admin down';
        }
    } else if (this.model.status === 'up') {
      if (peerStatus === 'up') {
        newStatus = 'admin down';
      }
    }
    this.changeStatus(newStatus);
  }

  private changeStatus(newStatus: string) {
    if (!newStatus) {
      console.log('Error: interface setting undefined status, setting status to "down"');
      newStatus = 'down';
    }
    if (this.model.status !== newStatus) {
      this.setProperty('status', newStatus);
      this.onStatusChanged();
      if (this.connection && this.connection.peer) {
        this.connection.peer.onPeerStatusChanged(newStatus);
      }
    }
  }
}
