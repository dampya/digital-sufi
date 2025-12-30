<style scoped src="../../styles/games/games.css"></style>

<template>
  <div class="page">
    <main class="content">
      <h1>Games</h1>
      <br />
      <section>
        <h2>
          <router-link to="/games/scoundrel">Scoundrel</router-link>
        </h2>
        <p>
          A dungeon crawler card game where you explore rooms, fight monsters, collect weapons, and use potions to survive as long as possible.
        </p>
        <h3>Rules</h3>
        <ul>
          <li>Start with 20 health points</li>
          <li>Each turn, a room contains 4 cards from a standard deck</li>
          <li>Pick up to 3 cards per turn</li>
          <li>
            Monsters: <strong>Clubs</strong> & <strong>Spades</strong> - Fight them barehanded (lose health equal to their value) or with a weapon
          </li>
          <li>
            Weapons: <strong>Diamonds</strong> - Equip to fight monsters. When using a weapon, you only take damage from the difference between the monster's value and weapon's value. However, you can only fight monsters with values less than or equal to the last monster you defeated with that weapon
          </li>
          <li>
            Potions: <strong>Hearts</strong> - Use once per turn to restore health equal to the potion's value (up to your starting health)
          </li>
          <li>You can skip a room once per turn (if the room has 4 cards), which puts those cards on the bottom of the deck</li>
          <li>The game ends when you die (health ≤ 0) or clear the entire deck</li>
          <li>Score is based on your final health, with bonuses for clearing the dungeon</li>
        </ul>
      </section>
      <br />
      <section>
        <h2>
          <router-link to="/games/snake">Snake</router-link>
        </h2>
        <p>
          The classic Snake game. Control a snake, eat food to grow longer, and avoid hitting the walls or yourself.
        </p>
        <h3>Rules</h3>
        <ul>
          <li>Use arrow keys or WASD to control the snake's direction</li>
          <li>Eat food to grow longer and increase your score</li>
          <li>Avoid hitting the walls or your own body</li>
          <li>The game speed increases as you grow longer</li>
          <li>Your score is equal to the length of your snake</li>
          <li>The game ends when you collide with a wall or yourself</li>
        </ul>
      </section>
      <br />
      <section>
        <h2>
          <router-link to="/games/minesweeper">Minesweeper</router-link>
        </h2>
        <p>
          The classic Minesweeper puzzle game. Reveal cells on a grid, avoid hidden mines, and use numbers to deduce safe cells.
        </p>
        <h3>Rules</h3>
        <ul>
          <li>Click on cells to reveal them</li>
          <li>Numbers indicate how many mines are adjacent to that cell</li>
          <li>Use logic and deduction to identify safe cells and mine locations</li>
          <li>Right-click (or long-press on mobile) to flag cells you suspect contain mines</li>
          <li>Win by revealing all cells that don't contain mines</li>
          <li>The game ends immediately if you click on a mine</li>
          <li>Game grid is 10×10 cells</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "Games",
};
</script>
