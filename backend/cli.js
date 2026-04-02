#!/usr/bin/env node
const { askClaude } = require('./claude');
const { loadMemory } = require('./memory');

async function main() {
  const sessionType = process.argv[2] || 'coding';
  const userId = process.argv[3] || 'default';

  const memory = loadMemory();
  const user = memory.users[userId] || { skillLevels: {}, weakAreas: [] };

  const reply = await askClaude({
    system: 'You are an AI tutor.',
    prompt: `Start a ${sessionType} tutoring session using diagnose -> teach -> review. User weak areas: ${user.weakAreas.join(', ') || 'none'}.`
  });

  console.log(`PAILOS CLI`);
  console.log(`User: ${userId}`);
  console.log(`Session: ${sessionType}`);
  console.log(`Tutor (${reply.source}): ${reply.text}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
