import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { getErrorMessage, isNetworkError } from '../lib/supabaseHelper';
import { toast } from 'sonner@2.0.3';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import placeholderAnimation from "../assets/placeholder-lottie";

// Images
import step1Image from "@/assets/login-visual.svg";

// Using Step 1 image for all steps as per request
const step2Image = step1Image;
const step3Image = step1Image;
const step4Image = step1Image;
const loginImage = step1Image;

interface LoginScreenProps {
  onAuthSuccess: () => void;
}

const CAREER_PATHS = [
  'Design',
  'Development',
  'Product',
  'Marketing',
  'Data',
  'Management',
  'Sales',
];

const JOBS_BY_PATH: Record<string, string[]> = {
  'Design': ['UI UX Designer', 'Visual Designer', 'Graphic Designer', 'Product Designer', 'Motion Designer'],
  'Development': ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Mobile Developer'],
  'Product': ['Product Manager', 'Product Owner', 'Associate PM', 'Group PM', 'Head of Product'],
  'Marketing': ['Digital Marketer', 'Content Strategist', 'SEO Specialist', 'Social Media Manager', 'Growth Marketer'],
  'Data': ['Data Scientist', 'Data Analyst', 'Data Engineer', 'Analytics Engineer', 'ML Engineer'],
  'Management': ['Engineering Manager', 'Design Manager', 'Product Lead', 'Team Lead', 'Director'],
  'Sales': ['Account Executive', 'Sales Development Rep', 'Customer Success', 'Sales Manager', 'Solutions Engineer'],
};

