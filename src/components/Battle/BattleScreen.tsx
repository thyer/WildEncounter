import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getMoveById } from '../../data/moves';
import { getPokemonById } from '../../data/pokemon';
import { getItemById, ITEMS } from '../../data/items';
import Button from '../UI/Button';
import HealthBar from '../UI/HealthBar';
import './BattleScreen.css';

export default function BattleScreen() {
  const battle = useGameStore((state) => state.battle);
  const executePlayerAction = useGameStore((state) => state.executePlayerAction);
  const endBattle = useGameStore((state) => state.endBattle);
  const startBattle = useGameStore((state) => state.startBattle);
  const canUseItem = useGameStore((state) => state.canUseItem);
  const inventory = useGameStore((state) => state.player.inventory);

  const [showItemMenu, setShowItemMenu] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [displayedPlayerHp, setDisplayedPlayerHp] = useState(0);
  const [displayedWildHp, setDisplayedWildHp] = useState(0);
  const [displayedPlayerStatus, setDisplayedPlayerStatus] = useState<'normal' | 'poisoned' | 'asleep' | 'paralyzed'>('normal');
  const [displayedWildStatus, setDisplayedWildStatus] = useState<'normal' | 'poisoned' | 'asleep' | 'paralyzed'>('normal');
  const lastLogLengthRef = useRef(0);
  const isProcessingRef = useRef(false);
  const currentBattleRef = useRef<number>(0);

  if (!battle) return null;

  const playerSpecies = getPokemonById(battle.playerPokemon.speciesId);
  const wildSpecies = getPokemonById(battle.wildPokemon.speciesId);

  // Progressive message display with HP/status updates synced to messages
  useEffect(() => {
    if (!battle || isProcessingRef.current) return;

    const currentLogLength = battle.battleLog.length;

    // Only process new messages
    if (currentLogLength > lastLogLengthRef.current) {
      isProcessingRef.current = true;
      const newMessages = battle.battleLog.slice(lastLogLengthRef.current);
      lastLogLengthRef.current = currentLogLength;

      // Helper to check if message triggers updates
      const shouldUpdateWildHp = (msg: string) => {
        return (msg.includes('used') && !msg.includes('Wild')) || msg.includes('Wild') && msg.includes('fainted');
      };

      const shouldUpdatePlayerHp = (msg: string) => {
        return (msg.includes('Wild') && msg.includes('used')) || (msg.includes('hurt by poison') && !msg.includes('Wild'));
      };

      const shouldUpdatePlayerStatus = (msg: string) => {
        return !msg.includes('Wild') && (msg.includes('was poisoned') || msg.includes('was asleep') ||
               msg.includes('was paralyzed') || msg.includes('woke up'));
      };

      const shouldUpdateWildStatus = (msg: string) => {
        return msg.includes('Wild') && (msg.includes('was poisoned') || msg.includes('was asleep') ||
               msg.includes('was paralyzed') || msg.includes('woke up'));
      };

      // Display messages and schedule HP/status updates
      let cumulativeDelay = 0;
      newMessages.forEach((message) => {
        // Display message
        setTimeout(() => {
          setDisplayedMessages((prev) => [...prev, message]);
        }, cumulativeDelay);
        cumulativeDelay += 1000;

        // Schedule HP updates 500ms after relevant messages
        if (shouldUpdateWildHp(message)) {
          setTimeout(() => {
            setDisplayedWildHp(battle.wildPokemon.currentHp);
          }, cumulativeDelay - 500);
        }

        if (shouldUpdatePlayerHp(message)) {
          setTimeout(() => {
            setDisplayedPlayerHp(battle.playerPokemon.currentHp);
          }, cumulativeDelay - 500);
        }

        // Schedule status updates 500ms after relevant messages
        if (shouldUpdatePlayerStatus(message)) {
          setTimeout(() => {
            setDisplayedPlayerStatus(battle.playerPokemon.statusCondition);
          }, cumulativeDelay - 500);
        }

        if (shouldUpdateWildStatus(message)) {
          setTimeout(() => {
            setDisplayedWildStatus(battle.wildPokemon.statusCondition);
          }, cumulativeDelay - 500);
        }
      });

      // Final sync to ensure everything is up to date
      setTimeout(() => {
        setDisplayedPlayerHp(battle.playerPokemon.currentHp);
        setDisplayedWildHp(battle.wildPokemon.currentHp);
        setDisplayedPlayerStatus(battle.playerPokemon.statusCondition);
        setDisplayedWildStatus(battle.wildPokemon.statusCondition);
        isProcessingRef.current = false;
      }, cumulativeDelay + 500);
    }
  }, [battle?.battleLog.length]);

  // Reset displayed messages when a new battle starts
  useEffect(() => {
    if (battle?.phase === 'intro' && battle.turn === 1 && battle.wildPokemon) {
      const battleId = battle.wildPokemon.speciesId * 1000 + battle.turn;
      if (currentBattleRef.current !== battleId) {
        currentBattleRef.current = battleId;
        // Clear all state for new battle
        setDisplayedMessages([]);
        lastLogLengthRef.current = 0;
        isProcessingRef.current = false;
        setDisplayedPlayerHp(battle.playerPokemon.currentHp);
        setDisplayedWildHp(battle.wildPokemon.currentHp);
        setDisplayedPlayerStatus(battle.playerPokemon.statusCondition);
        setDisplayedWildStatus(battle.wildPokemon.statusCondition);
      }
    }
  }, [battle?.phase, battle?.turn, battle?.wildPokemon?.speciesId]);

  const handleMove = async (moveId: string) => {
    await executePlayerAction({ type: 'move', moveId });
  };

  const handleItem = async (itemId: string) => {
    setShowItemMenu(false);
    await executePlayerAction({ type: 'item', itemId });
  };

  const handleNextBattle = () => {
    startBattle();
  };

  const recentLog = displayedMessages.slice(-5);

  return (
    <div className="battle-screen">
      <div className="battle-field">
        {/* Wild Pokemon */}
        <div className="pokemon-display wild">
          <div className="pokemon-info">
            <div className="pokemon-name">{wildSpecies?.name} Lv.{battle.wildPokemon.level}</div>
            <HealthBar
              current={displayedWildHp}
              max={battle.wildPokemon.maxHp}
            />
          </div>
          <div className={`pokemon-sprite wild-sprite status-${displayedWildStatus}`}>
            {wildSpecies?.name[0]}
          </div>
        </div>

        {/* Player Pokemon */}
        <div className="pokemon-display player">
          <div className={`pokemon-sprite player-sprite status-${displayedPlayerStatus}`}>
            {playerSpecies?.name[0]}
          </div>
          <div className="pokemon-info">
            <div className="pokemon-name">{playerSpecies?.name} Lv.{battle.playerPokemon.level}</div>
            <HealthBar
              current={displayedPlayerHp}
              max={battle.playerPokemon.maxHp}
            />
            <div className="pokemon-xp">
              XP: {battle.playerPokemon.experience}/{battle.playerPokemon.experienceToNextLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className="battle-log">
        {recentLog.map((message, i) => (
          <div key={i} className="log-message">{message}</div>
        ))}
      </div>

      {/* Battle Menu */}
      <div className="battle-menu">
        {battle.phase === 'player-turn' && !showItemMenu && (
          <div className="menu-buttons">
            <div className="move-grid">
              {battle.playerPokemon.moves.map((moveId) => {
                const move = getMoveById(moveId);
                if (!move) return null;
                return (
                  <Button key={moveId} onClick={() => handleMove(moveId)}>
                    {move.name}
                    <div className="move-type">{move.type.toUpperCase()}</div>
                  </Button>
                );
              })}
            </div>
            <Button variant="secondary" onClick={() => setShowItemMenu(true)}>
              Items
            </Button>
          </div>
        )}

        {battle.phase === 'player-turn' && showItemMenu && (
          <div className="item-menu">
            <h3>Use Item</h3>
            <div className="item-grid">
              {Object.keys(ITEMS).map((itemId) => {
                const item = getItemById(itemId);
                const count = inventory[itemId] || 0;
                if (!item) return null;
                return (
                  <Button
                    key={itemId}
                    onClick={() => handleItem(itemId)}
                    disabled={!canUseItem(itemId)}
                  >
                    {item.name} ({count})
                  </Button>
                );
              })}
            </div>
            <Button variant="secondary" onClick={() => setShowItemMenu(false)}>
              Back
            </Button>
          </div>
        )}

        {battle.phase === 'victory' && (
          <div className="victory-menu">
            <h2>Victory!</h2>
            <Button onClick={handleNextBattle}>Next Battle</Button>
          </div>
        )}

        {battle.phase === 'defeat' && (
          <div className="defeat-menu">
            <h2>You Lost!</h2>
            <Button onClick={() => endBattle({ victory: false, xpGained: 0, leveledUp: false })}>
              Return
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
