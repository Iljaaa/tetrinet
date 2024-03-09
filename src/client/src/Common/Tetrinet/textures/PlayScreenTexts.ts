import {WebGlGeneratedTexture} from "../../framework/impl/WebGlGeneratedTexture";

export class PlayScreenTexts extends WebGlGeneratedTexture
{

  /**
   *
   */
  lineHeight = 64;

  /**
   * Pause text position
   */
  pauseTopPosition = 64;

  constructor() {
    super(300, 150);

    const startPosition = 32+2

    // draw prepare to game
    this.context.fillStyle = "white"; 	// This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
    this.context.textAlign = "center"; // "center";	// This determines the alignment of text, e.g. left, center, right
    this.context.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom
    this.context.font = "32px monospace";

    this.context.fillStyle = "#ded9c6";
    this.context.fillRect(0, 0, 300, 150)

    this.context.fillStyle = "black";
    // this.context.fillText("HTML5 Rocks!", this.width/2, this.height/2);
    this.context.fillText("Searching...", this.width/2, startPosition);
    this.context.fillText("Paused", this.width/2, startPosition + 64);
    // this.context.fillText("Winner", this.width/2, startPosition + (64 * 2));
    // this.context.fillRect(0, 0, 100, 100)
  }
}