let _gameData = {
  players: [],
  firstTeam: [],
  secondTeam: [],
  recentPlayers: loadLocalArray("recentPlayers"),
};

function loadLocalArray(key) {
  if (localStorage.getItem(key) != null) return localStorage.getItem(key).split(",");
  else return [];
};
function saveLocalArray(key, array) {
	localStorage.setItem(key, array.toString());
};
function addItemToList(string, id) {
  let item = document.createElement("li");
  let deleteButton = document.createElement("a");

  item.innerHTML = string + deleteButton;
  deleteButton.href = "#";
  deleteButton.innerText = " X";
  deleteButton.onclick = function() {
    this.parentNode.remove();
    _gameData.players.splice(_gameData.players.indexOf(string), 1);
    if(!checkForChildren("listNames")) {
      hideElement("listNames");
      hideElement("buttonAssign");
    }
  }

  if(!_gameData.recentPlayers.includes(string)) {
    saveRecentDataList(string);
  }
  document.getElementById(id).appendChild(item);
  document.getElementById(id).lastChild.appendChild(deleteButton);
};
function loadRecentDataList(id) {
  let array = _gameData.recentPlayers.sort();
  for (let i = 0; i < array.length; i++) {
    let item = document.createElement("option");
    item.value = array[i];
    document.getElementById(id).appendChild(item);
  }
};
function saveRecentDataList(string) {
  _gameData.recentPlayers.push(string);
  saveLocalArray("recentPlayers", _gameData.recentPlayers);
};
function checkInput(string) {
  if (_gameData.players.includes(input.value)) return {result: false, desc: "Имя не должно повторяться"};
  if (string == "") return {result: false, desc: "Имя не может быть пустым"};
  if (string.includes(",")) return {result: false, desc: "Имя не может содержать запятые"};
  if (string.includes("|")) return {result: false, desc: "Имя не может содержать символ |"};
  if (string.length > 18) return {result: false, desc: "Имя слишком длинное"};
  return {result: true, desc: "Все корректно"};
};
function getRandomInt(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};
function saveElementDisplay(id) {
  if(!_displayState[id]) {
    _displayState[id] = document.getElementById(id).style.display;
  }
};
function hideElement(id) {
  document.getElementById(id).classList.add("hidden");
};
function showElement(id) {
  document.getElementById(id).classList.remove("hidden");
};
function checkForChildren(id) {
  if(document.getElementById(id).childNodes.length > 0) return true;
  else return false;
};
function assignTeams(array) {
  if (array.length > 3) {
    let buffer = array;
    while (buffer.length > 0) {
      let rnd = getRandomInt(0, buffer.length - 1);
      if(_gameData.firstTeam.length <= _gameData.secondTeam.length) _gameData.firstTeam.push(buffer[rnd]);
      else _gameData.secondTeam.push(buffer[rnd]);
      buffer.splice(rnd, 1);
    }
    return true;
  } else alert("Нужно больше игроков (Минимум 4)!");
  return false;
};
function fillTeamList(id, array) {
  for(let element of array) {
    let item = document.createElement("li");
    item.innerHTML = element;
    document.getElementById(id).appendChild(item);
  }
};

buttonAdd.onclick = function() {
  let input = document.getElementById("input");
  if (checkInput(input.value).result) {
    _gameData.players.push(input.value);
    addItemToList(input.value, "listNames");
    input.value = "";
    input.focus();
  } else {
    alert(checkInput(input.value).desc);
  }
  if(checkForChildren("listNames")) {
    showElement("listNames");
    showElement("buttonAssign");
  }
};
buttonAssign.onclick = function() {
  if(assignTeams(_gameData.players)) {
    fillTeamList("listFirstTeam", _gameData.firstTeam);
    fillTeamList("listSecondTeam", _gameData.secondTeam);
    hideElement("textDesc");
    hideElement("input");
    hideElement("buttonAdd");
    hideElement("listNames");
    hideElement("buttonAssign");
    hideElement("spoiler");
    showElement("textFirstTeam");
    showElement("listFirstTeam");
    showElement("textSecondTeam");
    showElement("listSecondTeam");
    saveLocalArray("firstTeam", _gameData.firstTeam);
    saveLocalArray("secondTeam", _gameData.secondTeam);
  }
};
buttonClear.onclick = function() {
  localStorage.clear();
};
buttonRecent.onclick = function() {
  fillTeamList("listFirstTeam", loadLocalArray("firstTeam"));
  fillTeamList("listSecondTeam", loadLocalArray("secondTeam"));
  hideElement("textDesc");
  hideElement("input");
  hideElement("buttonAdd");
  hideElement("listNames");
  hideElement("buttonAssign");
  hideElement("spoiler");
  showElement("textFirstTeam");
  showElement("listFirstTeam");
  showElement("textSecondTeam");
  showElement("listSecondTeam");
};

loadRecentDataList("names");
hideElement("listNames");
hideElement("buttonAssign");
hideElement("textFirstTeam");
hideElement("listFirstTeam");
hideElement("textSecondTeam");
hideElement("listSecondTeam");
