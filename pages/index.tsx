import { useState } from 'react';

export default function Home() {
  const [fileKey, setFileKey] = useState('');
  const [result, setResult] = useState<any>(null);

  const fetchIndex = async () => {
    const res = await fetch(`/api/indexFile?fileKey=${fileKey}`);
    const json = await res.json();
    setResult(json);
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Figma Indexer</h1>
      <input
        value={fileKey}
        onChange={e => setFileKey(e.target.value)}
        placeholder="Enter Figma file key"
        style={{ padding: 8, width: 300 }}
      />
      <button onClick={fetchIndex} style={{ marginLeft: 8 }}>Index</button>

      <pre style={{ marginTop: 32, background: '#eee', padding: 16 }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
