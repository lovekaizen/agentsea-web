import { ImageResponse } from 'next/og';

// Generated at build time (required for `output: 'export'`).
export const dynamic = 'force-static';

export const alt = 'AgentSea — agentic AI for TypeScript and Elixir';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #0b0f1a 0%, #1b1140 48%, #0b0f1a 100%)',
          color: 'white',
          padding: '90px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: '-2px' }}>
          AgentSea
        </div>
        <div style={{ fontSize: 42, marginTop: 14, color: '#c4b5fd' }}>
          Unite and orchestrate AI agents
        </div>
        <div style={{ fontSize: 30, marginTop: 34, color: '#cbd5e1' }}>
          Agentic AI for TypeScript / Node — and natively for Elixir / OTP
        </div>
        <div style={{ display: 'flex', marginTop: 44 }}>
          {['14 libraries on Hex', 'MCP', 'Streaming', 'Multi-agent'].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  fontSize: 26,
                  color: '#e9d5ff',
                  border: '2px solid #7c3aed',
                  borderRadius: '9999px',
                  padding: '10px 26px',
                  marginRight: '18px',
                }}
              >
                {label}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
