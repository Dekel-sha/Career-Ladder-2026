import { useState } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

export function DiagnosticPanel() {
  const [showPanel, setShowPanel] = useState(false);
  const [testResults, setTestResults] = useState<{
    health?: { status: string; time: number };
    auth?: { status: string; time: number; error?: string };
    database?: { status: string; time: number; error?: string };
  }>({});
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const results: typeof testResults = {};

    // Test 1: Health endpoint
    try {
      const start = Date.now();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b47aab4/health`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const time = Date.now() - start;
      
      if (response.ok) {
        results.health = { status: 'ok', time };
      } else {
        results.health = { status: 'error', time };
      }
    } catch (err) {
      results.health = { status: 'error', time: 0 };
    }

    // Test 2: Auth endpoint
    try {
      const start = Date.now();
      const response = await fetch(
        `https://${projectId}.supabase.co/auth/v1/health`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const time = Date.now() - start;
      
      if (response.ok) {
        results.auth = { status: 'ok', time };
      } else {
        const errorText = await response.text();
        results.auth = { status: 'error', time, error: errorText };
      }
    } catch (err) {
      results.auth = { 
        status: 'error', 
        time: 0, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }

    // Test 3: Database endpoint
    try {
      const start = Date.now();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b47aab4/init-db`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const time = Date.now() - start;
      
      if (response.ok) {
        const data = await response.json();
        results.database = { status: data.status || 'ok', time };
      } else {
        const errorText = await response.text();
        results.database = { status: 'error', time, error: errorText };
      }
    } catch (err) {
      results.database = { 
        status: 'error', 
        time: 0, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }

    setTestResults(results);
    setTesting(false);
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          padding: '8px 16px',
          backgroundColor: 'var(--vibe-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'var(--font-family-body)',
          fontSize: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        🔧 Diagnostics
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        width: '400px',
        maxHeight: '80vh',
        overflow: 'auto',
        backgroundColor: 'var(--vibe-card-bg)',
        border: '1px solid var(--vibe-border-color)',
        borderRadius: 'var(--vibe-border-radius-lg)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        padding: '16px',
        fontFamily: 'var(--font-family-body)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-family-heading)', color: 'var(--vibe-text-primary)' }}>
          System Diagnostics
        </h3>
        <button
          onClick={() => setShowPanel(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            color: 'var(--vibe-text-secondary)',
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'var(--vibe-text-secondary)', marginBottom: '8px' }}>
          <strong>Project ID:</strong> {projectId}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--vibe-text-secondary)', marginBottom: '8px' }}>
          <strong>API Key:</strong> {publicAnonKey.substring(0, 20)}...
        </div>
        <div style={{ fontSize: '12px', color: 'var(--vibe-text-secondary)', marginBottom: '8px' }}>
          <strong>Base URL:</strong> https://{projectId}.supabase.co
        </div>
      </div>

      <button
        onClick={runDiagnostics}
        disabled={testing}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'var(--vibe-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: testing ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-family-body)',
          marginBottom: '16px',
          opacity: testing ? 0.6 : 1,
        }}
      >
        {testing ? 'Running Tests...' : 'Run Diagnostics'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div>
          <h4 style={{ fontSize: '14px', marginBottom: '12px', fontFamily: 'var(--font-family-heading)' }}>
            Test Results
          </h4>

          {testResults.health && (
            <TestResult
              name="Health Check"
              status={testResults.health.status}
              time={testResults.health.time}
            />
          )}

          {testResults.auth && (
            <TestResult
              name="Auth Service"
              status={testResults.auth.status}
              time={testResults.auth.time}
              error={testResults.auth.error}
            />
          )}

          {testResults.database && (
            <TestResult
              name="Database"
              status={testResults.database.status}
              time={testResults.database.time}
              error={testResults.database.error}
            />
          )}
        </div>
      )}

      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#FFF9E6', borderRadius: '6px', fontSize: '11px' }}>
        <div style={{ fontWeight: '600', marginBottom: '8px', color: '#B7791F' }}>
          💡 Common Issues
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#B7791F', lineHeight: '1.6' }}>
          <li>Supabase project is paused (reactivate in dashboard)</li>
          <li>Network/firewall blocking requests</li>
          <li>CORS issues (check browser console)</li>
          <li>Invalid API keys or project ID</li>
        </ul>
      </div>
    </div>
  );
}

function TestResult({ 
  name, 
  status, 
  time, 
  error 
}: { 
  name: string; 
  status: string; 
  time: number; 
  error?: string;
}) {
  const isOk = status === 'ok';
  
  return (
    <div
      style={{
        padding: '12px',
        marginBottom: '8px',
        backgroundColor: isOk ? '#E8F5E9' : '#FFEBEE',
        border: `1px solid ${isOk ? '#A5D6A7' : '#EF9A9A'}`,
        borderRadius: '6px',
        fontSize: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontWeight: '600', color: isOk ? '#2E7D32' : '#C62828' }}>
          {isOk ? '✓' : '���'} {name}
        </span>
        <span style={{ color: 'var(--vibe-text-secondary)' }}>
          {time}ms
        </span>
      </div>
      {error && (
        <div style={{ fontSize: '11px', color: '#C62828', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
