import * as OBSWebSocket from "obs-websocket-js";

export interface Scene {
  messageId: string;
  status: "ok";
  name: string;
  sources: OBSWebSocket.SceneItem[];
}

export interface ItemProperties {
  messageId: string;
  status: "ok";
  name: string;
  itemId: number;
  rotation: number;
  visible: boolean;
  muted: boolean;
  locked: boolean;
  sourceWidth: number;
  sourceHeight: number;
  width: number;
  height: number;
  parentGroupName?: string;
  groupChildren?: OBSWebSocket.SceneItemTransform[];
  position: { x: number; y: number; alignment: number };
  scale: { x: number; y: number; filter: string };
  crop: { top: number; right: number; bottom: number; left: number };
  bounds: { type: string; alignment: number; x: number; y: number };
}

export interface Commands {
  "!camfuera": "hideMainCam";
  "!fullscreen": "fullScreenScene";
  "!welcome": "welcomeMessage";
}

export interface User {
  username: string;
}

export interface Store {
  insertNewBot(doc: User): Promise<void>;
}

export interface OBSError {
  status: string;
  description: string;
  code: string;
  error: string;
}
export interface MuteProperties {
  item: string;
  status: boolean;
}
export interface Instructions {
  setScene: string;
  mute: Array<MuteProperties>;
  setFilter: Array<FilterProperties>;
}

export interface FilterProperties {
  sourceName: string;
  filterName: string;
  filterEnabled: boolean;
}

export enum HTTPStatuses {
  OK = 200,
  BAD_REQUEST = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
