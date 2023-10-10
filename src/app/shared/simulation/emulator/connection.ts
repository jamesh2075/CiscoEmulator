export interface ConnectionEndpoint {
    name: string; // the name of the device
    id?: number; // ID of the interface on the named device
    interfaceName?: string; // name of the interface on the named device
}

export interface Connection {
    dest: ConnectionEndpoint;
    src: ConnectionEndpoint;
}
