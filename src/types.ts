export interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  url: string; // Embed URL
  color?: string; // Hex color for the game's theme
}

export type Category = 'All' | 'Action' | 'Puzzle' | 'Sports' | 'Retro' | 'Strategy';
