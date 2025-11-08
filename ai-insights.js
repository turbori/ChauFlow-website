// AI Insights Module for ChauFlow
// Provides intelligent insights based on user data across all pages

// AI Configuration
// IMPORTANT: In production, store API key in environment variables or secure backend
// For now, this will be set via a separate config file not committed to git
const AI_CONFIG = {
    apiKey: window.OPENAI_API_KEY || '', // Set this in config.js (not committed)
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    maxTokens: 150
};

// Cache insights to avoid excessive API calls
const insightsCache = {
    dashboard: { data: null, timestamp: null },
    income: { data: null, timestamp: null },
    expenses: { data: null, timestamp: null },
    balanceSheet: { data: null, timestamp: null }
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ============================================
// Generate AI Insight
// ============================================

async function generateAIInsight(pageType, userData) {
    try {
        // Check cache first
        const cached = insightsCache[pageType];
        if (cached.data && cached.timestamp && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            return cached.data;
        }

        const prompt = buildPrompt(pageType, userData);
        
        const response = await fetch(AI_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: AI_CONFIG.model,
                messages: [
                    {
                        role: 'system',
                        content: `You are an intelligent financial assistant for ChauFlow, a bookkeeping app for independent chauffeurs and drivers. Your job is to analyze the user's full financial activity and generate a hyper-personalized, supportive insight based on the current page they are on.

Your task:
1. Read **all available transaction details**, not just amounts or titles.
2. Use those details to write **one personalized insight** that feels like you're paying close attention.
3. Your tone should be:
   - Encouraging and human
   - Helpful, never critical
   - Action-oriented or awareness-building
4. Keep the insight **concise (1–2 sentences max)**.
5. Avoid repeating the numbers back unless necessary. Focus on **patterns, good habits, opportunities, or things worth noticing.**

Examples of helpful insight types:
- Highlighting trends or opportunities
- Congratulating good habits
- Gently surfacing areas to improve
- Encouraging consistency
- Pointing out savings potential

Now respond with only one insight, nothing else. Be as helpful as possible.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: AI_CONFIG.maxTokens,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const insight = data.choices[0].message.content.trim();

        // Cache the result
        insightsCache[pageType] = {
            data: insight,
            timestamp: Date.now()
        };

        return insight;

    } catch (error) {
        console.error('Error generating AI insight:', error);
        return getFallbackInsight(pageType, userData);
    }
}

// ============================================
// Build Prompts for Each Page
// ============================================

function buildPrompt(pageType, userData) {
    // Format the data as JSON for the AI to analyze
    const promptData = {
        page: pageType.charAt(0).toUpperCase() + pageType.slice(1),
        data: userData
    };
    
    return `Input:\n${JSON.stringify(promptData, null, 2)}`;
}

// ============================================
// Fallback Insights (if API fails)
// ============================================

function getFallbackInsight(pageType, userData) {
    const fallbacks = {
        dashboard: [
            "Keep tracking your income and expenses daily for the most accurate financial picture.",
            "Your consistent logging helps you make better business decisions.",
            "Review your top expense category to find potential savings opportunities."
        ],
        income: [
            "Diversifying your income sources can help stabilize your earnings.",
            "Track which times of day are most profitable to optimize your schedule.",
            "Consider focusing on your highest-earning service types."
        ],
        expenses: [
            "Remember: most business expenses are tax deductible. Keep good records!",
            "Review recurring expenses monthly to catch any unnecessary charges.",
            "Fuel and maintenance are typically your biggest controllable costs."
        ],
        balanceSheet: [
            "Building equity in your business strengthens your financial position.",
            "Paying down debt improves your credit profile and reduces interest costs.",
            "Regular contributions to your business show financial stability to lenders."
        ]
    };

    const options = fallbacks[pageType] || fallbacks.dashboard;
    return options[Math.floor(Math.random() * options.length)];
}

// ============================================
// Display Insight in UI
// ============================================

function displayInsight(containerId, insight, isLoading = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (isLoading) {
        container.innerHTML = `
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-r-lg p-4 shadow-sm">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0">
                        <svg class="w-6 h-6 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <h4 class="text-sm font-bold text-gray-900">ChauF AI</h4>
                            <span class="text-xs text-blue-600 font-medium">Analyzing...</span>
                        </div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-r-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="text-sm font-bold text-gray-900">ChauF AI</h4>
                            <button onclick="refreshInsight()" class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Refresh
                            </button>
                        </div>
                        <p class="text-sm text-gray-700 leading-relaxed">${insight}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// ============================================
// Clear Cache (for refresh functionality)
// ============================================

function clearInsightCache(pageType = null) {
    if (pageType) {
        insightsCache[pageType] = { data: null, timestamp: null };
    } else {
        Object.keys(insightsCache).forEach(key => {
            insightsCache[key] = { data: null, timestamp: null };
        });
    }
}

