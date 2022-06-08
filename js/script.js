let _gameData = {
  players: [],
  firstTeam: [],
  secondTeam: [],
  recentPlayers: loadLocalArray("recentPlayers"),
};

loadRecentDataList("playersNames");
hideElement("playersList");
hideElement("playersButtonAssign");
hideElement("teams");

function loadLocalArray(key) {
  if (localStorage.getItem(key) != null)
    return localStorage.getItem(key).split(",");
  else return [];
}

function saveLocalArray(key, array) {
  localStorage.setItem(key, array.toString());
}

function addItemToList(string, id) {
  let item = document.createElement("li");
  let deleteButton = document.createElement("a");

  item.innerHTML = string + deleteButton;
  deleteButton.href = "#";
  deleteButton.innerText = " X";
  deleteButton.onclick = function () {
    this.parentNode.remove();
    _gameData.players.splice(_gameData.players.indexOf(string), 1);
    if (!checkForChildren("playersList")) {
      hideElement("playersList");
      hideElement("playersButtonAssign");
    }
  };

  if (!_gameData.recentPlayers.includes(string)) {
    saveRecentDataList(string);
  }
  document.getElementById(id).appendChild(item);
  document.getElementById(id).lastChild.appendChild(deleteButton);
}

function loadRecentDataList(id) {
  let array = _gameData.recentPlayers.sort();
  for (let i = 0; i < array.length; i++) {
    let item = document.createElement("option");
    item.value = array[i];
    document.getElementById(id).appendChild(item);
  }
}

function saveRecentDataList(string) {
  _gameData.recentPlayers.push(string);
  saveLocalArray("recentPlayers", _gameData.recentPlayers);
}

function checkInput(string) {
  if (_gameData.players.includes(string))
    return { result: false, desc: "Имя не должно повторяться" };
  if (string == "") return { result: false, desc: "Имя не может быть пустым" };
  if (string.includes(","))
    return { result: false, desc: "Имя не может содержать запятые" };
  if (string.includes("|"))
    return { result: false, desc: "Имя не может содержать символ |" };
  if (string.length > 18) return { result: false, desc: "Имя слишком длинное" };
  return { result: true, desc: "Все корректно" };
}

function getRandomInt(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function hideElement(id) {
  document.getElementById(id).classList.add("hidden");
}

function showElement(id) {
  document.getElementById(id).classList.remove("hidden");
}

function checkForChildren(id) {
  if (document.getElementById(id).childNodes.length > 0) return true;
  else return false;
}

function assignTeams(array) {
  if (array.length > 3) {
    let buffer = array;
    while (buffer.length > 0) {
      let rnd = getRandomInt(0, buffer.length - 1);
      if (_gameData.firstTeam.length <= _gameData.secondTeam.length)
        _gameData.firstTeam.push(buffer[rnd]);
      else _gameData.secondTeam.push(buffer[rnd]);
      buffer.splice(rnd, 1);
    }
    return true;
  } else alert("Нужно больше игроков (Минимум 4)!");
  return false;
}

function fillTeamList(id, array) {
  for (let element of array) {
    let item = document.createElement("li");
    item.innerHTML = element;
    document.getElementById(id).appendChild(item);
  }
}

playersButtonAdd.onclick = function () {
  let input = document.getElementById("playersInput");
  if (checkInput(input.value).result) {
    _gameData.players.push(input.value);
    addItemToList(input.value, "playersList");
    input.value = "";
    input.focus();
  } else {
    alert(checkInput(input.value).desc);
  }
  if (checkForChildren("playersList")) {
    showElement("playersList");
    showElement("playersButtonAssign");
  }
};

playersButtonAssign.onclick = function () {
  if (assignTeams(_gameData.players)) {
    fillTeamList("teamsListFirst", _gameData.firstTeam);
    fillTeamList("teamsListSecond", _gameData.secondTeam);
    hideElement("players");
    showElement("teams");
    saveLocalArray("firstTeam", _gameData.firstTeam);
    saveLocalArray("secondTeam", _gameData.secondTeam);
  }
};

spoilerButtonClear.onclick = function () {
  localStorage.clear();
};

spoilerButtonRestore.onclick = function () {
  fillTeamList("listFirstTeam", loadLocalArray("firstTeam"));
  fillTeamList("listSecondTeam", loadLocalArray("secondTeam"));
};
