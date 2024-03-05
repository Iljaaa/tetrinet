import {Request} from "./Request";

/**
 * When someone want unpause a game
 */
export interface ResumeRequest extends Request {
  intent?: string
}