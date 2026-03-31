"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Palette, Database, HelpCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  // Profile state
  const [firstName, setFirstName] = useState("Nathan")
  const [lastName, setLastName] = useState("Cole")
  const [email, setEmail] = useState("nathan.cole@academy.com")
  const [teamName, setTeamName] = useState("Academy First Team")
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Notification state
  const [aiInsightsNotif, setAiInsightsNotif] = useState(true)
  const [newClipNotif, setNewClipNotif] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  // Appearance state
  const [darkMode, setDarkMode] = useState(true)
  const [compactView, setCompactView] = useState(false)

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  
  // Loading states
  const [isEnabling2FA, setIsEnabling2FA] = useState(false)
  const [isViewingSessions, setIsViewingSessions] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isClearingCache, setIsClearingCache] = useState(false)

  const handleSaveProfile = async () => {
    setIsSavingProfile(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSavingProfile(false)
    toast.success("Settings saved", {
      description: "Your changes have been saved successfully",
    })
  }

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsEnabling2FA(false)
    setIs2FAEnabled(true)
    toast.success("Two-Factor Authentication Enabled", {
      description: "Your account is now protected with 2FA",
    })
  }

  const handleViewSessions = async () => {
    setIsViewingSessions(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsViewingSessions(false)
    toast.info("Active Sessions", {
      description: "You have 2 active sessions: This device and Chrome on MacBook",
    })
  }

  const handleExportData = async () => {
    setIsExporting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsExporting(false)
    toast.success("Export started", {
      description: "You'll receive an email when your data export is ready",
    })
  }

  const handleClearCache = async () => {
    setIsClearingCache(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsClearingCache(false)
    toast.success("Cache cleared", {
      description: "Application cache has been cleared",
    })
  }

  const handleToggleNotification = (
    type: "ai" | "clip" | "weekly",
    value: boolean
  ) => {
    switch (type) {
      case "ai":
        setAiInsightsNotif(value)
        break
      case "clip":
        setNewClipNotif(value)
        break
      case "weekly":
        setWeeklyDigest(value)
        break
    }
    toast.success("Notification preference saved")
  }

  const handleToggleAppearance = (type: "dark" | "compact", value: boolean) => {
    switch (type) {
      case "dark":
        setDarkMode(value)
        // Actually toggle dark mode on the document
        if (value) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
        toast.success(value ? "Dark mode enabled" : "Light mode enabled")
        break
      case "compact":
        setCompactView(value)
        toast.success(value ? "Compact view enabled" : "Standard view enabled")
        break
    }
  }

  const handleOpenDocs = () => {
    window.open("https://docs.pitchiq.com", "_blank")
    toast.info("Opening documentation...")
  }

  const handleContactSupport = () => {
    toast.success("Support ticket opened", {
      description: "Our team will respond within 24 hours",
    })
  }

  const handleReportBug = () => {
    toast.success("Bug report form opened", {
      description: "Thanks for helping us improve PitchIQ!",
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-60 flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and app preferences
          </p>
        </div>

        <div className="max-w-3xl space-y-6">
          {/* Profile Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-primary" />
                Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">Team Name</Label>
                <Input
                  id="team"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                {isSavingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">AI Insights Ready</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new AI analysis is complete
                  </p>
                </div>
                <Switch
                  checked={aiInsightsNotif}
                  onCheckedChange={(v) => handleToggleNotification("ai", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">New Clip Uploaded</p>
                  <p className="text-sm text-muted-foreground">
                    Notifications for new video uploads
                  </p>
                </div>
                <Switch
                  checked={newClipNotif}
                  onCheckedChange={(v) => handleToggleNotification("clip", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Weekly Summary</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly performance digest
                  </p>
                </div>
                <Switch
                  checked={weeklyDigest}
                  onCheckedChange={(v) => handleToggleNotification("weekly", v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your data and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                {is2FAEnabled ? (
                  <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                    Enabled
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEnable2FA}
                    disabled={isEnabling2FA}
                  >
                    {isEnabling2FA ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Enable"
                    )}
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Session History</p>
                  <p className="text-sm text-muted-foreground">
                    View and manage your active sessions
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewSessions}
                  disabled={isViewingSessions}
                >
                  {isViewingSessions ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "View"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme throughout the app
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={(v) => handleToggleAppearance("dark", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Compact View</p>
                  <p className="text-sm text-muted-foreground">
                    Show more content with smaller spacing
                  </p>
                </div>
                <Switch
                  checked={compactView}
                  onCheckedChange={(v) => handleToggleAppearance("compact", v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data & Storage */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-5 w-5 text-primary" />
                Data & Storage
              </CardTitle>
              <CardDescription>
                Manage your data usage and exports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Storage Used</p>
                  <p className="text-sm text-muted-foreground">
                    24.7 GB of 100 GB used
                  </p>
                </div>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="w-1/4 h-full bg-primary rounded-full" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    "Export All Data"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCache}
                  disabled={isClearingCache}
                >
                  {isClearingCache ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    "Clear Cache"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HelpCircle className="h-5 w-5 text-primary" />
                Help & Support
              </CardTitle>
              <CardDescription>
                Get help and contact support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={handleOpenDocs}>
                  Documentation
                </Button>
                <Button variant="outline" size="sm" onClick={handleContactSupport}>
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" onClick={handleReportBug}>
                  Report a Bug
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
