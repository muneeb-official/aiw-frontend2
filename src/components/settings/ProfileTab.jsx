import React, { useState } from 'react';
import { User, Mail, Building2, Phone, MapPin, Camera, Edit2 } from 'lucide-react';
import { SectionCard, InputField, ToggleSwitch } from './SettingsComponents';

const ProfileTab = ({ onEditProfile }) => {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    company: 'Acme Corporation',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    role: 'Sales Manager'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    campaignAlerts: true,
    weeklyReports: false,
    productUpdates: true
  });

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <SectionCard 
        title="Profile Information" 
        description="Your personal details and account information"
        action={
          <button 
            onClick={() => onEditProfile(profileData)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        }
      >
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Profile Details */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{profileData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{profileData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Company</p>
                <p className="text-sm font-medium text-gray-900">{profileData.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">{profileData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">{profileData.location}</p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Notification Preferences */}
      <SectionCard 
        title="Notification Preferences" 
        description="Manage how you receive notifications"
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={notifications.emailNotifications}
            onChange={(val) => setNotifications({ ...notifications, emailNotifications: val })}
            label="Email Notifications"
            description="Receive important updates via email"
          />
          <div className="border-t border-gray-100 pt-4">
            <ToggleSwitch
              enabled={notifications.campaignAlerts}
              onChange={(val) => setNotifications({ ...notifications, campaignAlerts: val })}
              label="Campaign Alerts"
              description="Get notified when campaigns complete or require attention"
            />
          </div>
          <div className="border-t border-gray-100 pt-4">
            <ToggleSwitch
              enabled={notifications.weeklyReports}
              onChange={(val) => setNotifications({ ...notifications, weeklyReports: val })}
              label="Weekly Reports"
              description="Receive weekly summary of your activity"
            />
          </div>
          <div className="border-t border-gray-100 pt-4">
            <ToggleSwitch
              enabled={notifications.productUpdates}
              onChange={(val) => setNotifications({ ...notifications, productUpdates: val })}
              label="Product Updates"
              description="Stay informed about new features and improvements"
            />
          </div>
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard 
        title="Security" 
        description="Manage your account security settings"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Password</p>
              <p className="text-xs text-gray-500">Last changed 30 days ago</p>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Change Password
            </button>
          </div>
          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">Add an extra layer of security</p>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              Enable
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Danger Zone */}
      <SectionCard 
        title="Danger Zone" 
        description="Irreversible account actions"
      >
        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div>
            <p className="text-sm font-medium text-red-900">Delete Account</p>
            <p className="text-xs text-red-600">Permanently delete your account and all associated data</p>
          </div>
          <button className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            Delete Account
          </button>
        </div>
      </SectionCard>
    </div>
  );
};

export default ProfileTab;