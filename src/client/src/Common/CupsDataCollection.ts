import {CupData} from "./Tetrinet/models/CupData";

/**
 * Collection of cups data received from server
 * after update
 */
export interface CupsDataCollection {
  [index: string]: CupData
}
