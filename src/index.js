const MAX_TOKENS = 20;
const REFILL_RATE = 50000; // 5 seconds

const bucket = {
    tokens: MAX_TOKENS,
    hasTokens: function () {
        return this.tokens > 0;
    },
    consumeToken: function () {
        if (this.hasTokens())
            this.tokens -= 1;
    },
    releaseToken: function () {
        if (this.tokens < MAX_TOKENS)
            this.tokens += 1;
    }
};

async function handleIncomingRequest(requestId) {
    if (!bucket.hasTokens()) {
        console.log('❌ Out of tokens! Please try again later', requestId);
        return;
    }

    bucket.consumeToken();
    console.log('✅ Processing Request...', requestId, '| Tokens left:', bucket.tokens);

    await waitFor(2000);
}

function waitFor(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Refill token every 5 seconds
setInterval(() => {
    bucket.releaseToken();
    console.log('🔁 Token refilled | Tokens:', bucket.tokens);
}, REFILL_RATE);

// Simulate incoming requests
let requestId = 1;
setInterval(() => {
    handleIncomingRequest(requestId++);
}, 1000);
