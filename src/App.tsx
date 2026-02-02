import { useGameStore } from './store/gameStore';
import PokemonSelection from './components/Selection/PokemonSelection';
import BattleScreen from './components/Battle/BattleScreen';
import './App.css';

export default function App() {
  const screen = useGameStore((state) => state.screen);

  return (
    <div className="app">
      {screen === 'selection' && <PokemonSelection />}
      {screen === 'battle' && <BattleScreen />}
    </div>
  );
}
