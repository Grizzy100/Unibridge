const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:3006";

export const chatAPI = {
    sendMessage: async (message: string, sessionId?: string) => {
        let token = null;
        if (typeof window !== "undefined") {
            token = localStorage.getItem("accessToken");
        }

        const response = await fetch(`${CHAT_API_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ message, sessionId })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to communicate with chat service");
        }

        return data;
    }
};
