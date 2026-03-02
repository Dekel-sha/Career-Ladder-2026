import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { 
  Check, 
  AlertCircle, 
  Upload,
  Loader2,
  Trash2,
  X,
  User,
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { WORK_TYPE_DB, WORK_TYPE_LABEL } from '../src/constants/workTypes';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabType = 'profile' | 'preferences';

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Initial form state
  const initialFormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Senior Product Designer',
    location: 'San Francisco, CA',
    profilePhoto: '',
  };

  const initialPreferences = {
    defaultWorkType: 'remote',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
  };
  
  // Form state
  const [formData, setFormData] = useState(initialFormData);
  const [preferences, setPreferences] = useState(initialPreferences);
  
  // Dirty state tracking
  const [isDirty, setIsDirty] = useState(false);

  const [validation, setValidation] = useState({
    email: true,
    phone: true,
  });

  // Check if form is dirty
  useEffect(() => {
    const profileDirty = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    const preferencesDirty = JSON.stringify(preferences) !== JSON.stringify(initialPreferences);
    setIsDirty(profileDirty || preferencesDirty);
  }, [formData, preferences]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(preferences.theme);
  }, [preferences.theme]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Email validation
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidation({ ...validation, email: emailRegex.test(value) });
    }
    
    // Phone validation
    if (field === 'phone') {
      const phoneRegex = /^\\+?[\\d\\s\\-\\(\\)]+$/;
      setValidation({ ...validation, phone: phoneRegex.test(value) });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    toast.success('Settings saved successfully ✅');
    setIsDirty(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset to initial values
    setFormData(initialFormData);
    setPreferences(initialPreferences);
    setIsDirty(false);
    onOpenChange(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File too large. Max size is 2MB.');
        return;
      }
      
      // Simulate upload
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, profilePhoto: reader.result as string });
        toast.success('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File too large. Max size is 2MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, profilePhoto: reader.result as string });
        toast.success('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeletePhoto = () => {
    setFormData({ ...formData, profilePhoto: '' });
    setShowDeleteDialog(false);
    toast.success('Photo removed');
  };

  const handleThemeToggle = (checked: boolean) => {
    setPreferences({ ...preferences, theme: checked ? 'dark' : 'light' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            {/* Profile Photo */}
            <div>
              <Label 
                className="text-[var(--primary-text-color)]"
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--text-sm)',
                  marginBottom: 'var(--space-8)',
                  display: 'block',
                }}
              >
                Profile Photo
              </Label>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-16)' }}>
                <Avatar style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                  {formData.profilePhoto ? (
                    <AvatarImage src={formData.profilePhoto} />
                  ) : (
                    <AvatarFallback 
                      style={{
                        background: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        fontFamily: 'var(--font-family-body)',
                      }}
                    >
                      {formData.firstName[0]}{formData.lastName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div
                    style={{
                      border: '2px dashed var(--border)',
                      borderRadius: 'var(--radius-unified)',
                      padding: 'var(--space-16)',
                      textAlign: 'center',
                      transition: 'all 150ms ease-in-out',
                      background: isDragging ? 'var(--vibe-hover-bg)' : 'transparent',
                      borderColor: isDragging ? 'var(--primary)' : 'var(--border)',
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload 
                      style={{
                        width: '24px',
                        height: '24px',
                        margin: '0 auto var(--space-8) auto',
                        color: 'var(--vibe-text-secondary)',
                      }}
                    />
                    <p 
                      className="text-[var(--primary-text-color)]"
                      style={{
                        fontFamily: 'var(--font-family-body)',
                        fontSize: 'var(--text-sm)',
                        marginBottom: 'var(--space-4)',
                      }}
                    >
                      <label 
                        htmlFor="photo-upload" 
                        style={{ 
                          color: 'var(--primary)', 
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Click to upload
                      </label>
                      {' '}or drag and drop
                    </p>
                    <p 
                      className="text-[var(--secondary-text-color)]"
                      style={{
                        fontFamily: 'var(--font-family-body)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      JPG, PNG or GIF · Max 2 MB
                    </p>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  
                  {formData.profilePhoto && (
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ 
                        marginTop: 'var(--space-8)',
                        gap: 'var(--space-8)',
                        color: 'var(--destructive)',
                      }}
                      onClick={handleDeletePhoto}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                      Delete Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* First Name & Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
              <div>
                <Label htmlFor="firstName" className="text-[var(--primary-text-color)]">First Name</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-[var(--primary-text-color)]">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-[var(--primary-text-color)]">Email</Label>
              <div style={{ position: 'relative' }}>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{
                    borderColor: !validation.email && formData.email ? 'var(--destructive)' : undefined,
                  }}
                />
                {validation.email && formData.email && (
                  <Check 
                    style={{
                      position: 'absolute',
                      right: 'var(--space-12)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '20px',
                      color: 'var(--color-success)',
                    }}
                  />
                )}
                {!validation.email && formData.email && (
                  <AlertCircle 
                    style={{
                      position: 'absolute',
                      right: 'var(--space-12)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '20px',
                      color: 'var(--destructive)',
                    }}
                  />
                )}
              </div>
              {!validation.email && formData.email && (
                <p 
                  style={{
                    fontFamily: 'var(--font-family-body)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--destructive)',
                    marginTop: 'var(--space-4)',
                  }}
                >
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-[var(--primary-text-color)]">Phone</Label>
              <div style={{ position: 'relative' }}>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{
                    borderColor: !validation.phone && formData.phone ? 'var(--destructive)' : undefined,
                  }}
                />
                {validation.phone && formData.phone && (
                  <Check 
                    style={{
                      position: 'absolute',
                      right: 'var(--space-12)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '20px',
                      color: 'var(--color-success)',
                    }}
                  />
                )}
              </div>
              {!validation.phone && formData.phone && (
                <p 
                  style={{
                    fontFamily: 'var(--font-family-body)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--destructive)',
                    marginTop: 'var(--space-4)',
                  }}
                >
                  Please enter a valid phone number
                </p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <Label htmlFor="jobTitle" className="text-[var(--primary-text-color)]">Job Title</Label>
              <Input 
                id="jobTitle" 
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-[var(--primary-text-color)]">Location</Label>
              <Input 
                id="location" 
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            {/* Default Work Type */}
            <div>
              <Label htmlFor="defaultWorkType" className="text-[var(--primary-text-color)]">Default Work Type</Label>
              <Select 
                value={preferences.defaultWorkType} 
                onValueChange={(value) => setPreferences({ ...preferences, defaultWorkType: value })}
              >
                <SelectTrigger id="defaultWorkType">
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  {WORK_TYPE_DB.map((type) => (
                    <SelectItem key={type} value={type}>
                      {WORK_TYPE_LABEL[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Format */}
            <div>
              <Label htmlFor="dateFormat" className="text-[var(--primary-text-color)]">Date Format</Label>
              <Select 
                value={preferences.dateFormat} 
                onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
              >
                <SelectTrigger id="dateFormat">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Theme */}
            <div>
              <Label className="text-[var(--primary-text-color)]">Theme</Label>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-12)',
                  borderRadius: 'var(--radius-unified)',
                  background: 'var(--vibe-surface-subtle)',
                  marginTop: 'var(--space-8)',
                }}
              >
                <span 
                  style={{
                    fontFamily: 'var(--font-family-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--primary-text-color)',
                  }}
                >
                  {preferences.theme === 'light' ? 'Light' : 'Dark'}
                </span>
                <Switch 
                  checked={preferences.theme === 'dark'}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className="settings-modal-content"
          style={{
            width: '720px',
            maxWidth: '90vw',
            height: '560px',
            maxHeight: '80vh',
            padding: '0',
            gap: '0',
            borderRadius: 'var(--radius-unified)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <DialogDescription style={{ display: 'none' }}>
            Manage your profile and preferences
          </DialogDescription>

          {/* Header */}
          <div 
            style={{
              padding: 'var(--space-16) var(--space-24)',
              paddingRight: '64px', // Make room for close button
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <DialogTitle 
              style={{
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: 'var(--primary-text-color)',
                margin: '0',
              }}
            >
              Settings
            </DialogTitle>
          </div>

          {/* Body - Two Column Layout */}
          <div 
            style={{
              display: 'flex',
              flex: '1',
              minHeight: '0',
              overflow: 'hidden',
            }}
          >
            {/* Left Sidebar */}
            <div 
              style={{
                width: '176px',
                flexShrink: 0,
                borderRight: '1px solid var(--border)',
                background: 'var(--vibe-surface-subtle)',
                padding: 'var(--space-16) var(--space-8)',
              }}
            >
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`settings-modal-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  autoFocus
                >
                  <User style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`settings-modal-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                >
                  <Settings style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  <span>Preferences</span>
                </button>
              </nav>
            </div>

            {/* Right Content Area */}
            <div 
              style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                minWidth: '0',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Content Header */}
              <div 
                style={{
                  padding: 'var(--space-24) var(--space-24) var(--space-16) var(--space-24)',
                  flexShrink: 0,
                }}
              >
                <h3 
                  style={{
                    fontFamily: 'var(--font-family-body)',
                    fontSize: 'var(--text-base)',
                    fontWeight: '600',
                    color: 'var(--primary-text-color)',
                    margin: '0',
                  }}
                >
                  {activeTab === 'profile' ? 'Profile' : 'Preferences'}
                </h3>
              </div>

              {/* Scrollable Content */}
              <div 
                style={{
                  flex: '1',
                  overflowY: 'auto',
                  padding: '0 var(--space-24) var(--space-24) var(--space-24)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'var(--border) transparent',
                }}
                className="custom-scrollbar"
              >
                {renderContent()}
              </div>

              {/* Conditional Footer with Animation */}
              {isDirty && (
                <div 
                  style={{
                    padding: 'var(--space-16) var(--space-24)',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 'var(--space-12)',
                    flexShrink: 0,
                    background: 'var(--background)',
                    animation: 'slideUp 200ms ease-out',
                  }}
                >
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isSaving}
                    style={{
                      fontFamily: 'var(--font-family-body)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    style={{
                      fontFamily: 'var(--font-family-body)',
                      fontSize: 'var(--text-sm)',
                      gap: 'var(--space-8)',
                    }}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Photo Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your profile photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePhoto} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add styles for footer animation, navigation, and close button */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 5px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--vibe-neutral-500);
        }
        
        .settings-modal-nav-item {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          gap: var(--space-8);
          padding: 0 var(--space-16);
          border-radius: var(--radius-unified);
          transition: background-color 150ms ease-in-out;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--secondary-text-color);
          font-family: 'Figtree', sans-serif;
          font-size: var(--text-sm);
          font-weight: 400;
          line-height: 1.5;
          text-align: left;
          outline: none;
        }

        .settings-modal-nav-item:hover {
          background: var(--vibe-hover-bg);
          color: var(--primary-text-color);
        }

        .settings-modal-nav-item.active {
          background: var(--vibe-day-hover);
          color: var(--primary-text-color);
        }
        
        .settings-modal-nav-item:focus-visible {
          outline: none;
          box-shadow: none;
        }
        
        /* Style the built-in DialogContent close button */
        .settings-modal-content [data-slot="dialog-close"] {
          position: absolute;
          top: var(--space-16);
          right: var(--space-24);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: var(--radius-unified);
          cursor: pointer;
          color: var(--vibe-text-secondary);
          transition: all 150ms ease-in-out;
          opacity: 1;
          padding: 0;
        }
        
        .settings-modal-content [data-slot="dialog-close"]:hover {
          background: var(--vibe-hover-bg);
          opacity: 1;
        }
        
        .settings-modal-content [data-slot="dialog-close"]:focus-visible {
          outline: 2px solid var(--ring);
          outline-offset: 2px;
        }
        
        .settings-modal-content [data-slot="dialog-close"] svg {
          width: 16px;
          height: 16px;
        }
      `}</style>
    </>
  );
}
