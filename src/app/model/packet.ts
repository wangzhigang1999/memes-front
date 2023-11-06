import {WSPacketType} from "./packet_type";

export interface Packet {
  type: WSPacketType;
  payload: any;
  headers: any;
}
