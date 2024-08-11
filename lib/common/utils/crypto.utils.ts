export const randomHex = (n = 8) => {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const getCodeVerifier = async (length = 24) => randomHex(length);

export const getCodeChallenge = async (verifier: string) => {
  const hashedValue = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return btoa(String.fromCharCode(...new Uint8Array(hashedValue))).replace(/=/g, '');
};

export const verifyCodeChallenge = async (codeVerifier: string, codeChallenge: string) =>
  getCodeChallenge(codeVerifier).then(challenge => challenge === codeChallenge);

export class PKCECodeGenerator {
  static readonly code = getCodeVerifier;
  static readonly challenge = getCodeChallenge;
  static readonly verify = verifyCodeChallenge;

  static async codes(length = 24) {
    const verifier = await this.code(length);
    const challenge = await this.challenge(verifier);
    const verify = () => this.verify(verifier, challenge);
    return { verifier, challenge, verify };
  }
}
