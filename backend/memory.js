const fs = require('fs');
const path = require('path');

const MEMORY_PATH = path.join(__dirname, '..', 'data', 'memory.json');

function defaultMemory() {
  return {
    users: {}
  };
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

module.exports = { loadMemory, saveMemory, defaultMemory, MEMORY_PATH };
