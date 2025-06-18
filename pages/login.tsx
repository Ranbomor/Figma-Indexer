export default function Login() {
  const clientId = process.env.NEXT_PUBLIC_FIGMA_CLIENT_ID!;
  const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_FIGMA_REDIRECT_URI!);
  const state = 'ran123'; // אקראי/קבוע – לשמירה בצדך
  const scope = 'file_read';

  const oauthUrl = `https://www.figma.com/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&response_type=code`;

  return (
    <div style={{ padding: 32 }}>
      <h1>Connect to Figma</h1>
      <a href={oauthUrl}>
        <button style={{ padding: '10px 20px', fontSize: 16 }}>
          Connect with Figma
        </button>
      </a>
    </div>
  );
}
