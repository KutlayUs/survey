import { DrawflowData, GeminiAnalysis, SurveyResponse } from '../types';

const POSITIVE_WORDS = ['good','great','excellent','amazing','love','like','happy','satisfied'];
const NEGATIVE_WORDS = ['bad','terrible','awful','hate','dislike','sad','unsatisfied','poor'];

export const geminiService = {
  async generateSurveyFlow(prompt: string): Promise<DrawflowData> {
    // Simple default flow: one text question
    return {
      drawflow: {
        Home: {
          data: {
            '1': {
              id: 1,
              name: 'text',
              data: { question: prompt || 'Your feedback' },
              class: 'text-node',
              html: '',
              typenode: 'html',
              inputs: {},
              outputs: {},
              pos_x: 0,
              pos_y: 0,
            },
          },
        },
      },
    };
  },

  async analyzeResponses(title: string, responses: SurveyResponse[]): Promise<GeminiAnalysis> {
    const texts = responses.flatMap(r => Object.values(r.answers).map(a => String(a).toLowerCase()));
    const positive = new Set<string>();
    const negative = new Set<string>();
    const neutral = new Set<string>();
    texts.forEach(t => {
      const words = t.split(/\s+/);
      let classified = false;
      words.forEach(w => {
        if (POSITIVE_WORDS.includes(w)) { positive.add(t); classified = true; }
        if (NEGATIVE_WORDS.includes(w)) { negative.add(t); classified = true; }
      });
      if (!classified) neutral.add(t);
    });

    const analysis: GeminiAnalysis = {
      overallSummary: `Collected ${responses.length} responses for "${title}"`,
      keyInsights: [`${positive.size} positive response(s)`, `${negative.size} negative response(s)`],
      sentiment: {
        positive_themes: Array.from(positive),
        negative_themes: Array.from(negative),
        neutral_themes: Array.from(neutral),
      },
      actionableRecommendations: positive.size >= negative.size
        ? ['Maintain strengths identified by participants.']
        : ['Investigate negative feedback and consider improvements.'],
    };

    return analysis;
  },
};

