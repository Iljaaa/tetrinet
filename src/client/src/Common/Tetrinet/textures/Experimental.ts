import {WebGlGeneratedTexture} from "../../framework/impl/WebGlGeneratedTexture";


export class Experimental extends WebGlGeneratedTexture
{


  constructor(width: number, height: number) {
    super(width, height);

    this.context.fillStyle = "back"; 	// This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
    this.context.textAlign = "center";	// This determines the alignment of text, e.g. left, center, right
    this.context.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom
    this.context.font = "16px monospace";
    this.context.fillText("HTML5 Rocks!", this.width/2, this.height/2);
    this.context.fillRect(0, 0, 100, 100)
  }
}