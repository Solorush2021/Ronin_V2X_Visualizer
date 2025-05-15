"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, AlertTriangle, Wifi, Thermometer } from 'lucide-react'; // Using Thermometer for speed, Wifi for signal
import type { DistanceDataPoint } from './distance-chart';
import DistanceChart from './distance-chart';
import { cn } from '@/lib/utils';

const CRASH_THRESHOLD = 10; // meters
const MAX_HISTORY_LENGTH = 30; // Number of data points for the chart

// Define a type for the simulated data
interface VehicleData {
  speed: number;
  v2vDistance: number;
  signalStrength: number;
}

export default function V2XDashboard() {
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    speed: 60.0,
    v2vDistance: 30.0,
    signalStrength: 85,
  });
  const [distanceHistory, setDistanceHistory] = useState<DistanceDataPoint[]>([]);
  const [isCrashAlertActive, setIsCrashAlertActive] = useState(false);
  const [tickCounter, setTickCounter] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTickCounter(prev => prev + 1);

      // Simulate V2V Distance
      let newV2VDistance;
      if (tickCounter % 12 === 0 && Math.random() < 0.6) { // Increased chance of alert every 12 ticks
        newV2VDistance = 5 + Math.random() * 7; // 5.0 to 12.0m
      } else {
        newV2VDistance = 10 + Math.random() * 40; // 10.0 to 50.0m
      }
      const roundedV2VDistance = parseFloat(newV2VDistance.toFixed(1));

      // Simulate Speed
      const newSpeed = 50 + Math.random() * 30; // 50.0 to 80.0 km/h
      const roundedSpeed = parseFloat(newSpeed.toFixed(1));
      
      // Simulate Signal Strength
      const newSignalStrength = Math.min(100, Math.max(0, vehicleData.signalStrength + (Math.random() * 10 - 5))); // Fluctuate around previous value
      const roundedSignalStrength = parseFloat(newSignalStrength.toFixed(0));

      setVehicleData({
        speed: roundedSpeed,
        v2vDistance: roundedV2VDistance,
        signalStrength: roundedSignalStrength,
      });

      setIsCrashAlertActive(roundedV2VDistance < CRASH_THRESHOLD);

      setDistanceHistory(prev => {
        const newHistoryEntry = { time: `T${tickCounter}`, distance: roundedV2VDistance };
        const updatedHistory = [...prev, newHistoryEntry];
        if (updatedHistory.length > MAX_HISTORY_LENGTH) {
          return updatedHistory.slice(updatedHistory.length - MAX_HISTORY_LENGTH);
        }
        return updatedHistory;
      });

    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [tickCounter, vehicleData.signalStrength]); // Include tickCounter to re-evaluate alert condition

  const DataDisplayCard: React.FC<{ title: string; value: string | number; unit: string; icon: React.ReactNode; valueColor?: string }> = ({ title, value, unit, icon, valueColor = "text-accent" }) => (
    <Card className="flex-1 min-w-[150px] bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-4xl font-bold", valueColor)}>
          {value}
          <span className="text-xl font-normal text-muted-foreground ml-1">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-4xl space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span role="img" aria-label="Car emoji" className="mr-2">🚗</span>
          Ronin V2X Visualizer
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Real-time simulated C-V2X data and alerts.
        </p>
      </header>

      {isCrashAlertActive && (
        <Card className="bg-destructive text-destructive-foreground v2x-crash-alert-active shadow-2xl shadow-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl font-bold">
              <AlertTriangle className="w-10 h-10 mr-3" />
              CRASH ALERT!
            </CardTitle>
            <CardDescription className="text-destructive-foreground/80 text-lg">
              V2V Distance critically low: {vehicleData.v2vDistance}m
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DataDisplayCard title="Speed" value={vehicleData.speed} unit="km/h" icon={<Thermometer className="h-5 w-5 text-muted-foreground" />} />
        <DataDisplayCard 
          title="V2V Distance" 
          value={vehicleData.v2vDistance} 
          unit="m" 
          icon={<Zap className="h-5 w-5 text-muted-foreground" />} 
          valueColor={isCrashAlertActive ? "text-destructive-foreground" : "text-accent"}
        />
        <DataDisplayCard title="Signal Strength" value={vehicleData.signalStrength} unit="%" icon={<Wifi className="h-5 w-5 text-muted-foreground" />} />
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>V2V Distance Over Time</CardTitle>
            <CardDescription>Visualizing vehicle proximity (last {MAX_HISTORY_LENGTH} seconds)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[400px] p-2 sm:p-4">
            <DistanceChart data={distanceHistory} alertThreshold={CRASH_THRESHOLD} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
