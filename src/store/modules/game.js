const RENDER_DELAY = 100;
const gameUpdates = [];
let gameStart = 0;
let firstServerTimestamp = 0;

function getBaseUpdate() {
    const serverTime = currentServerTime();
    for (let i = gameUpdates.length - 1; i >= 0; i--) {
      if (gameUpdates[i].t <= serverTime) {
        return i;
      }
    }
    return -1;
  }
function currentServerTime() {
    return firstServerTimestamp + (Date.now() - gameStart) - RENDER_DELAY;
}

const actions = {
    initState() {
        gameStart = 0;
        firstServerTimestamp = 0;
      },
      

      processGameUpdate(update) {
        if (!firstServerTimestamp) {
          firstServerTimestamp = update.t;
          gameStart = Date.now();
        }
        gameUpdates.push(update);
      
       // updateLeaderboard(update.leaderboard);
      
        // Keep only one game update before the current server time
        const base = getBaseUpdate();
        if (base > 0) {
          gameUpdates.splice(0, base);
        }
        console.log(gameUpdates)
      },

}

const getters = {}
const mutations = {}
const state = {}

export default {
    state,
    getters,
    actions,
    mutations
}
