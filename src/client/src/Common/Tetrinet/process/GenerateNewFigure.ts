
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

export const GenerateNewFigure = (cup:Cup):Figure =>
{
  // select new figure
  const nextFigureIndex:number = Math.floor(Math.random() * 7);

  let f:Figure;
  switch (nextFigureIndex) {
    case 0: f = new ForwardHorse(cup); break;
    case 1: f = new BackHorse(cup); break;
    case 2: f = new Line(cup); break;
    case 3: f = new ForwardFlash(cup); break;
    case 4: f = new BackFlash(cup); break;
    case 5: f = new Camel(cup); break;
    default: f = new Square(cup); break;
  }

  return f;
}