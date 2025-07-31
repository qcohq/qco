"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
import { Form } from "@qco/ui/components/form";
// biome-ignore lint/correctness/noUnusedImports: DeliverySettings используется в типизации
import { type DeliverySettings, deliverySettingsSchema } from "@qco/validators";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/react";
import { AdditionalSettingsForm } from "./additional-settings-form";
import { BasicSettingsForm } from "./basic-settings-form";
import { CostSettingsForm } from "./cost-settings-form";
import { RegionsSettingsForm } from "./regions-settings-form";

// TODO: Использовать тип из схемы пропсов формы настроек доставки, если появится в @qco/validators
interface DeliverySettingsFormProps {
  initialData: DeliverySettings;
  onSuccess: () => void;
}

export function DeliverySettingsForm({
  initialData,
  onSuccess,
}: DeliverySettingsFormProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    initialData?.regions || [],
  );
  const trpc = useTRPC();

  const form = useForm({
    resolver: zodResolver(deliverySettingsSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
      deliveryType: initialData?.deliveryType || "pickup",
      minOrderAmount: initialData?.minOrderAmount || 0,
      maxOrderAmount: initialData?.maxOrderAmount || undefined,
      deliveryCost: initialData?.deliveryCost || 0,
      freeDeliveryThreshold: initialData?.freeDeliveryThreshold || undefined,
      estimatedDays: initialData?.estimatedDays || undefined,
      weightLimit: initialData?.weightLimit || undefined,
      sizeLimit: initialData?.sizeLimit || "",
      isDefault: initialData?.isDefault ?? false,
    },
  });

  const createMutation = useMutation(
    trpc.deliverySettings.create.mutationOptions({
      onSuccess: () => {
        toast.success("Настройки доставки созданы");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.deliverySettings.update.mutationOptions({
      onSuccess: () => {
        toast.success("Настройки доставки обновлены");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }),
  );

  const onSubmit = (data: DeliverySettings) => {
    const formData = {
      ...data,
      regions: selectedRegions,
    };

    if (initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicSettingsForm />
        <CostSettingsForm />
        <RegionsSettingsForm
          selectedRegions={selectedRegions}
          onRegionsChange={setSelectedRegions}
        />
        <AdditionalSettingsForm />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
