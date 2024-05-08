import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Hearts } from './components/hearts';
import { toast } from 'sonner';
import { words, type Word } from './lib/words';

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
      exit={{
        opacity: 1.2,
        scale: 1.06,
        transition: { duration: 0.5 },
      }}
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
      animate={{ scale: [0, 1.05, 1] }}
      transition={{ delay: 0.5 }}
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

const shuffle = (w: Word[]) => {
  return [...w].sort(() => Math.random() - 0.5);
};

const useLoose = (
  attemptsLeft: number,
  groupsFound: string[],
  cb: () => void,
) => {
  useEffect(() => {
    if (attemptsLeft === 0) {
      toast.error('You loose! Try again.');
      cb();
    }
    if (groupsFound.length === 4) {
      toast.success('You win! Congratulations!');
      cb();
    }
  }, [attemptsLeft, cb, groupsFound.length]);
};

const initialHearts = 3;
function App() {
  const [hearts, setHearts] = useState(initialHearts);
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

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const check = () => {
    const selectedGroups = selected.map((word) => word.group);
    const uniqueGroups = Array.from(new Set(selectedGroups));
    const old = wordsLeft;
    const unselectedWords = wordsLeft.filter(
      (word) =>
        !selected.some((selectedWord) => selectedWord.word === word.word),
    );
    setWordsLeft([...selected, ...unselectedWords]);
    wait(600).then(() => {
      if (uniqueGroups.length === 1) {
        const w = wordsLeft.filter((word) => word.group !== uniqueGroups[0]);
        setWordsLeft(w);
        setSelected([]);
        setGroupsFound((groups) => [...groups, uniqueGroups[0]]);
      } else {
        setHearts((hearts) => hearts - 1);
        setWordsLeft(old);
      }
    });
  };

  const reset = () => {
    setHearts(initialHearts);
    setSelected([]);
    setWordsLeft(shuffle(words));
    setGroupsFound([]);
  };

  useLoose(hearts, groupsFound, reset);

  const isSelected = (word: Word) => {
    return selected.some((selectedWord) => selectedWord.word === word.word);
  };

  const deselectAll = () => {
    setSelected([]);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-amber-50">
        <h1 className="text-4xl font-bold text-[#f76c54]">Q lab faz isso?</h1>
        <h2 className="text-xl font-semibold text-amber-500 underline">
          Match the words
        </h2>
        <div className="grid grid-cols-4 gap-4 sm:w-screen md:w-4/5 lg:w-3/5">
          <AnimatePresence mode="popLayout">
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
          </AnimatePresence>
        </div>
        <Hearts hearts={hearts} />
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
        <a
          href="https://pages.cnpem.br/cienciaaberta/"
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-2 right-2 hidden md:block"
        >
          <img
            src="//pages.cnpem.br/cienciaaberta/wp-content/uploads/sites/73/2023/04/id-04.png"
            alt="ca-logo"
            className="w-10"
          />
        </a>
      </div>
    </>
  );
}

export default App;
