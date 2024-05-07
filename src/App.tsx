import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

type Word = {
  word: string;
  definition: string;
  group: string;
};

const words: Word[] = [
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

type CardProps = Word & {
  select: (word: Word) => void;
  selected?: boolean;
};

const Card = ({ word, definition, group, select, selected }: CardProps) => {
  const handleClick = () => {
    select({ word, definition, group });
  };

  return (
    <motion.button
      whileHover={{ scale: [null, 1.1, 1.05] }}
      whileTap={{ scale: 0.95 }}
      transition={{ ease: 'easeOut', duration: 0.6 }}
      layout
      className={cn(
        'flex cursor-pointer flex-col items-center rounded-none bg-amber-100 p-4 shadow-md hover:bg-amber-200',
        selected && 'bg-pink-200 hover:bg-pink-300',
      )}
      onClick={handleClick}
    >
      <h2 className="text-xl font-bold">{word}</h2>
      <p className="text-md">{definition}</p>
      <p className="text-sm text-gray-500">{group}</p>
    </motion.button>
  );
};

type GroupProps = {
  name: string;
  words: Word[];
};

const Group = ({ name, words }: GroupProps) => {
  return (
    <motion.div
      animate={{ scale: [0.5, 1.05, 1] }}
      transition={{ ease: 'easeOut', duration: 1.2 }}
      className="rounded-sm bg-orange-200 p-4 text-center shadow-md"
    >
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-md">
        {words.map((word, index) => (
          <span key={index}>
            {word.word}
            {index < words.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
    </motion.div>
  );
};

const variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    transition: { duration: 0.6 },
    color: 'gray',
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
    scale: [0, 1.1, 1],
    color: 'red',
  },
};

const Heart = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
  );
};

const Attempts = ({ attempts }: { attempts: number }) => {
  return (
    <div className="flex">
      <AnimatePresence mode="popLayout">
        {Array.from({ length: attempts }).map((_, index) => (
          <motion.span
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate="visible"
            exit="hidden"
            variants={variants}
            key={index}
            className="text-2xl"
          >
            <Heart />
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

const shuffle = (w: Word[]) => {
  return [...w].sort(() => Math.random() - 0.5);
};

const useLoose = (
  attemptsLeft: number,
  groupsFound: string[],
  cb: () => void,
) => {
  useEffect(() => {
    const isLoosing = groupsFound.length !== 4 && attemptsLeft === 0;
    if (isLoosing) {
      toast.error('You loose! Try again.');
      cb();
    }
    if (groupsFound.length === 4) {
      toast.success('You win! Congratulations!');
      cb();
    }
  }, [attemptsLeft, cb, groupsFound.length]);
};

function App() {
  const [attempts, setAttempts] = useState(4);
  const [selected, setSelected] = useState<Word[]>([]);
  const [wordsLeft, setWordsLeft] = useState(() => shuffle(words));
  const [groupsFound, setGroupsFound] = useState<string[]>([]);

  const select = (word: Word) => {
    setSelected((selected) => {
      if (selected.some((selectedWord) => selectedWord.word === word.word)) {
        return selected.filter(
          (selectedWord) => selectedWord.word !== word.word,
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

  useLoose(attempts, groupsFound, reset);

  const isSelected = (word: Word) => {
    return selected.some((selectedWord) => selectedWord.word === word.word);
  };

  const deselectAll = () => {
    setSelected([]);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-amber-50">
        <a
          href="https://pages.cnpem.br/cienciaaberta/"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-4 right-4"
        >
          <img
            src="//pages.cnpem.br/cienciaaberta/wp-content/uploads/sites/73/2023/04/id-04.png"
            alt="ca-logo"
            className="w-10"
          />
        </a>
        <h1 className="fixed top-4 text-4xl font-bold text-[#f76c54]">
          Q lab faz isso?
        </h1>
        <h2 className="text-xl font-semibold text-amber-500 underline">
          Match the words
        </h2>
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
          {wordsLeft.map((word) => (
            <Card
              key={word.word}
              {...word}
              select={select}
              selected={isSelected(word)}
            />
          ))}
        </div>
        <Attempts attempts={attempts} />
        <div className="flex gap-2">
          <Button
            variant={'destructive'}
            className="rounded-full"
            onClick={reset}
          >
            new game
          </Button>
          <Button
            variant={'outline'}
            className="rounded-full border-amber-200 bg-amber-100 hover:bg-amber-50"
            onClick={() => setWordsLeft((w) => shuffle(w))}
          >
            shuffle
          </Button>
          <Button
            variant={'outline'}
            className="rounded-full border-amber-200 bg-amber-100 hover:bg-amber-50"
            onClick={deselectAll}
          >
            deselect all
          </Button>
          <Button
            className="rounded-full border-amber-900 bg-amber-800 hover:bg-amber-700"
            onClick={check}
            disabled={!canCheck}
          >
            check
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
