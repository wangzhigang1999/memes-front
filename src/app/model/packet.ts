import {WSPacketType} from "./packet_type";

export interface Packet {
  type: WSPacketType;
  sessionId: string;
  payload: any;
  headers?: any;
}
