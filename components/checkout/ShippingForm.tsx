"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shippingAddressSchema, type ShippingAddress } from "@/lib/validations/checkout";
import { ArrowRight, Plus, Check, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  label?: string | null;
}

interface ShippingFormProps {
  defaultValues?: ShippingAddress;
  onSubmit: (data: ShippingAddress) => void;
}

export function ShippingForm({ defaultValues, onSubmit }: ShippingFormProps) {
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: defaultValues || {
      country: "Nigeria",
    },
  });

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/addresses");
        if (response.ok) {
          const addresses = await response.json();
          setSavedAddresses(addresses);

          // Auto-select default address if exists
          const defaultAddress = addresses.find((a: SavedAddress) => a.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else if (addresses.length > 0) {
            setSelectedAddressId(addresses[0].id);
          } else {
            // No saved addresses, show the form
            setShowNewAddressForm(true);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setShowNewAddressForm(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
  };

  const handleContinue = () => {
    if (selectedAddressId && !showNewAddressForm) {
      const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
      if (selectedAddress) {
        onSubmit({
          fullName: selectedAddress.fullName,
          email: "", // Will need to get from user profile or form
          phone: selectedAddress.phone,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2 || undefined,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
        });
      }
    }
  };

  const handleNewAddressSubmit = async (data: ShippingAddress) => {
    // Save the new address first
    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          phone: data.phone,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          isDefault: savedAddresses.length === 0,
        }),
      });

      if (response.ok) {
        const newAddress = await response.json();
        setSavedAddresses(prev => [...prev, newAddress]);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }

    // Continue with checkout
    onSubmit(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
        <CardDescription>
          {savedAddresses.length > 0
            ? "Select a saved address or add a new one"
            : "Enter your shipping address details"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Saved Addresses */}
        {savedAddresses.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Saved Addresses</h3>
            <div className="grid gap-3">
              {savedAddresses.map((address) => (
                <div
                  key={address.id}
                  className={cn(
                    "relative flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                    selectedAddressId === address.id && !showNewAddressForm
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handleAddressSelect(address.id)}
                >
                  <div className="flex-shrink-0 mt-1">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{address.fullName}</p>
                      {address.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                      {address.label && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                          {address.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                  </div>
                  {selectedAddressId === address.id && !showNewAddressForm && (
                    <div className="flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Address Button */}
            <Button
              type="button"
              variant={showNewAddressForm ? "default" : "outline"}
              className="w-full"
              onClick={() => {
                setShowNewAddressForm(true);
                setSelectedAddressId(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </div>
        )}

        {/* New Address Form */}
        {(showNewAddressForm || savedAddresses.length === 0) && (
          <form onSubmit={handleSubmit(handleNewAddressSubmit)} className="space-y-6">
            {savedAddresses.length > 0 && (
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">New Address</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNewAddressForm(false);
                    if (savedAddresses.length > 0) {
                      setSelectedAddressId(savedAddresses[0].id);
                    }
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+234 801 234 5678"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="font-semibold">Shipping Address</h3>

              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  {...register("addressLine1")}
                  placeholder="123 Main Street"
                />
                {errors.addressLine1 && (
                  <p className="text-sm text-destructive">{errors.addressLine1.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  {...register("addressLine2")}
                  placeholder="Apt, Suite, Unit (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    placeholder="Lagos"
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    {...register("state")}
                    placeholder="Lagos"
                  />
                  {errors.state && (
                    <p className="text-sm text-destructive">{errors.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    {...register("postalCode")}
                    placeholder="100001"
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  {...register("country")}
                  placeholder="Nigeria"
                />
                {errors.country && (
                  <p className="text-sm text-destructive">{errors.country.message}</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" size="lg" className="group">
                Continue to Shipping Method
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </form>
        )}

        {/* Continue with Selected Address */}
        {selectedAddressId && !showNewAddressForm && savedAddresses.length > 0 && (
          <div className="flex justify-end pt-4 border-t">
            <Button size="lg" className="group" onClick={handleContinue}>
              Continue to Shipping Method
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
