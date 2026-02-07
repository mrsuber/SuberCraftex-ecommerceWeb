import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Laptop,
  Tablet,
  Tv,
  Gamepad2,
  Speaker,
  Monitor,
  Wrench,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Device Repair Services | SuberCraftex",
  description: "Professional repair services for phones, laptops, tablets, TVs, gaming consoles, and more. Fast turnaround and warranty on all repairs.",
};

const DEVICE_TYPES = [
  {
    icon: Phone,
    title: "Phone Repair",
    description: "Screen replacement, battery, charging port, and more",
  },
  {
    icon: Tablet,
    title: "Tablet Repair",
    description: "iPad, Android tablets, and other devices",
  },
  {
    icon: Laptop,
    title: "Laptop Repair",
    description: "Screen, keyboard, battery, and hardware upgrades",
  },
  {
    icon: Monitor,
    title: "Desktop Repair",
    description: "PC repairs, upgrades, and custom builds",
  },
  {
    icon: Tv,
    title: "TV Repair",
    description: "LED, LCD, Smart TV diagnostics and repairs",
  },
  {
    icon: Gamepad2,
    title: "Gaming Console",
    description: "PlayStation, Xbox, Nintendo repairs",
  },
  {
    icon: Speaker,
    title: "Audio Equipment",
    description: "Speakers, headphones, and audio systems",
  },
  {
    icon: Wrench,
    title: "Other Devices",
    description: "Smart watches, drones, and more",
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Warranty Included",
    description: "All repairs come with a 30-90 day warranty",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Most repairs completed within 24-48 hours",
  },
  {
    icon: CheckCircle,
    title: "Expert Technicians",
    description: "Certified professionals with years of experience",
  },
];

export default function RepairServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Device Repair Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Professional repair services for all your electronic devices. Our certified technicians
          provide fast, reliable repairs with warranty coverage.
        </p>
        <Link href="/services/repair/request">
          <Button size="lg" className="gap-2">
            Request a Repair <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Device Types */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">What We Repair</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DEVICE_TYPES.map((device) => {
            const Icon = device.icon;
            return (
              <Card key={device.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="text-center pb-2">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <CardTitle className="text-lg">{device.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{device.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-6">
            {[
              { step: 1, title: "Submit Request", description: "Tell us about your device and the issue you're experiencing" },
              { step: 2, title: "Get a Quote", description: "We'll diagnose your device and provide a detailed quote" },
              { step: 3, title: "Approve & Repair", description: "Once you approve, our technicians will fix your device" },
              { step: 4, title: "Pick Up", description: "Collect your repaired device with warranty coverage" },
            ].map((item, index) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  {item.step}
                </div>
                <div className={index < 3 ? "border-l-2 border-muted pl-4 pb-6 ml-5 -mt-2 pt-2" : "pl-4 -mt-2 pt-2"}>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Your Device Fixed?</h2>
        <p className="text-muted-foreground mb-6">
          Submit a repair request now and we'll get back to you with a quote.
        </p>
        <Link href="/services/repair/request">
          <Button size="lg" className="gap-2">
            Start Repair Request <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
