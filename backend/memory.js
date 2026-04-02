const fs = require('fs');
const path = require('path');

const MEMORY_PATH = path.join(__dirname, '..', 'data', 'memory.json');

function defaultMemory() {
  return {
    users: {}
  };
}

function getMemory(user) {
  const data = JSON.parse(fs.readFileSync(FILE));
  return data[user] || { skills: {} };
}

function updateMemory(user, skill, score) {
  const data = JSON.parse(fs.readFileSync(FILE));

  if (!data[user]) data[user] = { skills: {} };

  data[user].skills[skill] = {
    level: score,
    lastReviewed: new Date().toISOString()
  };

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function loadMemory() {
  if (!fs.existsSync(MEMORY_PATH)) {
    saveMemory(defaultMemory());
  }
  return JSON.parse(fs.readFileSync(MEMORY_PATH, 'utf8'));
}

function saveMemory(memory) {
  const dir = path.dirname(MEMORY_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2));
}

module.exports = { getMemory, updateMemory, loadMemory, saveMemory, defaultMemory, MEMORY_PATH };
