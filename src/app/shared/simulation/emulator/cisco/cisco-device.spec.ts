import { Observable } from 'rxjs/Observable';
import { CiscoDevice } from './cisco-device';
import { CiscoValidators } from "./common/cisco-validators";


export function main() {
  // KB - I just finished the part of Cisco-device that correctly selects the itnerfaces for etherchannels.
  //  What I'm missing is the case where the user types in a port-channel number that doesn't exist
  xdescribe('CiscoDevice', () => {
    it('establishes connections', () => {

    });

  });
}
