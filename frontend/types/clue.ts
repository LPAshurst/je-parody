export const DEFAULT_VALS = [200, 400, 600, 800, 1000];


export interface Clue {
  id: number,
  value: number;
  daily_double: boolean;
  round: "J!" | "DJ!";
  category: string;
  clue: string;
  response: string;
}

const emptyClue = (): Clue => ({
    id: 0,
    value: 0,
    daily_double: false,
    round: "J!",
    category: "",
    clue: "",
    response: "",
});

export function emptyBoard(): Clue[] {

  const clues = new Array<Clue>;
  let id = 0;
  for (let row = 0; row < 5; row++) {
    
    const clueRow = new Array<Clue>;
    for (let col = 0; col < 6; col++ ) {
      const newClue = emptyClue();
      newClue.value = DEFAULT_VALS[row]
      newClue.id = id
      id += 1
      clueRow.push(newClue)
    } 
    clues.push(...clueRow)
  }
  return clues;

}