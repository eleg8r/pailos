const { getTrack } = require('./graph');

function selectNextTopic(sessionType, userMemory) {
  const track = getTrack(sessionType);
  const topics = Object.keys(track);

  const weakest = topics
    .map((topic) => ({ topic, level: userMemory.skillLevels[topic] || 0 }))
    .sort((a, b) => a.level - b.level)[0];

  return weakest ? weakest.topic : topics[0];
}

function difficultyForLevel(level) {
  if (level <= 2) return 'beginner';
  if (level <= 6) return 'intermediate';
  return 'advanced';
}

module.exports = {
  selectNextTopic,
  difficultyForLevel
};
