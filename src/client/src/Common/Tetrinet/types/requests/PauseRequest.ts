import {Request} from "./Request";

/**
 * When someone want set a pause
 */
export interface PauseRequest extends Request {
    // initiatorId: string
  intent?:string
}