import {Bonus} from "../types/Bonus";

export const GenerateRandomBlock = ():Bonus =>
{

  const availableBonuses = [
    Bonus.add,
    Bonus.add,
    Bonus.add,
    Bonus.add,
    Bonus.add,
    Bonus.add,
    Bonus.add,
    Bonus.add,
    Bonus.clear,
    Bonus.clear,
    Bonus.clear,
    Bonus.clear,
    Bonus.clear,
    Bonus.clear,
    Bonus.clear,
    Bonus.clear,
    Bonus.clearSpecials,
    Bonus.clearSpecials,
    Bonus.clearSpecials,
    Bonus.clearSpecials,
    Bonus.clearSpecials,
    Bonus.randomClear,
    Bonus.randomClear,
    Bonus.randomClear,
    Bonus.randomClear,
    Bonus.quake,
    Bonus.quake,
    Bonus.quake,
    Bonus.gravity,
    Bonus.gravity,
    Bonus.bomb,
    Bonus.bomb,
    Bonus.switch,
    Bonus.nuke
  ];

  // take random block
  // now we have only 3 special blocks
  return  availableBonuses[Math.floor(Math.random() * availableBonuses.length)]

}