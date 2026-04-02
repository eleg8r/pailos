#!/usr/bin/env node
const readline = require('readline');
const { getUserMemory, updateSkill } = require('./memory');
const { selectNextTopic, difficultyForLevel } = require('./adaptive');
const { getPersona } = require('./personas');
const { generateTutorResponse } = require('./claude');

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function run() {
  const sessionType = process.argv[2] || 'coding';
  const personaName = process.argv[3] || 'strict';
  const userId = process.argv[4] || 'default';

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log(`\nPAILOS session started`);
  console.log(`Session type: ${sessionType} | Persona: ${personaName} | User: ${userId}\n`);

  const userMemory = getUserMemory(userId);
  const topic = selectNextTopic(sessionType, userMemory);
  const level = userMemory.skillLevels[topic] || 0;
  const difficulty = difficultyForLevel(level);
  const persona = getPersona(personaName);

  const learnerInput = await ask(rl, `What do you currently know about '${topic}'? `);

  const systemPrompt = `You are a ${persona.name} AI tutor. ${persona.style}`;
  const userMessage = [
    `Run the adaptive loop: diagnose -> teach -> review.`,
    `Topic: ${topic}`,
    `Difficulty: ${difficulty}`,
    `Learner message: ${learnerInput}`
  ].join('\n');

  try {
    const reply = await generateTutorResponse({ systemPrompt, userMessage });
    console.log(`\nTutor (${reply.source}):\n${reply.text}\n`);

    const selfScoreRaw = await ask(rl, `Self-score your understanding for '${topic}' (0-10): `);
    const selfScore = Number(selfScoreRaw);
    const delta = Number.isFinite(selfScore) ? (selfScore >= 6 ? 1 : -1) : 0;

    const updated = updateSkill(userId, topic, delta);
    console.log('Updated memory snapshot:');
    console.log(JSON.stringify({
      topic,
      newSkillLevel: updated.skillLevels[topic],
      weakAreas: updated.weakAreas.slice(-5)
    }, null, 2));
  } catch (error) {
    console.error(`Tutor error: ${error.message}`);
  } finally {
    rl.close();
  }
}

run();
