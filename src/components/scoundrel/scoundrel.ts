export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type CardType = 'monster' | 'weapon' | 'potion' | 'other';

export interface Card {
  id: string;
  suit: Suit;
  value: number; // 2..14 (11=J,12=Q,13=K,14=A)
  label: string;
}

export interface WeaponState {
  card: Card;
  monsters: Card[];
  lastSlainValue: number | null;
}

export interface Snapshot {
  health: number;
  deckCount: number;
  discardCount: number;
  room: Card[];
  equipped?: WeaponState | null;
  monstersSlainByWeapon: number;
  picksThisTurn: number;
  usedPotionThisTurn: boolean;
  previousAvoided: boolean;
  gameOver: boolean;
  score?: number;
  turnNumber: number;
}

function idFor(suit: Suit, value: number) {
  return `${suit[0]}-${value}-${Math.random().toString(36).slice(2, 9)}`;
}

export function cardLabel(value: number) {
  if (value === 14) return 'A';
  if (value === 13) return 'K';
  if (value === 12) return 'Q';
  if (value === 11) return 'J';
  return String(value);
}

export function cardTypeOf(card: Card): CardType {
  if (card.suit === 'clubs' || card.suit === 'spades') return 'monster';
  if (card.suit === 'diamonds') return 'weapon';
  if (card.suit === 'hearts') return 'potion';
  return 'other';
}

// Convenience guards/helpers (pure)
export function isMonster(card: Card): boolean {
  return cardTypeOf(card) === 'monster';
}
export function isWeapon(card: Card): boolean {
  return cardTypeOf(card) === 'weapon';
}
export function isPotion(card: Card): boolean {
  return cardTypeOf(card) === 'potion';
}

export function canUseWeaponOn(equipped: WeaponState | null, monster: Card): boolean {
  if (!equipped) return false;
  if (!isMonster(monster)) return false;
  const last = equipped.lastSlainValue;
  if (last == null) return true;
  return monster.value <= last;
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  for (const suit of suits) {
    for (let v = 2; v <= 14; v++) {
      const isRed = suit === 'hearts' || suit === 'diamonds';
      const isFace = v === 11 || v === 12 || v === 13;
      const isAce = v === 14;
      if (isRed && (isFace || isAce)) {
        continue;
      }
      const card: Card = {
        id: idFor(suit, v),
        suit,
        value: v,
        label: cardLabel(v),
      };
      deck.push(card);
    }
  }
  return deck;
}

export function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = temp;
  }
  return arr;
}

export class Scoundrel {
  deck: Card[] = [];
  discard: Card[] = [];
  room: Card[] = [];
  health: number = 20;
  startingHealth: number = 20;
  equipped: WeaponState | null = null;
  previousAvoided: boolean = false;
  picksThisTurn: number = 0;
  usedPotionThisTurn: boolean = false;
  gameOver: boolean = false;
  score: number | null = null;
  turnNumber: number = 0;

  constructor(seedShuffle = true) {
    this.reset(seedShuffle);
  }

  reset(seedShuffle = true) {
    this.deck = createDeck();
    if (seedShuffle) shuffle(this.deck);
    this.discard = [];
    this.room = [];
    this.health = this.startingHealth = 20;
    this.equipped = null;
    this.previousAvoided = false;
    this.picksThisTurn = 0;
    this.usedPotionThisTurn = false;
    this.gameOver = false;
    this.score = null;
    this.turnNumber = 0;
    this.fillRoomToFour();
  }

  snapshot(): Snapshot {
    return {
      health: this.health,
      deckCount: this.deck.length,
      discardCount: this.discard.length,
      room: [...this.room],
      equipped: this.equipped ? { ...this.equipped, monsters: [...this.equipped.monsters] } : null,
      monstersSlainByWeapon: this.equipped ? this.equipped.monsters.length : 0,
      picksThisTurn: this.picksThisTurn,
      usedPotionThisTurn: this.usedPotionThisTurn,
      previousAvoided: this.previousAvoided,
      gameOver: this.gameOver,
      score: this.score ?? undefined,
      turnNumber: this.turnNumber,
    };
  }

  drawOne(): Card | null {
    if (this.deck.length === 0) {
      if (this.discard.length === 0) return null;
      this.deck = shuffle(this.discard.splice(0));
    }
    return this.deck.shift() || null;
  }

  putOnBottom(cards: Card[]) {
    this.deck.push(...cards);
  }

  fillRoomToFour() {
    while (this.room.length < 4) {
      const c = this.drawOne();
      if (!c) break;
      this.room.push(c);
    }
  }

