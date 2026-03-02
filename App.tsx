import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AllApplications } from './components/AllApplications';
import { Analytics } from './components/Analytics';
import { SettingsModal } from './components/SettingsModal';
import { AddApplicationModal } from './components/AddApplicationModal';
import { Toaster } from './components/ui/sonner';
import { JobDrawerProvider } from './components/JobDrawerProvider';
import { LoginScreen } from './src/components/LoginScreen';
import { supabase } from './src/lib/supabase';
import type { Session } from '@supabase/supabase-js';

type Page = 'dashboard' | 'applications' | 'analytics';

// Suppress unhandled fetch errors globally
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const errorString = args.join(' ');
    // Suppress "Failed to fetch" and related Supabase auth errors
    if (
      errorString.includes('Failed to fetch') ||
      errorString.includes('AuthRetryableFetchError') ||
      errorString.includes('Auth exception: TypeError')
    ) {
      return; // Silently ignore
    }
    originalConsoleError.apply(console, args);
  };
}

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          // Silently handle network errors - don't log to console
          const errorMessage = error.message || '';
          const errorName = error.name || '';
          if (
            !errorMessage.includes('Failed to fetch') && 
            !errorName.includes('AuthRetryableFetchError')
          ) {
            console.error('Error getting session:', error);
          }
        }
        setSession(session);
        setLoading(false);
      })
      .catch((err) => {
        // Silently handle network exceptions - don't log to console
        const errString = String(err);
        if (!errString.includes('Failed to fetch')) {
          console.error('Exception getting session:', err);
        }
        // Set loading to false so the app can still render
        setLoading(false);
      });

    // Listen for auth state changes (including OAuth redirects)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // If we just authenticated (e.g., from Google redirect), hide loading
      if (session && loading) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNewApplication={() => setIsAddModalOpen(true)} />;
      case 'applications':
        return <AllApplications />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard onNewApplication={() => setIsAddModalOpen(true)} />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div style={{ fontFamily: 'var(--font-family-body)', color: 'var(--vibe-text-secondary)' }}>
          Loading...
        </div>
      </div>
    );
  }

  // Show auth card if not authenticated
  if (!session) {
    return (
      <>
        <LoginScreen onAuthSuccess={() => {}} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Show authenticated app
  return (
    <JobDrawerProvider>
      <div className="min-h-screen bg-background">
        {/* Fixed Sidebar */}
        <Sidebar 
          activePage={activePage} 
          onNavigate={setActivePage}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={setIsSidebarCollapsed}
          onNewApplication={() => setIsAddModalOpen(true)}
        />
        
        {/* Main Content Area */}
        <div 
          className="transition-all duration-300"
          style={{
            marginLeft: isSidebarCollapsed ? '72px' : '256px',
          }}
        >
          {/* Top Header */}
          <Header 
            onNavigate={setActivePage}
            onLogout={() => {
              supabase.auth.signOut();
            }}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />
          
          {/* Page Content */}
          <main className="min-h-[calc(100vh-64px)] bg-background">
            {renderPage()}
          </main>
        </div>
        
        {/* Add Application Modal */}
        <AddApplicationModal 
          open={isAddModalOpen} 
          onOpenChange={setIsAddModalOpen} 
        />

        {/* Settings Modal */}
        <SettingsModal 
          open={isSettingsModalOpen} 
          onOpenChange={setIsSettingsModalOpen} 
        />
        
        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </JobDrawerProvider>
  );
}