require("dotenv").config();

async function createClient() {
  const { create } = await import("ipfs-http-client");
  const auth =
    "Basic " +
    Buffer.from(
      process.env.INFURA_API_KEY + ":" + process.env.INFURA_API_KEY_SECRET
    ).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });
  return client;
}

module.exports = createClient;
