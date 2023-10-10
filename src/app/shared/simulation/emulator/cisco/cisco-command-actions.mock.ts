import {
  CiscoAction,
  CiscoCommandAction,
  ICiscoCommandActions,
  PortChannelActionModel,
  ChannelGroupActionModel,
  ShutdownActionModel,
  NoShutdownActionModel
} from './cisco-command-actions';

export class MockCiscoCommandActions implements ICiscoCommandActions {
  portChannel(model: PortChannelActionModel): CiscoCommandAction<PortChannelActionModel> {
    return this.mockResult(CiscoAction.PortChannel, model);
  }
  channelGroup(model: ChannelGroupActionModel): CiscoCommandAction<ChannelGroupActionModel> {
    return this.mockResult(CiscoAction.ChannelGroup, model);
  }
  shutdown(model: ShutdownActionModel): CiscoCommandAction<ShutdownActionModel> {
    return this.mockResult(CiscoAction.Shutdown, model);
  }
  noShutdown(model: NoShutdownActionModel): CiscoCommandAction<NoShutdownActionModel> {
    return this.mockResult(CiscoAction.NoShutdown, model);
  }

  constructor() {}
  private mockResult<T>(actionId: CiscoAction, model: T): CiscoCommandAction<T> {
    return { actionId: actionId, model: model, do: null };
  }
}
