/**
 * AI Service for Healthcare Chatbot
 * Location: backend/src/services/aiService.js
 *
 * Handles communication with OpenAI API for healthcare responses
 */

const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  static async requestChatCompletion(messages, maxTokens = 1000) {
    const preferredModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const candidateModels = [
      preferredModel,
      'gpt-4o-mini',
      'gpt-4.1-mini',
    ].filter((model, idx, arr) => model && arr.indexOf(model) === idx);

    let lastError;

    for (const model of candidateModels) {
      try {
        return await client.chat.completions.create({
          model,
          max_tokens: maxTokens,
          messages,
        });
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('Failed to reach AI model');
  }

  static generateProfessionalFallbackResponse(userMessage, reason = '') {
    const failureReason = String(reason || '').toLowerCase();

    if (failureReason.includes('insufficient_quota') || failureReason.includes('quota')) {
      return 'AI service is temporarily unavailable because the OpenAI quota for this API key has been exceeded. Please update billing or use a different API key, then try again.';
    }

    if (failureReason.includes('invalid_api_key') || failureReason.includes('incorrect api key')) {
      return 'AI service is unavailable because the configured OpenAI API key is invalid. Please update OPENAI_API_KEY in backend/.env and restart the backend server.';
    }

    const text = (userMessage || '').toLowerCase();

    if (text.includes('chest pain') || text.includes('breathing') || text.includes('faint')) {
      return 'Your symptoms may be serious. Please seek urgent medical care immediately or call emergency services now.';
    }

    if (text.includes('fever') || text.includes('cold') || text.includes('cough')) {
      return 'I am temporarily unable to access advanced AI. For now: stay hydrated, monitor temperature, and seek medical care if symptoms worsen or persist beyond 48-72 hours.';
    }

    return 'I am temporarily unable to access advanced AI right now. Please share your symptom duration, severity, and any existing conditions, and I will provide structured guidance.';
  }

  /**
   * Get healthcare chat response
   */
  static async getChatResponse(userMessage, conversationHistory = [], userProfile = {}) {
    try {
      const systemPrompt = this.buildSystemPrompt(userProfile);

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      const response = await this.requestChatCompletion(messages, 1000);

      const assistantMessage = response.choices?.[0]?.message?.content || 'I am here to help. Could you rephrase that?';
      const emotion = this.detectEmotion(assistantMessage);

      return {
        message: assistantMessage,
        emotion,
        tokens: {
          input: response.usage?.prompt_tokens || 0,
          output: response.usage?.completion_tokens || 0,
        },
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return {
        message: this.generateProfessionalFallbackResponse(
          userMessage,
          error?.code || error?.type || error?.message || ''
        ),
        emotion: 'concerned',
        tokens: { input: 0, output: 0 },
      };
    }
  }

  /**
   * Symptom checker - specialized conversation for symptom analysis
   */
  static async analyzeSymptoms(symptoms, history = [], userProfile = {}) {
    try {
      const systemPrompt = `You are a healthcare symptom checker assistant.

Guidelines:
1. Ask clarifying questions about symptoms (duration, severity, location, triggers)
2. Do NOT provide a diagnosis, but list possible conditions to consider
3. Always recommend seeing a doctor for serious symptoms
4. Be empathetic and reassuring
5. If symptoms suggest emergency (severe chest pain, difficulty breathing, etc.), urge immediate medical attention

User Profile:
- Age: ${userProfile.age || 'Not specified'}
- Allergies: ${userProfile.allergies?.join(', ') || 'None'}
- Medical Conditions: ${userProfile.medicalConditions?.join(', ') || 'None'}

Format your response as:
- Ask 1-2 clarifying questions
- List severity level (mild/moderate/severe)
- Suggest possible conditions (NOT a diagnosis)
- Recommend next steps`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: `Symptoms: ${symptoms.join(', ')}` },
      ];

      const response = await this.requestChatCompletion(messages, 1500);

      const message = response.choices?.[0]?.message?.content || 'Please share more symptom details so I can help better.';
      const isEmergency = this.detectEmergency(message);
      const severity = this.extractSeverity(message);

      return {
        message,
        isEmergency,
        severity,
        shouldSeekDoctor: isEmergency || severity === 'severe',
      };
    } catch (error) {
      console.error('Symptom analysis error:', error);
      throw new Error('Failed to analyze symptoms');
    }
  }

  /**
   * Medicine reminder personalization
   */
  static async getMedicineReminder(medicine) {
    const systemPrompt = `You are a healthcare assistant reminder system.
Create a brief, friendly reminder message for taking medicine.
Keep it under 30 words. Include the medicine name, dosage, and any important tips.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Remind me to take: ${medicine.name} (${medicine.dosage}) - ${medicine.frequency}`,
      },
    ];

    const response = await this.requestChatCompletion(messages, 100);

    return {
      message: response.choices?.[0]?.message?.content || 'Time to take your medicine as scheduled.',
      emotion: 'concerned',
    };
  }

  /**
   * Build context-aware system prompt
   */
  static buildSystemPrompt(userProfile = {}) {
    return `You are HealthAI, a professional virtual healthcare assistant.

Your role:
- Provide health information and guidance
- Ask follow-up questions like a caring doctor
- Be empathetic and supportive
- NEVER provide a medical diagnosis
- Always recommend professional medical help for serious conditions
- Remember previous context in the conversation
- Personalize responses based on user health profile

User Profile:
- Age: ${userProfile.age || 'Not specified'}
- Gender: ${userProfile.gender || 'Not specified'}
- Blood Type: ${userProfile.bloodType || 'Not specified'}
- Known Allergies: ${userProfile.allergies?.join(', ') || 'None'}
- Medical Conditions: ${userProfile.medicalConditions?.join(', ') || 'None'}
- Current Medications: ${userProfile.currentMedications?.join(', ') || 'None'}

Important Rules:
1. DISCLAIMER: Remind users that you cannot replace professional medical advice
2. For emergency symptoms (severe chest pain, difficulty breathing, loss of consciousness), recommend immediate hospital visit
3. Ask about duration and severity of symptoms
4. Suggest lifestyle changes when appropriate
5. Recommend doctor visit for concerning symptoms
6. Maintain conversation history for continuity
7. Be supportive and non-judgmental
8. Provide evidence-based information

Response format:
- Keep responses concise (3-6 bullet points when useful)
- Use clear, plain language
- Include a short "When to seek care" note when symptoms are concerning
- Do not invent diagnoses, prescriptions, or lab values`;
  }

  /**
   * Detect emotion from message content
   */
  static detectEmotion(assistantMessage) {
    const lowerMessage = assistantMessage.toLowerCase();

    if (
      lowerMessage.includes('emergency') ||
      lowerMessage.includes('urgent') ||
      lowerMessage.includes('hospital') ||
      lowerMessage.includes('severe')
    ) {
      return 'concerned';
    }

    if (
      lowerMessage.includes('great') ||
      lowerMessage.includes('wonderful') ||
      lowerMessage.includes('happy') ||
      lowerMessage.includes('better')
    ) {
      return 'happy';
    }

    if (
      lowerMessage.includes('sorry') ||
      lowerMessage.includes('difficult') ||
      lowerMessage.includes('worry')
    ) {
      return 'concerned';
    }

    return 'neutral';
  }

  /**
   * Detect if response mentions emergency
   */
  static detectEmergency(message) {
    const emergencyKeywords = [
      'emergency',
      'call ambulance',
      '911',
      'hospital',
      'severe chest pain',
      'difficulty breathing',
      'unconscious',
      'severe bleeding',
      'poisoning',
    ];

    return emergencyKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );
  }

  /**
   * Extract severity level from message
   */
  static extractSeverity(message) {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('severe') ||
      lowerMessage.includes('critical') ||
      lowerMessage.includes('emergency')
    ) {
      return 'severe';
    }

    if (lowerMessage.includes('moderate')) {
      return 'moderate';
    }

    return 'mild';
  }
}

module.exports = AIService;
