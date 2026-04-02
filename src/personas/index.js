const personas = {
  strict: {
    name: 'strict',
    style: 'Be concise, direct, and rigorous. Correct mistakes quickly.'
  },
  playful: {
    name: 'playful',
    style: 'Use encouraging language and fun analogies while staying accurate.'
  },
  challenger: {
    name: 'challenger',
    style: 'Push the learner with thought-provoking questions and edge cases.'
  }
};

function getPersona(name = 'strict') {
  return personas[name] || personas.strict;
}

module.exports = {
  personas,
  getPersona
};
