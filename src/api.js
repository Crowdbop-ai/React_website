const API_URL = import.meta.env.VITE_API_URL;

async function apiPost(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(`API Error on ${endpoint}:`, error);
        throw error;
    }
}

export const votingApi = {
    /**
     * Initializes the product database by fetching data from the Shopbop API.
     * Returns a success message upon completion.
     */
    async initialize(query = "all") {
        return apiPost("init", { queryStringParameters: { q: query } });
    },

    /**
     * Fetches a new pair of products for voting.
     * Returns an array with two product objects from DynamoDB.
     */
    async fetchVotePair() {
        return apiPost("vote", { action: "vote" });
    },

    /**
     * Fetches the leaderboard rankings sorted by rankingScore.
     * Returns an array of products in descending ranking order.
     */
    async fetchLeaderboard() {
        return apiPost("leaderboard", { action: "leaderboard" });
    },

    /**
     * Submits a vote for the winner and loser products.
     * @param {string} winnerProductSin - Product SIN of the winner.
     * @param {string} loserProductSin - Product SIN of the loser.
     * Returns updated ranking information.
     */
    async submitVote(winnerProductSin, loserProductSin) {
        return apiPost("vote", {
            action: "vote",
            vote: { winnerProductSin, loserProductSin }
        });
    }
};

