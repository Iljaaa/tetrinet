/**
 * Generate random color
 * now we have only three colors
 * @param maxColors
 */
export const GenerateRandomColor = (maxColors:number = 3):number => {
    return Math.floor(Math.random() * maxColors);
}