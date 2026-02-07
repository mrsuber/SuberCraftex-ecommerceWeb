"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Phone, Laptop, Tablet, Tv, Gamepad2, Speaker, Monitor, HelpCircle, Upload } from "lucide-react";

const DEVICE_TYPES = [
  { value: "phone", label: "Phone", icon: Phone },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "desktop", label: "Desktop", icon: Monitor },
  { value: "tv", label: "TV", icon: Tv },
  { value: "gaming_console", label: "Gaming Console", icon: Gamepad2 },
  { value: "audio_equipment", label: "Audio Equipment", icon: Speaker },
  { value: "other", label: "Other", icon: HelpCircle },
];

export function RepairRequestForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  const [formData, setFormData] = useState({
    deviceType: "",
    brand: "",
    model: "",
    serialNumber: "",
    deviceColor: "",
    issueDescription: "",
    issuePhotos: [] as string[],
    customerNotes: "",
    collectionMethod: "customer_brings",
    pickupAddress: "",
    scheduledDropoff: "",
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhotos(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("type", "repair-issue-photo");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error("Failed to upload photo");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      setFormData((prev) => ({
        ...prev,
        issuePhotos: [...prev.issuePhotos, ...uploadedUrls],
      }));
      toast.success(`${uploadedUrls.length} photo(s) uploaded`);
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast.error("Failed to upload photos");
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      issuePhotos: prev.issuePhotos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.deviceType || !formData.brand || !formData.model || !formData.issueDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/repair-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit repair request");
      }

      const repair = await response.json();
      toast.success("Repair request submitted successfully!");
      router.push(`/repair-requests/${repair.id}`);
    } catch (error) {
      console.error("Error submitting repair request:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit repair request");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.deviceType) {
      toast.error("Please select a device type");
      return;
    }
    if (step === 2 && (!formData.brand || !formData.model)) {
      toast.error("Please enter the brand and model");
      return;
    }
    if (step === 3 && !formData.issueDescription) {
      toast.error("Please describe the issue");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                s <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`w-12 h-1 ${s < step ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Device Type */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>What device needs repair?</CardTitle>
            <CardDescription>Select the type of device you need repaired</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DEVICE_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, deviceType: type.value }))
                    }
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      formData.deviceType === type.value
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-muted-foreground"
                    }`}
                  >
                    <Icon className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Device Details */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Device Details</CardTitle>
            <CardDescription>Tell us about your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  placeholder="e.g., Apple, Samsung"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, brand: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="e.g., iPhone 14 Pro"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, model: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number (Optional)</Label>
                <Input
                  id="serialNumber"
                  placeholder="Device serial number"
                  value={formData.serialNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, serialNumber: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceColor">Color (Optional)</Label>
                <Input
                  id="deviceColor"
                  placeholder="e.g., Space Gray"
                  value={formData.deviceColor}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, deviceColor: e.target.value }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Issue Description */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>What&apos;s the problem?</CardTitle>
            <CardDescription>Describe the issue in detail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="issueDescription">Issue Description *</Label>
              <Textarea
                id="issueDescription"
                placeholder="Describe what's wrong with your device..."
                value={formData.issueDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    issueDescription: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Photos of the Issue (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                <Label htmlFor="photos" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    {isUploadingPhotos ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      <Upload className="h-8 w-8" />
                    )}
                    <span>Click to upload photos</span>
                  </div>
                </Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isUploadingPhotos}
                />
              </div>
              {formData.issuePhotos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.issuePhotos.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Issue photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerNotes">Additional Notes (Optional)</Label>
              <Textarea
                id="customerNotes"
                placeholder="Any other information we should know..."
                value={formData.customerNotes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerNotes: e.target.value,
                  }))
                }
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Collection Method */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>How will you deliver the device?</CardTitle>
            <CardDescription>Choose how you&apos;ll get your device to us</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={formData.collectionMethod}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, collectionMethod: value }))
              }
            >
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="customer_brings" id="customer_brings" />
                <Label htmlFor="customer_brings" className="cursor-pointer flex-1">
                  <div className="font-medium">I&apos;ll bring it to the shop</div>
                  <div className="text-sm text-muted-foreground">
                    Drop off your device at our repair center
                  </div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="pickup_requested" id="pickup_requested" />
                <Label htmlFor="pickup_requested" className="cursor-pointer flex-1">
                  <div className="font-medium">Request pickup</div>
                  <div className="text-sm text-muted-foreground">
                    We&apos;ll come pick up your device (additional fee may apply)
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {formData.collectionMethod === "pickup_requested" && (
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address *</Label>
                <Textarea
                  id="pickupAddress"
                  placeholder="Enter your full address for pickup..."
                  value={formData.pickupAddress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pickupAddress: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>
            )}

            {formData.collectionMethod === "customer_brings" && (
              <div className="space-y-2">
                <Label htmlFor="scheduledDropoff">Preferred Drop-off Date (Optional)</Label>
                <Input
                  id="scheduledDropoff"
                  type="datetime-local"
                  value={formData.scheduledDropoff}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduledDropoff: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <Button onClick={nextStep}>Continue</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        )}
      </div>
    </div>
  );
}
