import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Check, 
  AlertCircle, 
  Upload,
  Loader2,
  Sun,
  Moon,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { WORK_TYPE_DB, WORK_TYPE_LABEL } from '../src/constants/workTypes';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Senior Product Designer',
    location: 'San Francisco, CA',
    profilePhoto: '',
  });

  const [preferences, setPreferences] = useState({
    defaultWorkType: 'remote',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    emailFollowups: true,
    inAppAlerts: true,
    inAppStatusChanges: true,
    remindersUpcoming: true,
  });

  const [validation, setValidation] = useState({
    email: true,
    phone: true,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Email validation
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidation({ ...validation, email: emailRegex.test(value) });
    }
    
    // Phone validation
    if (field === 'phone') {
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      setValidation({ ...validation, phone: phoneRegex.test(value) });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    toast.success('Settings saved successfully ✅');
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
    setIsDarkMode(checked);
    setPreferences({ ...preferences, theme: checked ? 'dark' : 'light' });
    toast.success(`Switched to ${checked ? 'dark' : 'light'} mode`);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1440px] mx-auto w-full" id="Settings-Main">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1>Settings</h1>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      {/* Error Banner */}
      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load settings. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" id="Settings-Tabs">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent sticky top-0 z-10 bg-background">
          <TabsTrigger 
            value="profile" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-[#E3F0FF] gap-2 px-6 py-3"
          >
            <User className="w-4 h-4" />
            Profile Settings
          </TabsTrigger>
          <TabsTrigger 
            value="preferences"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-[#E3F0FF] gap-2 px-6 py-3"
          >
            <SettingsIcon className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-[#E3F0FF] gap-2 px-6 py-3"
          >
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6 mt-6 animate-in fade-in duration-200" id="Settings-Profile">
          {/* Personal Info */}
          <Card className="rounded-lg shadow-sm">
            <CardContent className="p-6 space-y-6">
              <h3>Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={!validation.email ? 'border-destructive' : ''}
                  />
                  {validation.email && formData.email && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#28A745]" />
                  )}
                  {!validation.email && formData.email && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                  )}
                </div>
                {!validation.email && formData.email && (
                  <p className="text-xs text-destructive">Please enter a valid email address</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={!validation.phone ? 'border-destructive' : ''}
                  />
                  {validation.phone && formData.phone && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#28A745]" />
                  )}
                </div>
                {!validation.phone && formData.phone && (
                  <p className="text-xs text-destructive">Please enter a valid phone number</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Info */}
          <Card className="rounded-lg shadow-sm bg-[#F9FAFB]">
            <CardContent className="p-6 space-y-6">
              <h3>Job Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Title / Role</Label>
                <Input 
                  id="jobTitle" 
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile Photo */}
          <Card className="rounded-lg shadow-sm">
            <CardContent className="p-6 space-y-6">
              <h3>Profile Photo</h3>
              
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  {formData.profilePhoto ? (
                    <AvatarImage src={formData.profilePhoto} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-1">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging 
                        ? 'border-primary bg-primary/5' 
                        : 'border-[#DADCE0] hover:border-primary hover:bg-accent/5'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="mb-1">
                      <label htmlFor="photo-upload" className="text-primary cursor-pointer hover:underline">
                        Click to upload
                      </label>
                      {' '}or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF · Max 2 MB</p>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  
                  {formData.profilePhoto && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 gap-2 text-destructive hover:text-destructive"
                      onClick={handleDeletePhoto}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Photo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Save Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="gap-2"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6 mt-6 animate-in fade-in duration-200" id="Settings-Preferences">
          {/* Application Preferences */}
          <Card className="rounded-lg shadow-sm bg-[#F9FAFB]">
            <CardContent className="p-6 space-y-6">
              <h3>Application Preferences</h3>
              
              <div className="space-y-2">
                <Label htmlFor="defaultWorkType">Default Work Type</Label>
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

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
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
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Theme / Dark Mode */}
          <Card className="rounded-lg shadow-sm" id="Settings-DarkMode">
            <CardContent className="p-6 space-y-6">
              <h3>Appearance</h3>
              
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div className="flex-1">
                  <Label className="cursor-pointer">Default Theme</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Switch between light and dark mode
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sun className="w-4 h-4" />
                    <span className="text-sm">Light</span>
                  </div>
                  <Switch 
                    checked={isDarkMode}
                    onCheckedChange={handleThemeToggle}
                  />
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Moon className="w-4 h-4" />
                    <span className="text-sm">Dark</span>
                  </div>
                </div>
              </div>

              {/* Theme Preview */}
              <div className="border rounded-lg overflow-hidden">
                <div className={`p-6 transition-colors duration-300 ${
                  isDarkMode ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A]'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${
                        isDarkMode ? 'bg-[#2D2D2D]' : 'bg-[#F9FAFB]'
                      }`}></div>
                      <div className="flex-1 space-y-2">
                        <div className={`h-3 rounded ${
                          isDarkMode ? 'bg-[#3D3D3D]' : 'bg-[#E6E6E6]'
                        } w-3/4`}></div>
                        <div className={`h-2 rounded ${
                          isDarkMode ? 'bg-[#2D2D2D]' : 'bg-[#F0F0F0]'
                        } w-1/2`}></div>
                      </div>
                    </div>
                    <div className={`h-2 rounded ${
                      isDarkMode ? 'bg-[#3D3D3D]' : 'bg-[#E6E6E6]'
                    }`}></div>
                    <div className={`h-2 rounded ${
                      isDarkMode ? 'bg-[#2D2D2D]' : 'bg-[#F0F0F0]'
                    } w-4/5`}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Save Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="gap-2"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6 mt-6 animate-in fade-in duration-200" id="Settings-Notifications">
          {/* Email Notifications */}
          <Card className="rounded-lg shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h3>Email Notifications</h3>
              
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div className="flex-1">
                  <Label className="cursor-pointer">Application Updates</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive emails about application status changes
                  </p>
                </div>
                <Switch 
                  checked={notifications.emailUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, emailUpdates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div className="flex-1">
                  <Label className="cursor-pointer">Follow-up Reminders</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get reminders for scheduled follow-ups
                  </p>
                </div>
                <Switch 
                  checked={notifications.emailFollowups}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, emailFollowups: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* In-App Notifications */}
          <Card className="rounded-lg shadow-sm bg-[#F9FAFB]">
            <CardContent className="p-6 space-y-4">
              <h3>In-App Notifications</h3>
              
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white transition-colors">
                <div className="flex-1">
                  <Label className="cursor-pointer">System Alerts</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Show notifications for system updates and alerts
                  </p>
                </div>
                <Switch 
                  checked={notifications.inAppAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, inAppAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white transition-colors">
                <div className="flex-1">
                  <Label className="cursor-pointer">Status Changes</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get notified when application status changes
                  </p>
                </div>
                <Switch 
                  checked={notifications.inAppStatusChanges}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, inAppStatusChanges: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Reminders */}
          <Card className="rounded-lg shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h3>Reminders</h3>
              
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div className="flex-1">
                  <Label className="cursor-pointer">Upcoming Follow-up Dates</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Remind me about upcoming follow-up tasks
                  </p>
                </div>
                <Switch 
                  checked={notifications.remindersUpcoming}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, remindersUpcoming: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Bottom Save Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="gap-2"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

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
    </div>
  );
}
