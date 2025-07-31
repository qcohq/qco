"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Facebook, Globe, Instagram, Twitter } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { BrandFormValues } from "@/features/brands/schemas/brand-schema";

export function BrandWebPresence() {
  const { control } = useFormContext<BrandFormValues>();

  return (
    <div className="space-y-4">
      {/* Website */}
      <FormField
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Веб-сайт</FormLabel>
            <FormControl>
              <div className="relative">
                <Globe className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="https://example.com"
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>Официальный сайт бренда</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Social media */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Социальные сети</h4>

        {/* Instagram */}
        <FormField
          control={control}
          name="socialLinks.instagram"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Instagram className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Instagram username"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Facebook */}
        <FormField
          control={control}
          name="socialLinks.facebook"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Facebook className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Facebook page"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Twitter */}
        <FormField
          control={control}
          name="socialLinks.twitter"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Twitter className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Twitter handle"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
