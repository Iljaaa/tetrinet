import {WebGlGeneratedTexture} from "../../framework/impl/WebGlGeneratedTexture";
import {CupSize} from "../CupRenderer2";

export class PlayScreenTexts extends WebGlGeneratedTexture
{

  /**
   *
   */
  static lineHeight = 64;

  /**
   * Pause text position
   */
  static pauseTopPosition = 64;

  /**
   * Pause text position
   */
  static gameOverTopPosition = 128;

  /**
   * Pause text position
   */
  static winnerTopPosition = 192;

  /**
   * Height position when start players name
   */
  static playersBeginEdge = 256;

  /**
   *
   */
  static playerLineHeight = 24

  // constructor() {
  //   super(300, 512);
  // }

  getHeight(): number {
    return 512;
  }

  getWidth(): number {
    return 300;
  }

  /**
   * Render
   */
  public render (opponents?:Array<{index:number, name:string}>)
  {
    const startPosition = 32+2

    // draw prepare to game
    this.context.fillStyle = "white"; 	// This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
    this.context.textAlign = "center"; // "center";	// This determines the alignment of text, e.g. left, center, right
    this.context.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom
    this.context.font = "32px monospace";

    // fill text beckground
    this.context.fillStyle = "#ded9c6";
    this.context.fillRect(0, 0, 300, PlayScreenTexts.playersBeginEdge)

    this.context.fillStyle = "black";
    // this.context.fillText("HTML5 Rocks!", this.width/2, this.height/2);
    this.context.fillText("Searching...", this.getWidth()/2, startPosition);
    this.context.fillText("Paused", this.getWidth()/2, startPosition + 64);
    this.context.fillText("Game over", this.getWidth()/2, startPosition + 128);
    this.context.fillText("Winner", this.getWidth()/2, startPosition + 192);
    // this.context.fillText("Winner", this.width/2, startPosition + (64 * 2));
    // this.context.fillRect(0, 0, 100, 100)

    if (opponents) {
      this.renderPlayers(opponents)
    }

  }

  /**
   *
   * @param opponents
   */
  private renderPlayers (opponents:Array<{index:number, name:string}>)
  {
    this.context.textAlign = "left";
    this.context.textBaseline = "middle";
    this.context.font = "16px monospace";
    this.context.fillStyle = "white";

    // clear old names
    this.context.clearRect(0, PlayScreenTexts.getNameTopPositionByIndex(0), 300, 512);

    opponents.forEach((it:{index:number, name:string}) => {
      const top = PlayScreenTexts.getNameTopPositionByIndex(it.index - 1) + PlayScreenTexts.playerLineHeight / 2;
      // const top = this.playersBeginEdge + ((it.index - 1) * this.playerLineHeight) + 16;
      this.context.fillText(it.index + ". " + it.name, 0, top);
    })

    // for
    // this.context.fillText("Paused", this.width/2, startPosition + 64);
  }

  /**
   * Player name position by cup index
   * @param playerIndex
   */
  public static getNameTopPositionByIndex (playerIndex:number):number {
    return PlayScreenTexts.playersBeginEdge + (playerIndex * this.playerLineHeight)
  }

  /**
   * @param cupSize
   */
  public static getPlayerLineHeightByCupSize (cupSize:CupSize):number
  {
    if (cupSize === CupSize.small16) return  16;
    else if (CupSize.middle24) return 24;
    return 32;
  }
}