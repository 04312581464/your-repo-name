"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getMobileNetworkType } from '@/services/mobile-connection';

const POLL_INTERVAL = 30 * 60 * 1000; // 30 minutes

// Define the type for connection mode
type ConnectionMode = 'USB' | 'Wi-Fi' | 'Bluetooth' | null;

export default function Home() {
  const { toast } = useToast();
  const [networkType, setNetworkType] = useState<string | null>(null);
  const [prevNetworkType, setPrevNetworkType] = useState<string | null>(null);
  // State to store the connection mode
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>(null);

  const checkNetworkStatus = async () => {
    try {
      const type = await getMobileNetworkType();
      setNetworkType(type);

      // Assume Wi-Fi connection when the mobile device and laptop are on the same network.
      setConnectionMode('Wi-Fi');

      toast({
        title: `Connected to ${type}`,
        description: `Current network status: ${type} via Wi-Fi`,
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

  // Effect to check for network type changes
  useEffect(() => {
    if (networkType && prevNetworkType && networkType !== prevNetworkType) {
      toast({
        title: "Network Type Changed",
        description: `Network changed from ${prevNetworkType} to ${networkType}`,
      });
    }
    setPrevNetworkType(networkType);
  }, [networkType, prevNetworkType, toast]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-semibold text-foreground mb-4">
        HeavenFall
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
       {/* Display the connection mode */}
      {connectionMode && (
        <div className="mt-2">
          <p className="text-sm text-foreground">
            Connection Mode: {connectionMode}
          </p>
        </div>
      )}
         <footer className="mt-8 text-xs text-muted-foreground">
        Made by Lalit ❤️
      </footer>
    </div>
  );
}
