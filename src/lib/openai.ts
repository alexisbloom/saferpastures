import OpenAI from 'openai';

// Create a more resilient OpenAI client that handles missing API keys
const createOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  // If no API key is available, return null
  if (!apiKey) {
    console.warn('OpenAI API key is missing. Chat functionality will be simulated.');
    return null;
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

const openai = createOpenAIClient();

export const getChatGPTResponse = async (
  cravingType: string,
  userMessage: string
): Promise<string> => {
  const systemPrompt = `You are a compassionate and knowledgeable counselor specializing in helping people manage ${cravingType} cravings. 
Your responses should be:
1. Empathetic and understanding
2. Based on proven therapeutic techniques
3. Focused on immediate, practical steps
4. Encouraging and non-judgmental

Keep responses concise but impactful.`;

  // If OpenAI client isn't available, return a simulated response
  if (!openai) {
    return simulateResponse(cravingType, userMessage);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0]?.message?.content || "I'm here to help. Could you tell me more about what you're experiencing?";
  } catch (error) {
    console.error('Error getting ChatGPT response:', error);
    return "I'm having trouble connecting right now. Remember to breathe deeply and stay present. I'll be back to help soon.";
  }
};

// Simulate responses when API key is missing
const simulateResponse = (cravingType: string, userMessage: string): string => {
  // Get quotes from our database based on craving type
  const responses = {
    food: [
      "Food cravings often pass within 20 minutes. Try drinking a glass of water and taking a short walk.",
      "Consider if you're physically hungry or emotionally hungry. If it's emotional, try journaling about your feelings instead.",
      "Remember that cravings are temporary. Take three deep breaths and focus on how you'll feel after making a healthy choice."
    ],
    shopping: [
      "Before making a purchase, try waiting 24 hours to see if you still feel the same urge.",
      "Shopping cravings often come from emotional needs. What else might help you feel better right now?",
      "Try making a list of things you're grateful for that you already own. This can help reduce the desire for new items."
    ],
    alcohol: [
      "Alcohol cravings typically last 15-30 minutes. Try to distract yourself with a different activity during this time.",
      "Remember your reasons for cutting back. What positive changes have you noticed since reducing your alcohol intake?",
      "Try a relaxation technique like progressive muscle relaxation to help manage the craving sensation."
    ],
    smoking: [
      "Nicotine cravings usually pass within 5-10 minutes. Try the 4Ds: Delay, Deep breathe, Drink water, Do something else.",
      "Remind yourself why you want to quit. Focus on the health benefits you're already experiencing.",
      "Try changing your environment - move to a different room or go outside for fresh air to help the craving pass."
    ],
    caffeine: [
      "Caffeine withdrawal headaches can be managed with proper hydration and over-the-counter pain relievers if needed.",
      "Try substituting with a caffeine-free alternative like herbal tea or sparkling water with lemon.",
      "Remember that caffeine withdrawal symptoms typically improve significantly after 7-10 days."
    ],
    other: [
      "Whatever you're craving, remember that the feeling is temporary. Focus on your breathing for a few minutes.",
      "Try the 5-4-3-2-1 technique: Name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste.",
      "Consider what need this craving is trying to fulfill. Is there another way to meet that need?"
    ]
  };

  // Select a random response based on craving type
  const typeResponses = responses[cravingType as keyof typeof responses] || responses.other;
  const randomIndex = Math.floor(Math.random() * typeResponses.length);
  
  return typeResponses[randomIndex];
};