// Reusable Pill Component
const Pill = ({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      px-4 py-2 rounded-full border transition-all duration-200 text-[14px] font-['Figtree'] font-medium
      ${selected 
        ? 'bg-[#0073ea] border-[#0073ea] text-white shadow-sm' 
        : 'bg-white border-[#d0d4da] text-[#1f1f1f] hover:border-[#8c8f96] hover:bg-[#f6f8fa]'
      }
    `}
  >
    {label}
  </button>
);

// Reusable Layout for Left Side
const LeftSideLayout = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
   <div className={`flex w-full flex-col justify-center px-8 lg:w-1/2 h-full ${className}`}>
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6">
        {children}
      </div>
   </div>
);

export function LoginScreen({ onAuthSuccess }: LoginScreenProps) {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  // Helpers
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (pass: string) => pass.length >= 8;

  // Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Google login error:', error);
        
        // Check if Google provider is not enabled
        if (error.message?.includes('provider') || error.message?.includes('not enabled')) {
          toast.error('Google login is not configured. Please use email/password or contact support.');
        } else {
          toast.error(`Google login failed: ${getErrorMessage(error)}`);
        }
      }
      // Note: The user will be redirected to Google, then back to the app
      // The session will be automatically handled by Supabase
    } catch (err) {
      console.error('Google login exception:', err);
      const errString = String(err);
      
      // Check for provider not enabled error
      if (errString.includes('provider') || errString.includes('not enabled')) {
        toast.error('Google login is not configured. Please use email/password or contact support.');
      } else {
        toast.error('Unable to connect to Google. Please try again.');
      }
    }
  };

  // Determine current image
  const getCurrentImage = () => {
    if (isLoginMode) return loginImage;
    switch (step) {
      case 2: return step2Image;
      case 3: return step3Image;
      case 4: return step4Image;
      default: return step1Image;
    }
  };

  const handleNext = () => {
    if (step === 4) {
      handleFinalSubmit();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (isNetworkError(error)) {
          toast.error('Unable to connect. Please check your internet connection.');
        } else {
          toast.error(`Login failed: ${getErrorMessage(error)}`);
        }
      } else {
        toast.success('Welcome to Career Ladder!');
        onAuthSuccess();
      }
    } catch (err) {
      // Silently handle network errors
      const errString = String(err);
      if (!errString.includes('Failed to fetch')) {
        console.error('Login exception:', err);
      }
      if (isNetworkError(err)) {
        toast.error('Unable to connect. Please check your internet connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      // Signup flow
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
            username: fullName.split(' ')[0] || email.split('@')[0],
            data: {
              full_name: fullName,
              career_paths: selectedPaths,
              interested_jobs: selectedJobs
            }
          }),
        }
      );

      const result = await response.json();

      const isEmailExists = 
          result.error?.code === 'email_exists' || 
          result.code === 'email_exists' ||
          (typeof result.error === 'string' && result.error.includes('already registered')) ||
          (typeof result.error === 'object' && result.error?.msg?.includes('already registered'));

      if (!response.ok || result.error) {
        // If user already exists, try logging in (don't log as error)
        if (isEmailExists) {
           toast.info('Account already exists. Logging you in...');
        } else {
           // Only log actual errors (not "email exists" which is expected)
           console.error('Signup error:', result.error);
           
           const errorMessage = typeof result.error === 'string' 
             ? result.error 
             : result.error?.message || JSON.stringify(result.error);
             
           toast.error(`Signup failed: ${errorMessage}`);
           setLoading(false);
           return;
        }
      }

      // Sign in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If account exists but password is wrong, give clearer message and redirect to login
        if (isEmailExists) {
          toast.error('Account exists with a different password. Please use the login page with your original password.');
          // Reset to login mode so user can try with correct password
          setTimeout(() => {
            setIsLoginMode(true);
            setStep(1);
            setPassword(''); // Clear the wrong password
          }, 2000);
        } else {
          toast.error(`Login failed: ${getErrorMessage(error)}`);
        }
      } else {
        toast.success('Welcome to Career Ladder!');
        onAuthSuccess();
      }
    } catch (err) {
      console.error('Auth exception:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Side */}
      
      {isLoginMode ? (
        // LOGIN MODE
        <LeftSideLayout>
            <div className="flex flex-col items-center gap-6 text-center">
              <h1 className="font-['Poppins'] text-[24px] font-medium leading-[32px] text-[#1f1f1f]">
                Career Ladder
              </h1>
              <p className="font-['Figtree'] text-[16px] text-[#6b6f76]">
                Log in to your account
              </p>
            </div>

            <div className="flex flex-col gap-4">
               <Button 
                  variant="outline" 
                  className="w-full h-[44px] gap-2 font-['Figtree'] text-[#1f1f1f] border-[#d0d4da]"
                  onClick={handleGoogleLogin}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-[#E6E8EB]"></div>
                  <span className="flex-shrink-0 mx-4 text-[#8C8F96] text-sm font-['Figtree']">Or</span>
                  <div className="flex-grow border-t border-[#E6E8EB]"></div>
                </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="login-email" className="font-['Figtree'] text-[12px] font-medium text-[#676879]">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-[44px] rounded-[8px] font-['Figtree']"
                />
              </div>

              <div className="flex flex-col gap-2">
                  <Label htmlFor="login-password" className="font-['Figtree'] text-[12px] font-medium text-[#676879]">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-[44px] rounded-[8px] font-['Figtree']"
                  />
              </div>

              <Button 
                onClick={() => handleLogin()}
                disabled={loading || !email || !password}
                className="h-[44px] w-full rounded-[8px] bg-[#0073ea] hover:bg-[#0060c2] text-white font-['Figtree'] font-medium"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </Button>
            </div>

            <div className="text-center mt-2">
                 <span className="text-[#6b6f76] text-[14px] font-['Figtree']">
                    Don't have an account?{' '}
                 </span>
                 <button 
                   onClick={() => setIsLoginMode(false)}
                   className="text-[#6b6f76] text-[14px] hover:text-[#1f1f1f] font-['Figtree'] underline"
                 >
                    Sign up
                 </button>
            </div>
        </LeftSideLayout>
      ) : (
        // ONBOARDING STEPS
        <LeftSideLayout>
          {/* Step 1: Welcome */}
          {step === 1 && (
            <>
              <div className="flex flex-col items-center gap-2 text-center">
                
                <h1 className="font-['Poppins'] text-[24px] font-medium leading-[32px] text-[#1f1f1f]">
                  Welcome to Career Ladder
                </h1>
                <p className="font-['Figtree'] text-[16px] text-[#6b6f76]">
                  Step into your next career opportunity
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  variant="outline" 
                  className="w-full h-[44px] gap-2 font-['Figtree'] text-[#1f1f1f] border-[#d0d4da]"
                  onClick={handleGoogleLogin}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-[#E6E8EB]"></div>
                  <span className="flex-shrink-0 mx-4 text-[#8C8F96] text-sm font-['Figtree']">Or</span>
                  <div className="flex-grow border-t border-[#E6E8EB]"></div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="font-['Figtree'] text-[12px] font-medium text-[#676879]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-[44px] rounded-[8px] font-['Figtree']"
                  />
                </div>

                <Button 
                  onClick={handleNext}
                  disabled={!isValidEmail(email)}
                  className="h-[44px] w-full rounded-[8px] bg-[#0073ea] hover:bg-[#0060c2] text-white font-['Figtree'] font-medium"
                >
                  Continue
                </Button>
              </div>

              <div className="text-center mt-2">
                 <span className="text-[#6b6f76] text-[14px] font-['Figtree']">
                    Already have an account?{' '}
                 </span>
                 <button 
                   onClick={() => setIsLoginMode(true)}
                   className="text-[#6b6f76] text-[14px] hover:text-[#1f1f1f] font-['Figtree'] underline"
                 >
                    Log in
                 </button>
              </div>
            </>
          )}

          {/* Step 2: Create Account */}
          {step === 2 && (
            <>
               <div className="flex flex-col gap-6 mb-4">
                <h1 className="font-['Poppins'] text-[24px] font-medium leading-[32px] text-[#1f1f1f]">
                  Create your account
                </h1>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fullname" className="font-['Figtree'] text-[12px] font-medium text-[#676879]">
                    Full Name
                  </Label>
                  <Input
                    id="fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="h-[44px] rounded-[8px] font-['Figtree']"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="font-['Figtree'] text-[12px] font-medium text-[#676879]">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-[44px] rounded-[8px] font-['Figtree']"
                  />
                  <span className="text-[12px] text-[#8C8F96]">Must be at least 8 characters</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-12">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  className="text-[#6b6f76] hover:text-[#1f1f1f] hover:bg-transparent px-0 gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </Button>

                <Button 
                  onClick={handleNext}
                  disabled={!fullName || !isValidPassword(password)}
                  className="h-[44px] rounded-[8px] bg-[#0073ea] hover:bg-[#0060c2] text-white font-['Figtree'] font-medium px-8"
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Career Path */}
          {step === 3 && (
             <>
               <div className="flex flex-col gap-6 mb-4">
                <h1 className="font-['Poppins'] text-[24px] font-medium leading-[32px] text-[#1f1f1f]">
                  What career path are you on?
                </h1>
              </div>

              <div className="flex flex-wrap gap-2">
                {CAREER_PATHS.map(path => (
                  <Pill 
                    key={path} 
                    label={path} 
                    selected={selectedPaths.includes(path)} 
                    onClick={() => toggleSelection(path, selectedPaths, setSelectedPaths)} 
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-12">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  className="text-[#6b6f76] hover:text-[#1f1f1f] hover:bg-transparent px-0 gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </Button>

                <Button 
                  onClick={handleNext}
                  disabled={selectedPaths.length === 0}
                  className="h-[44px] rounded-[8px] bg-[#0073ea] hover:bg-[#0060c2] text-white font-['Figtree'] font-medium px-8"
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {/* Step 4: Jobs */}
          {step === 4 && (
             <>
               <div className="flex flex-col gap-6 mb-4">
                <h1 className="font-['Poppins'] text-[24px] font-medium leading-[32px] text-[#1f1f1f]">
                  What jobs interest you?
                </h1>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedPaths.flatMap(path => JOBS_BY_PATH[path] || []).map((job, index) => (
                  <Pill 
                    key={`${job}-${index}`} 
                    label={job} 
                    selected={selectedJobs.includes(job)} 
                    onClick={() => toggleSelection(job, selectedJobs, setSelectedJobs)} 
                  />
                ))}
                {selectedPaths.length === 0 && (
                   <p className="text-[#6b6f76] text-sm">Please select a career path in the previous step.</p>
                )}
              </div>

              <div className="flex items-center justify-between mt-12">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  className="text-[#6b6f76] hover:text-[#1f1f1f] hover:bg-transparent px-0 gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </Button>

                <Button 
                  onClick={handleNext}
                  disabled={selectedJobs.length === 0 || loading}
                  className="h-[44px] rounded-[8px] bg-[#0073ea] hover:bg-[#0060c2] text-white font-['Figtree'] font-medium px-8"
                >
                  {loading ? 'Creating Account...' : 'Continue'}
                </Button>
              </div>
            </>
          )}
        </LeftSideLayout>
      )}

      {/* Right Side - Image */}
      <div className="hidden w-1/2 lg:block relative h-full">
        <img 
          src={getCurrentImage()} 
          alt="Visual" 
          className="h-full w-full object-cover block"
        />
      </div>
    </div>
  );
}