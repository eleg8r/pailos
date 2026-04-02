const DEFAULT_MODEL = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-latest';

async function askClaude({ system = '', prompt, maxTokens = 300, temperature = 0.4 }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      source: 'mock',
      text: `[Mock Claude] ${prompt}`
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
      system,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const text = (data.content || [])
    .filter((item) => item.type === 'text')
    .map((item) => item.text)
    .join('\n')
    .trim();

  return { source: 'claude', text };
}

module.exports = { askClaude, DEFAULT_MODEL };
