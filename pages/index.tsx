// pages/index.tsx

import { useState } from 'react';

export default function Home() {
  const [fileKey, setFileKey] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFile = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/indexFile?fileKey=${encodeURIComponent(fileKey)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Unknown error');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Figma File Indexer</h1>
      <input
        type="text"
        placeholder="Enter Figma file key"
        value={fileKey}
        onChange={e => setFileKey(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', maxWidth: '400px', marginBottom: '1rem' }}
      />
      <br />
      <button onClick={fetchFile} disabled={loading || !fileKey} style={{ padding: '0.5rem 1rem' }}>
        {loading ? 'Loading...' : 'Fetch File'}
      </button>

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {result && (
        <pre style={{ marginTop: '1rem', background: '#f0f0f0', padding: '1rem', maxWidth: '100%', overflowX: 'auto' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}