const app = Vue.createApp({
  data() {
    return {
      // game data
      game: {
        teams: [[], []],
        players: [],
      },
      // screens for visibility control
      screens: {
        players: true,
        teams: false,
      },
      // input to get value
      input: "",
    };
  },
  computed: {
    // recent players for datalist
    recentPlayers() {
      return this.loadLocalArray("recentPlayers").sort();
    },

    // elements for visibility control
    playersList() {
      return this.game.players.length > 0 ? true : false;
    },

    playersButtonAssign() {
      return this.game.players.length > 3 ? true : false;
    },
  },
  methods: {
    loadLocalArray(key) {
      if (localStorage.getItem(key) != null)
        return localStorage.getItem(key).split(",");
      else return [];
    },

    saveLocalArray(key, array) {
      localStorage.setItem(key, array.toString());
    },

    deletePlayerFromList(index) {
      this.game.players.splice(index, 1);
    },

    validateInput(string) {
      if (this.game.players.includes(string))
        return { result: false, desc: "Имя не должно повторяться" };
      if (string == "")
        return { result: false, desc: "Имя не может быть пустым" };
      if (string.includes(","))
        return { result: false, desc: "Имя не может содержать запятые" };
      if (string.includes("|"))
        return { result: false, desc: "Имя не может содержать символ |" };
      if (string.length > 18)
        return { result: false, desc: "Имя слишком длинное" };
      return { result: true, desc: "OK" };
    },

    getRandomInt(min, max) {
      let rand = min - 0.5 + Math.random() * (max - min + 1);
      return Math.round(rand);
    },

    addPlayerToList() {
      if (this.validateInput(this.input).result) {
        this.game.players.push(this.input);
        this.input = "";
        this.$refs.input.focus();
      } else {
        alert(this.validateInput(this.input).desc);
      }
    },

    validatePlayersList(array) {
      return array.length < 4
        ? { result: false, desc: "Нужно больше игроков (Минимум 4)!" }
        : { result: true, desc: "OK" };
    },

    assignTeams(array) {
      if (this.validatePlayersList(array).result) {
        let buffer = array.slice(0);
        while (buffer.length > 0) {
          let rnd = this.getRandomInt(0, buffer.length - 1);
          this.game.teams[0].length <= this.game.teams[1].length
            ? this.game.teams[0].push(buffer[rnd])
            : this.game.teams[1].push(buffer[rnd]);
          buffer.splice(rnd, 1);
        }
        this.saveLocalArray("firstTeam", this.game.teams[0]);
        this.saveLocalArray("secondTeam", this.game.teams[1]);
        this.saveLocalArray("recentPlayers", this.getRecentPlayers());
        this.screens.players = false;
        this.screens.teams = true;
      } else alert(this.validatePlayersList(array).desc);
    },

    clearLocalData() {
      localStorage.clear();
    },

    restoreLocalData() {
      this.game.teams[0] = this.loadLocalArray("firstTeam");
      this.game.teams[1] = this.loadLocalArray("secondTeam");
      this.screens.players = false;
      this.screens.teams = true;
    },

    getRecentPlayers() {
      let recentPlayers = this.loadLocalArray("recentPlayers");
      for (let i = 0; i < this.game.players.length; i++) {
        if (!recentPlayers.includes(this.game.players[i]))
          recentPlayers.push(this.game.players[i]);
      }
      return recentPlayers;
    },
  },
});
app.mount("#app");
