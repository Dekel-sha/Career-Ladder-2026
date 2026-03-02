import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Button } from '../../components/ui/button';

export function ConnectivityCheck() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [companyCount, setCompanyCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [addingCompany, setAddingCompany] = useState(false);

  const fetchData = async () => {
    setStatus('loading');
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        setStatus('error');
        setErrorMessage('Not authenticated');
        return;
      }

      setUserEmail(userData.user.email || 'Unknown');

      // Get company count
      const { count, error } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });

      if (error) {
        setStatus('error');
        setErrorMessage(error.message);
      } else {
        setStatus('connected');
        setCompanyCount(count || 0);
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleAddTestCompany = async () => {
    setAddingCompany(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes?.user;

      if (!user) {
        toast.error("No logged-in user found");
        return;
      }

      const { error } = await supabase.from("companies").insert([
        {
          name: `Test Company ${Math.floor(Math.random() * 1000)}`,
          created_by: user.id,
        },
      ]);

      if (error) throw error;
      toast.success("✅ Test company added!");
      // Refresh the count
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add company");
    } finally {
      setAddingCompany(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '14px',
        fontFamily: 'var(--font-family-body)',
        fontWeight: '500',
        backgroundColor: status === 'connected' 
          ? '#E8F5E9' 
          : status === 'error' 
          ? '#FFEBEE' 
          : '#F5F5F5',
        color: status === 'connected'
          ? '#2E7D32'
          : status === 'error'
          ? '#C62828'
          : 'var(--vibe-text-secondary)',
        border: '1px solid',
        borderColor: status === 'connected'
          ? '#A5D6A7'
          : status === 'error'
          ? '#EF9A9A'
          : '#E0E0E0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        {status === 'loading' && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Checking Supabase connection...</span>
          </>
        )}
        
        {status === 'connected' && (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>✅ Connected as {userEmail} (companies={companyCount})</span>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="h-4 w-4" />
            <span>❌ Supabase error: {errorMessage}</span>
          </>
        )}
      </div>

      {status === 'connected' && (
        <Button
          onClick={handleAddTestCompany}
          disabled={addingCompany}
          size="sm"
          style={{
            fontSize: '12px',
            padding: '4px 12px',
            height: 'auto',
            backgroundColor: '#2E7D32',
            color: 'white',
          }}
        >
          <Plus className="h-3 w-3 mr-1" />
          {addingCompany ? 'Adding...' : 'Add Test Company'}
        </Button>
      )}
    </div>
  );
}
