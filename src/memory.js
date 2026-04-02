const fs = require('fs');
const path = require('path');

const DEFAULT_PATH = path.join(__dirname, '..', 'data', 'memory.json');

function defaultMemory() {
  return {
    users: {
      default: {
        skillLevels: {},
        weakAreas: [],
        history: []
      }
    }
  };
}

function ensureMemoryFile(filePath = DEFAULT_PATH) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultMemory(), null, 2));
  }
}

function loadMemory(filePath = DEFAULT_PATH) {
  ensureMemoryFile(filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function saveMemory(memory, filePath = DEFAULT_PATH) {
  ensureMemoryFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(memory, null, 2));
}

function getUserMemory(userId = 'default', filePath = DEFAULT_PATH) {
  const memory = loadMemory(filePath);
  if (!memory.users[userId]) {
    memory.users[userId] = { skillLevels: {}, weakAreas: [], history: [] };
    saveMemory(memory, filePath);
  }
  return memory.users[userId];
}

function updateSkill(userId, topic, delta = 1, filePath = DEFAULT_PATH) {
  const memory = loadMemory(filePath);
  if (!memory.users[userId]) {
    memory.users[userId] = { skillLevels: {}, weakAreas: [], history: [] };
  }

  const user = memory.users[userId];
  const current = user.skillLevels[topic] || 0;
  const next = Math.max(0, Math.min(10, current + delta));

  user.skillLevels[topic] = next;

  if (next <= 3 && !user.weakAreas.includes(topic)) {
    user.weakAreas.push(topic);
  }
  if (next > 3) {
    user.weakAreas = user.weakAreas.filter((item) => item !== topic);
  }

  user.history.push({
    topic,
    delta,
    newLevel: next,
    at: new Date().toISOString()
  });

  saveMemory(memory, filePath);
  return user;
}

module.exports = {
  loadMemory,
  saveMemory,
  getUserMemory,
  updateSkill,
  ensureMemoryFile,
  DEFAULT_PATH
};