  avoidRoom(): boolean {
    if (this.previousAvoided) return false;
    if (this.room.length < 4) return false;
    const taken = this.room.splice(0, 4);
    this.putOnBottom(taken);
    this.previousAvoided = true;
    this.endTurn();
    return true;
  }

  discardCard(c: Card) {
    this.discard.push(c);
  }

  privateBarehand(card: Card, shouldCheckGameOver: boolean) {
    this.discardCard(card);
    this.health -= card.value;
    if (shouldCheckGameOver) this.checkGameOver();
  }

  equipWeapon(card: Card) {
    if (card.suit !== 'diamonds') throw new Error('Not a weapon');
    if (this.equipped) {
      this.discard.push(this.equipped.card, ...this.equipped.monsters);
    }
    this.equipped = {
      card,
      monsters: [],
      lastSlainValue: null,
    };
  }

  fightBarehanded(card: Card) {
    if (cardTypeOf(card) !== 'monster') throw new Error('Not a monster');
    this.privateBarehand(card, true);
  }

  fightWithWeapon(card: Card) {
    if (!this.equipped) throw new Error('No weapon equipped');
    if (cardTypeOf(card) !== 'monster') throw new Error('Not a monster');

    if (this.equipped.lastSlainValue !== null) {
      if (card.value > this.equipped.lastSlainValue) {
        throw new Error('Weapon cannot be used on that (too strong) monster due to previous slay');
      }
    }

    this.equipped.monsters.push(card);

    const remaining = card.value - this.equipped.card.value;
    if (remaining > 0) {
      this.health -= remaining;
    }
    this.equipped.lastSlainValue = card.value;
    this.checkGameOver();
  }

  usePotion(card: Card) {
    if (card.suit !== 'hearts') throw new Error('Not a potion');
    if (this.usedPotionThisTurn) {
      this.discardCard(card);
      return false;
    }
    const add = Math.min(this.startingHealth - this.health, card.value);
    this.health += add;
    this.discardCard(card);
    this.usedPotionThisTurn = true;
    return true;
  }

  pickFromRoom(index: number, opts?: { fightMethod?: 'bare' | 'weapon' }):
    { ok: true } | { ok: false; reason: string } 
  {
    if (this.gameOver) return { ok: false, reason: 'Game already over' };
    if (index < 0 || index >= this.room.length) return { ok: false, reason: 'Invalid index' };
    if (this.picksThisTurn >= 3) return { ok: false, reason: 'Already picked 3 cards this turn' };

    const card = this.room.splice(index, 1)[0] as Card;
    const type = cardTypeOf(card);

    try {
      if (type === 'weapon') {
        this.equipWeapon(card);
      } else if (type === 'potion') {
        if (this.usedPotionThisTurn) {
          this.discardCard(card);
        } else {
          this.usePotion(card);
        }
      } else if (type === 'monster') {
        if (this.equipped && opts?.fightMethod === 'weapon') {
          try {
            this.fightWithWeapon(card);
          } catch (e: any) {
            this.privateBarehand(card, false);
          }
        } else {
          this.privateBarehand(card, true);
        }
      } else {
        this.discardCard(card);
      }
    } catch (err: any) {
      this.discardCard(card);
      return { ok: false, reason: err.message || 'Error' };
    }

    this.picksThisTurn += 1;

    if (this.picksThisTurn >= 3) {
      this.endTurn();
    }

    return { ok: true };
  }

  endTurn() {
    this.turnNumber += 1;
    if (this.picksThisTurn > 0) {
      this.previousAvoided = false;
    }
    this.picksThisTurn = 0;
    this.usedPotionThisTurn = false;

    this.fillRoomToFour();

    this.checkGameOver();
  }

  checkGameOver() {
    if (this.gameOver) return;
    if (this.health <= 0) {
      const remainingMonsters = [
        ...this.deck,
        ...this.room,
      ].filter(c => cardTypeOf(c) === 'monster');
      let penalty = 0;
      for (const m of remainingMonsters) penalty += m.value;
      const finalLife = this.health - penalty;
      this.score = finalLife;
      this.gameOver = true;
      return;
    }

    const deckEmpty = this.deck.length === 0;
    if (deckEmpty && this.room.length === 0) {
      let finalLife = this.health;
      const last = this.discard.length > 0 ? this.discard[this.discard.length - 1] : null;
      if (finalLife === this.startingHealth && last && last.suit === 'hearts') {
        finalLife = finalLife + last.value;
      }
      this.score = finalLife;
      this.gameOver = true;
      return;
    }
  }
}

