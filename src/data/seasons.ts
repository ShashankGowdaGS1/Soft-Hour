export interface SeasonConfig {
  id: string;
  name: string;
  title: string;
  statement: string;
  tagline: string;
  accent: string;
  notes: string[];
}

export const currentSeason: SeasonConfig = {
  id: 'summer-collection',
  name: 'Summer Collection',
  title: 'SEASON CHANGES EVERYTHING.',
  statement: 'An ephemeral ode to high-season Alphonso mangoes, coastal tender coconut, and wild Damask rose.',
  tagline: 'Available until the monsoons arrive.',
  accent: '#E3A335',
  notes: ['Alphonso Mango', 'Kashmiri Saffron', 'Damask Rose', 'Tender Coconut'],
};

export default currentSeason;
