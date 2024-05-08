export type Word = {
  word: string;
  definition: string;
  group: string;
};

export const words: Word[] = [
  // 16 words divided equally in four distinct groups that make sense
  // 4 vegetables
  { word: 'Carrot', definition: 'A vegetable', group: 'Vegetable' },
  { word: 'Potato', definition: 'A vegetable', group: 'Vegetable' },
  { word: 'Tomato', definition: 'A vegetable', group: 'Vegetable' },
  { word: 'Onion', definition: 'A vegetable', group: 'Vegetable' },
  // 4 animals
  { word: 'Dog', definition: 'An animal', group: 'Animal' },
  { word: 'Cat', definition: 'An animal', group: 'Animal' },
  { word: 'Elephant', definition: 'An animal', group: 'Animal' },
  { word: 'Lion', definition: 'An animal', group: 'Animal' },
  // 4 colors
  { word: 'Red', definition: 'A color', group: 'Color' },
  { word: 'Blue', definition: 'A color', group: 'Color' },
  { word: 'Green', definition: 'A color', group: 'Color' },
  { word: 'Yellow', definition: 'A color', group: 'Color' },
  // 4 vehicles
  { word: 'Bus', definition: 'A vehicle', group: 'Vehicle' },
  { word: 'Car', definition: 'A vehicle', group: 'Vehicle' },
  { word: 'Bicycle', definition: 'A vehicle', group: 'Vehicle' },
  { word: 'Motorcycle', definition: 'A vehicle', group: 'Vehicle' },
];
