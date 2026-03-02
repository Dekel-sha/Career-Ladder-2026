import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { testSupabaseConnection, getErrorMessage, isNetworkError } from '../lib/supabaseHelper';
import { toast } from 'sonner@2.0.3';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { DiagnosticPanel } from './DiagnosticPanel';

interface AuthCardProps {
  onAuthSuccess: () => void;
}

export function AuthCard({ onAuthSuccess }: AuthCardProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    // Test Supabase connection
    const checkConnection = async () => {
      try {
        // Try to reach the health endpoint
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-9b47aab4/health`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (response.ok) {
          setConnectionStatus('ok');
          setErrorDetails('');
        } else {
          setConnectionStatus('error');
          setErrorDetails(`Server returned status ${response.status}`);
        }
      } catch (err) {
        setConnectionStatus('error');
        setErrorDetails('Unable to reach authentication server');
        console.error('Connection check failed:', err);
      }
    };
    
    checkConnection();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting signup with email:', email);
      
      // Use server-side signup endpoint to avoid schema issues
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b47aab4/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            password,
            username: username || email.split('@')[0],
          }),
        }
      );

      const result = await response.json();
      console.log('Signup response:', result);

      if (!response.ok || result.error) {
        console.error('Signup error:', result.error);
        
        // Handle email already exists error
        if (result.error?.code === 'email_exists') {
          toast.error('This email is already registered. Please sign in instead.');
          // Optional: Switch to login mode automatically
          // setMode('login'); 
        } else {
          toast.error(`Signup failed: ${result.error?.message || result.error || 'Unknown error'}`);
        }
      } else {
        // Now sign in the user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Auto-login error:', error);
          toast.error('Account created but login failed. Please try logging in manually.');
        } else {
          toast.success('Account created successfully!');
          onAuthSuccess();
        }
      }
    } catch (err) {
      console.error('Signup exception:', err);
      
      if (err instanceof Error && isNetworkError(err)) {
        toast.error('Network error: Unable to reach the server. Please check your internet connection.');
      } else {
        toast.error(`Signup error: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { data, error });

      if (error) {
        console.error('Login error:', error);
        
        // Handle specific error types
        if (isNetworkError(error)) {
          toast.error('Unable to connect to authentication service. Please check your internet connection and try again.');
        } else {
          toast.error(`Login failed: ${getErrorMessage(error)}`);
        }
      } else {
        toast.success('Logged in successfully!');
        onAuthSuccess();
      }
    } catch (err) {
      console.error('Login exception:', err);
      
      // Handle network errors
      if (err instanceof Error && isNetworkError(err)) {
        toast.error('Network error: Unable to reach the server. Please check your internet connection.');
      } else {
        toast.error(`Login error: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          maxWidth: '420px',
          margin: '80px auto',
          padding: '32px',
          backgroundColor: 'var(--vibe-card-bg)',
          borderRadius: 'var(--vibe-border-radius-lg)',
          border: '1px solid var(--vibe-border-color)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-family-heading)',
              color: 'var(--vibe-text-primary)',
              marginBottom: '8px',
            }}
          >
            Career Ladder
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-family-body)',
              color: 'var(--vibe-text-secondary)',
              fontSize: '14px',
            }}
          >
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
          
          {/* Connection Status */}
          {connectionStatus === 'error' && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#FFEBEE',
                border: '1px solid #EF9A9A',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'var(--font-family-body)',
                color: '#C62828',
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                ⚠️ Connection Error
              </div>
              <div style={{ marginBottom: '8px' }}>
                {errorDetails}
              </div>
              <details style={{ marginTop: '8px', cursor: 'pointer' }}>
                <summary style={{ fontWeight: '500' }}>Troubleshooting</summary>
                <ul style={{ marginTop: '8px', marginLeft: '16px', fontSize: '11px', lineHeight: '1.6' }}>
                  <li>Check your internet connection</li>
                  <li>Make sure the Supabase project is active</li>
                  <li>Verify the project URL: https://cxfskjggqtqmsmlowkaq.supabase.co</li>
                  <li>Check browser console for detailed errors</li>
                  <li>Try disabling ad blockers or VPN</li>
                </ul>
              </details>
            </div>
          )}
          {connectionStatus === 'ok' && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: '#E8F5E9',
                border: '1px solid #A5D6A7',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'var(--font-family-body)',
                color: '#2E7D32',
              }}
            >
              ✓ Connected to Supabase
            </div>
          )}
          {connectionStatus === 'checking' && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: '#E3F2FD',
                border: '1px solid #90CAF9',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'var(--font-family-body)',
                color: '#1565C0',
              }}
            >
              🔄 Checking connection...
            </div>
          )}
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'signup' && (
              <div>
                <Label htmlFor="username">Username (optional)</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontFamily: 'var(--font-family-body)',
            fontSize: '14px',
            color: 'var(--vibe-text-secondary)',
          }}
        >
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                style={{
                  color: 'var(--vibe-primary)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                  fontFamily: 'var(--font-family-body)',
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  color: 'var(--vibe-primary)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                  fontFamily: 'var(--font-family-body)',
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Diagnostic Panel */}
      <DiagnosticPanel />
    </>
  );
}