
/**
 * @version 1.0.0
 */
export class FpsCounter {
  
  private frames:number = 0;
  private time:number = 0;
  
  
  constructor() {
  }
  
  update(deltaTime:number){
  
    this.frames++;
    this.time += deltaTime
    
    if (this.time > 10000){
      console.info(this.frames / 10, 'fps')
      this.time -= 10000;
      this.frames = 0;
    }
  }
}
