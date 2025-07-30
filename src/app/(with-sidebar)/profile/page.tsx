'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  Mail,
  Phone,
  Shield,
  User2,
  Briefcase,
  Calendar,
  Users,
  UserCheck,
  Fingerprint,
  Globe,
  Laptop,
  Clock,
  UserCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

import { useGetUserDetailsQuery } from '@/app/(without-sidebar)/(auth)/(api)/auth.api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ProfilePage() {
  const { data: userDetails, isLoading, error } = useGetUserDetailsQuery();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    // Get profile image from localStorage or user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.profile) {
          setProfileImage(userData.profile);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error('Error loading profile', {
        description: 'Failed to fetch user details. Please try again later.',
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!userDetails) {
    return null;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="container space-y-6 p-4 pb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">View and manage your account details</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col items-center sm:flex-row sm:justify-between">
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your personal details</CardDescription>
                </div>
                <div className="mt-4 flex flex-col items-center sm:mt-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={profileImage || userDetails.data.profile}
                      alt={userDetails.data.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xl">
                      {getInitials(userDetails.data.name)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="mt-2 text-sm text-muted-foreground">Profile Picture</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">Full Name</p>
                      <p className="text-sm text-muted-foreground">{userDetails.data.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">Username</p>
                      <p className="text-sm text-muted-foreground">{userDetails.data.userName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">Date of Birth</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(userDetails.data.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">Gender</p>
                      <p className="text-sm capitalize text-muted-foreground">
                        {userDetails.data.gender || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">Email</p>
                      <p className="text-sm text-muted-foreground">{userDetails.data.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">Phone</p>
                      <p className="text-sm text-muted-foreground">{userDetails.data.phoneNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">Designation</p>
                      <p className="text-sm text-muted-foreground">
                        {userDetails.data.designation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">Referral</p>
                      <p className="text-sm text-muted-foreground">
                        {userDetails.data.referral || 'None'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your account information and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium leading-none">Status</p>
                </div>
                <Badge variant={userDetails.data.userStatus === 'active' ? 'default' : 'secondary'}>
                  {userDetails.data.userStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium leading-none">M-PIN Setup</p>
                </div>
                <Badge variant={userDetails.data.mPinSetup ? 'default' : 'outline'}>
                  {userDetails.data.mPinSetup ? 'Enabled' : 'Not Setup'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium leading-none">Access Type</p>
                </div>
                <span className="text-sm">Level {userDetails.data.accessType}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium leading-none">Eligibility</p>
                </div>
                <Badge variant={userDetails.data.isEligible ? 'default' : 'destructive'}>
                  {userDetails.data.isEligible ? 'Eligible' : 'Not Eligible'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
              <CardDescription>Current session details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium leading-none">IP Address</p>
                </div>
                <code className="rounded bg-muted px-2 py-1 text-xs">
                  {userDetails.data.sessionInfo.ip}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium leading-none">Device</p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {userDetails.data.sessionInfo.deviceInfo}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium leading-none">Last Active</p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(userDetails.data.sessionInfo.lastActive)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
