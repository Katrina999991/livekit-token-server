const { AccessToken } = require("livekit-server-sdk");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { roomName, userId, username } = req.body || {};
    if (!roomName || !userId) {
      return res.status(400).json({ error: "roomName and userId are required" });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: "Missing LIVEKIT env vars" });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: String(userId),
      name: username ? String(username) : undefined
    });

    at.addGrant({
      roomJoin: true,
      room: String(roomName),
      canPublish: true,
      canSubscribe: true,
      canPublishData: true
    });

    const token = await at.toJwt();
    return res.status(200).json({ token });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
};
