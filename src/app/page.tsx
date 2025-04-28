"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getMobileNetworkType } from '@/services/mobile-connection';

const POLL_INTERVAL = 30 * 60 * 1000; // 30 minutes
export default function Home() {
  const { toast } = useToast();
  const [networkType, setNetworkType] = useState<string | null>(null);

  const checkNetworkStatus = async () => {
    try {
      const type = await getMobileNetworkType();
      setNetworkType(type);
      toast({
        title: `Connected to ${type}`,
        description: `Current network status: ${type}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to detect network type",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkNetworkStatus(); // Initial check

    const intervalId = setInterval(checkNetworkStatus, POLL_INTERVAL);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [toast]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-semibold text-foreground mb-4">
        NetAlert
      </h1>
      <p className="text-muted-foreground">
        Desktop notifier for mobile network type (4G or 5G).
      </p>
      {networkType && (
        <div className="mt-4">
          <p className="text-sm text-foreground">
            Current Network Type: {networkType}
          </p>
        </div>
      )}
    </div>
  );
}
