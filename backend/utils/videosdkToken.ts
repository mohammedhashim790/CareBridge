import jwt from 'jsonwebtoken';

export const generateVideoSDKToken = () => {
  const apiKey = process.env.VIDEOSDK_API_KEY;
  const secretKeyHex = process.env.VIDEOSDK_SECRET_KEY;
  
  console.log("API Key:", apiKey);
  console.log("Secret Key:", secretKeyHex);
  console.log("Secret Key Length:", secretKeyHex?.length);

  if (!apiKey || !secretKeyHex) {
    throw new Error("Environment variables VIDEOSDK_API_KEY and VIDEOSDK_SECRET_KEY must be defined.");
  }

  /*
  * Hexa Decimcal conversion is not required as the secret is in Hexa Decimal only.*/
  // Try hex conversion first
  // const secretKey = Buffer.from(secretKeyHex, 'base64').toString();
  // console.log("Converted Secret Key:", secretKey);

  const secretKey = secretKeyHex;

  const payload = {
    apikey: apiKey,
    permissions: ["allow_join", "allow_mod"],
    iat: Math.floor(Date.now() / 1000),
  };

  console.log("Payload:", payload);

  const token = jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn: "24h",
  });

  console.log(`Generated VideoSDK token: ${token}`);
  
  // Verify the token locally
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Token verified locally:", decoded);
  } catch (error) {
    console.error("Local token verification failed:", error);
  }

  return token;
};
