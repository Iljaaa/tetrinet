
/**
 * Generate new random figure
 * @private
 */
import {Figure} from "../models/Figure";
import {ForwardHorse} from "../figures/ForwardHorse";
import {BackHorse} from "../figures/BackHorse";
import {Line} from "../figures/Line";
import {ForwardFlash} from "../figures/ForwardFlash";
import {BackFlash} from "../figures/BackFlash";
import {Camel} from "../figures/Camel";
import {Square} from "../figures/Square";
import {Cup} from "../models/Cup";

export const GenerateNewFigure = (cup:Cup, color:number):Figure =>
{
  // select new figure
  const nextFigureIndex:number = Math.floor(Math.random() * 7);

  let f:Figure;
  switch (nextFigureIndex) {
    case 0: f = new ForwardHorse(cup, color); break;
    case 1: f = new BackHorse(cup, color); break;
    case 2: f = new Line(cup, color); break;
    case 3: f = new ForwardFlash(cup, color); break;
    case 4: f = new BackFlash(cup, color); break;
    case 5: f = new Camel(cup, color); break;
    default: f = new Square(cup, color); break;
  }

  return f;
}