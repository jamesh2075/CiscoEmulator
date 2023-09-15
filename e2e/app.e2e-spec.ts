import { CiscoEmulatorPage } from './app.po';

describe('cisco-emulator App', () => {
  let page: CiscoEmulatorPage;

  beforeEach(() => {
    page = new CiscoEmulatorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
