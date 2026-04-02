const express = require('express');
const { getUserMemory, updateSkill } = require('./memory');
const { selectNextTopic, difficultyForLevel } = require('./adaptive');
const { getPersona } = require('./personas');
const { generateTutorResponse } = require('./claude');

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'pailos-api' });
});

app.get('/memory/:userId', (req, res) => {
  res.json(getUserMemory(req.params.userId));
});

app.post('/session/start', async (req, res) => {
  const {
    userId = 'default',
    sessionType = 'coding',
    personaName = 'strict',
    learnerMessage = ''
  } = req.body || {};

  const memory = getUserMemory(userId);
  const topic = selectNextTopic(sessionType, memory);
  const level = memory.skillLevels[topic] || 0;
  const difficulty = difficultyForLevel(level);
  const persona = getPersona(personaName);

  try {
    const tutor = await generateTutorResponse({
      systemPrompt: `You are a ${persona.name} AI tutor. ${persona.style}`,
      userMessage: `Run diagnose -> teach -> review on topic ${topic} (${difficulty}). Learner said: ${learnerMessage}`
    });

    res.json({
      userId,
      sessionType,
      topic,
      difficulty,
      persona: persona.name,
      tutor: tutor.text,
      source: tutor.source
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/memory/update', (req, res) => {
  const { userId = 'default', topic, delta = 0 } = req.body || {};
  if (!topic) {
    return res.status(400).json({ error: 'topic is required' });
  }

  const memory = updateSkill(userId, topic, delta);
  return res.json(memory);
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`PAILOS API listening on port ${port}`);
});
