const DEFAULT_MODEL = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-latest';

async function generateTutorResponse({
  systemPrompt,
  userMessage,
  maxTokens = 300,
  temperature = 0.4
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      source: 'mock',
      text: `[Mock Claude] I can help with: ${userMessage}. Let's break it into 2 small steps and practice one question.`
    };
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Claude API error ${response.status}: ${details}`);
  }

  const data = await response.json();
  const text = (data.content || [])
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim();

  return {
    source: 'claude',
    text
  };
}

module.exports = {
  generateTutorResponse,
  DEFAULT_MODEL
};
