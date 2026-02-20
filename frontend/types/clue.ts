export const DEFAULT_VALS = [200, 400, 600, 800, 1000];

export interface Board {
  title: string,
  slug: string,
  clues: Clue[]
}

export interface Game {
  code: string;
  players: Record<string, Player>;
  current_clue_position: number | null;
  active_player: string | null;
  buzzer_locked: boolean;
  clues: PlayClue[];
  player_picking_category: string | null;
}

export interface Player {
  score: number;
  has_answered: boolean;
  wager: number;
  wagered: boolean;
}

export interface Clue {
  id: number,
  clue_val: number;
  daily_double: boolean;
  round: "J!" | "DJ!";
  category: string;
  clue: string;
  response: string;
  clue_is_picture: boolean;
  position: number;
}

export interface PlayClue {
  position: number;
  clue: string;
  response: string;
  category: string;
  answered: boolean;
  clue_val: number;
  daily_double: boolean;
}

export interface ExternalClue {
    id: number;
    game_id: number;
    value: number;
    round: string;
    category: string;
    clue: string;
    response: string;
}

const emptyClue = (): Clue => ({
    id: 0,
    clue_val: 0,
    daily_double: false,
    round: "J!",
    category: "",
    clue: "",
    response: "",
    clue_is_picture: false,
    position: 0
});

export function emptyBoard(): Clue[] {

  const clues = new Array<Clue>;
  let id = 0;
  for (let row = 0; row < 5; row++) {
    
    const clueRow = new Array<Clue>;
    for (let col = 0; col < 6; col++ ) {
      const newClue = emptyClue();
      newClue.clue_val = DEFAULT_VALS[row]
      // i know this is ugly having both id and position, and i will try to solve it a better way soon, but the way my 
      // database is setup kinda requires it to be like this right now
      newClue.id = id
      newClue.position = id
      id += 1
      clueRow.push(newClue)
    } 
    clues.push(...clueRow)
  }
  return clues;

}