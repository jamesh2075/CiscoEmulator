
import { EventSubscriber, EventDispatcher, On } from "event-dispatch";
import { CommandConstants } from "../common/cisco-constants";

@EventSubscriber()
export class ShutdownController {

    private static instance: ShutdownController;

    private static EVENT_DISPATCHER: EventDispatcher = new EventDispatcher();

    private eventDispatcher: EventDispatcher = ShutdownController.EVENT_DISPATCHER;

    static init() {
        if (!ShutdownController.instance) {
            ShutdownController.instance = new ShutdownController();
        }
    }


    @On(CommandConstants.EVENTS.SHUTDOWN)
    private onShutdown(data: any) {
        // data = {
        //     device,
        //     interface
        // }
        
        //check 



    }
}
