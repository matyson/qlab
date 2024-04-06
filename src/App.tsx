import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
type Word = {
  word: string;
  definition: string;
  group: string;
};

// type Group = {
//   name: string;
//   words: Word[];
// };

// const groups: Group[] = [
//   {
//     name: "Fruit",
//     words: [
//       { word: "Apple", definition: "A fruit", group: "Fruit" },
//       { word: "Banana", definition: "A fruit", group: "Fruit" },
//     ],
//   },
//   {
//     name: "Vegetable",
//     words: [
//       { word: "Carrot", definition: "A vegetable", group: "Vegetable" },
//       { word: "Potato", definition: "A vegetable", group: "Vegetable" },
//     ],
//   },
//   {
//     name: "Animal",
//     words: [
//       { word: "Dog", definition: "An animal", group: "Animal" },
//       { word: "Cat", definition: "An animal", group: "Animal" },
//     ],
//   },
//   {
//     name: "Vehicle",
//     words: [
//       { word: "Bus", definition: "A vehicle", group: "Vehicle" },
//       { word: "Car", definition: "A vehicle", group: "Vehicle" },
//     ],
//   },
//   {
//     name: "Thing",
//     words: [
//       { word: "Book", definition: "A thing", group: "Thing" },
//       { word: "Chair", definition: "A thing", group: "Thing" },
//       { word: "Laptop", definition: "A thing", group: "Thing" },
//       { word: "Table", definition: "A thing", group: "Thing" },
//     ],
//   },
//   {
//     name: "Color",
//     words: [
//       { word: "Red", definition: "A color", group: "Color" },
//       { word: "Blue", definition: "A color", group: "Color" },
//       { word: "Green", definition: "A color", group: "Color" },
//       { word: "Yellow", definition: "A color", group: "Color" },
//     ],
//   },
// ];

const words: Word[] = [
  // 16 words divided equally in four distinct groups that make sense
  // 4 vegetables
  { word: "Carrot", definition: "A vegetable", group: "Vegetable" },
  { word: "Potato", definition: "A vegetable", group: "Vegetable" },
  { word: "Tomato", definition: "A vegetable", group: "Vegetable" },
  { word: "Onion", definition: "A vegetable", group: "Vegetable" },
  // 4 animals
  { word: "Dog", definition: "An animal", group: "Animal" },
  { word: "Cat", definition: "An animal", group: "Animal" },
  { word: "Elephant", definition: "An animal", group: "Animal" },
  { word: "Lion", definition: "An animal", group: "Animal" },
  // 4 colors
  { word: "Red", definition: "A color", group: "Color" },
  { word: "Blue", definition: "A color", group: "Color" },
  { word: "Green", definition: "A color", group: "Color" },
  { word: "Yellow", definition: "A color", group: "Color" },
  // 4 vehicles
  { word: "Bus", definition: "A vehicle", group: "Vehicle" },
  { word: "Car", definition: "A vehicle", group: "Vehicle" },
  { word: "Bicycle", definition: "A vehicle", group: "Vehicle" },
  { word: "Motorcycle", definition: "A vehicle", group: "Vehicle" },
];

type CardProps = Word & {
  select: (word: Word) => void;
  selected?: boolean;
};

const Card = ({ word, definition, group, select, selected }: CardProps) => {
  const handleClick = () => {
    select({ word, definition, group });
  };
  return (
    <button
      className={cn(
        "cursor-pointer hover:bg-gray-200 p-4 bg-gray-100 rounded-lg shadow-md flex flex-col items-center",
        selected && "bg-indigo-200 hover:bg-indigo-300"
      )}
      onClick={handleClick}
    >
      <h2 className="text-xl font-bold">{word}</h2>
      <p className="text-md">{definition}</p>
      <p className="text-sm text-gray-500">{group}</p>
    </button>
  );
};

type GroupProps = {
  name: string;
  words: Word[];
};

const Group = ({ name, words }: GroupProps) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-md">
        {words.map((word, index) => (
          <span key={index} className="text-indigo-500">
            {word.word}
            {index < words.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
    </div>
  );
};

const Attempts = ({ attempts }: { attempts: number }) => {
  return (
    <div>
      <p>Attempts left: {attempts}</p>
    </div>
  );
};

const shuffle = (w: Word[]) => {
  return [...w].sort(() => Math.random() - 0.5);
};

function App() {
  const [attempts, setAttempts] = useState(4);
  const [selected, setSelected] = useState<Word[]>([]);
  const [wordsLeft, setWordsLeft] = useState(() => shuffle(words));
  const [groupsFound, setGroupsFound] = useState<string[]>([]);

  useEffect(() => {
    if (attempts === 0) {
      alert("You lose!");
      reset();
    }
    if (groupsFound.length === 4) {
      alert("You win!");
      reset();
    }
  }, [attempts, groupsFound.length]);

  const select = (word: Word) => {
    setSelected((selected) => {
      if (selected.some((selectedWord) => selectedWord.word === word.word)) {
        return selected.filter(
          (selectedWord) => selectedWord.word !== word.word
        );
      }
      if (selected.length >= 4) {
        return selected;
      }
      return [...selected, word];
    });
  };

  const canCheck = selected.length === 4;

  const check = () => {
    const selectedGroups = selected.map((word) => word.group);
    const uniqueGroups = Array.from(new Set(selectedGroups));
    if (uniqueGroups.length === 1) {
      const w = wordsLeft.filter((word) => word.group !== uniqueGroups[0]);
      setWordsLeft(w);
      setSelected([]);
      setGroupsFound((groups) => [...groups, uniqueGroups[0]]);
    } else {
      setAttempts((attempts) => attempts - 1);
    }
  };

  const reset = () => {
    setAttempts(4);
    setSelected([]);
    setWordsLeft(shuffle(words));
    setGroupsFound([]);
  };

  const isSelected = (word: Word) => {
    return selected.some((selectedWord) => selectedWord.word === word.word);
  };

  const deselectAll = () => {
    setSelected([]);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold">Q lab faz isso?</h1>
        <div className="grid grid-cols-4 gap-4 sm:w-screen md:w-4/5 lg:w-3/5">
          <div className="col-span-4 space-y-4">
            {groupsFound.map((group, index) => (
              <Group
                key={index}
                name={group}
                words={words.filter((w) => w.group === group)}
              />
            ))}
          </div>
          {wordsLeft.map((word, index) => (
            <Card
              key={index}
              {...word}
              select={select}
              selected={isSelected(word)}
            />
          ))}
        </div>
        <Attempts attempts={attempts} />
        <div className="flex gap-2">
          <Button
            variant={"destructive"}
            className="rounded-full"
            onClick={reset}
          >
            new game
          </Button>
          <Button
            variant={"outline"}
            className="rounded-full"
            onClick={() => setWordsLeft((w) => shuffle(w))}
          >
            shuffle
          </Button>
          <Button
            variant={"outline"}
            className="rounded-full"
            onClick={deselectAll}
          >
            deselect all
          </Button>
          <Button className="rounded-full" onClick={check} disabled={!canCheck}>
            check
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
