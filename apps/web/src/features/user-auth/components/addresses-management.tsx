"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@qco/ui/components/alert-dialog";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Textarea } from "@qco/ui/components/textarea";
import { Edit, Loader2, MapPin, Plus, Star, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddresses } from "../hooks/use-addresses";
import { type AddressFormValues, addressFormSchema } from "../schemas/address";

export function AddressesManagement() {
  const {
    addresses,
    addressesLoading,
    addressesError,
    createAddress,
    isCreating,
    updateAddress,
    isUpdating,
    deleteAddress,
    isDeleting,
  } = useAddresses();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<{
    id: string;
    addressLine1: string;
  } | null>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Россия",
      isPrimary: false,
      notes: "",
    },
  });

  function onSubmit(values: AddressFormValues) {
    if (editingAddressId) {
      updateAddress(
        { id: editingAddressId, ...values },
        {
          onSuccess: () => {
            form.reset();
            setEditingAddressId(null);
          },
        },
      );
    } else {
      createAddress(values, {
        onSuccess: () => {
          form.reset();
          setIsAddingNew(false);
        },
      });
    }
  }

  const handleEditAddress = (address: any) => {
    setEditingAddressId(address.id);
    form.reset({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state || "",
      postalCode: address.postalCode,
      country: address.country,
      isPrimary: address.isPrimary,
      notes: address.notes || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
    form.reset();
  };

  const handleDeleteAddress = (address: {
    id: string;
    addressLine1: string;
  }) => {
    setAddressToDelete(address);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      deleteAddress({ addressId: addressToDelete.id });
      setAddressToDelete(null);
    }
  };

  const cancelDelete = () => {
    setAddressToDelete(null);
  };

  if (addressesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Мои адреса</CardTitle>
          <CardDescription>Управление адресами доставки</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Загрузка адресов...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (addressesError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ошибка</CardTitle>
          <CardDescription>Не удалось загрузить адреса</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            {addressesError.message || "Произошла ошибка при загрузке адресов"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Мои адреса</CardTitle>
              <CardDescription>Управление адресами доставки</CardDescription>
            </div>
            <Button
              onClick={() => setIsAddingNew(true)}
              disabled={isAddingNew || !!editingAddressId}
            >
              <Plus className="mr-2 h-4 w-4" />
              Добавить адрес
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Форма добавления/редактирования адреса */}
          {(isAddingNew || editingAddressId) && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingAddressId ? "Редактировать адрес" : "Новый адрес"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Адрес</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Улица, дом, квартира"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Дополнительная информация</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Подъезд, этаж, код"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Город</FormLabel>
                            <FormControl>
                              <Input placeholder="Москва" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Регион</FormLabel>
                            <FormControl>
                              <Input placeholder="Московская область" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Почтовый индекс</FormLabel>
                            <FormControl>
                              <Input placeholder="123456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Страна</FormLabel>
                            <FormControl>
                              <Input placeholder="Россия" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Примечания</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Дополнительная информация для курьера"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isPrimary"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Основной адрес</FormLabel>
                            <FormDescription>
                              Использовать как адрес по умолчанию для доставки
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isCreating || isUpdating}>
                        {(isCreating || isUpdating) && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {editingAddressId
                          ? "Сохранить изменения"
                          : "Сохранить адрес"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={
                          editingAddressId
                            ? handleCancelEdit
                            : () => {
                              setIsAddingNew(false);
                              form.reset();
                            }
                        }
                      >
                        Отмена
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Список существующих адресов */}
          <div className="space-y-4">
            {addresses && addresses.length > 0 ? (
              addresses.map((address) => (
                <Card key={address.id} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {address.isPrimary && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Star className="h-3 w-3" />
                              Основной
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="font-medium">{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p className="text-muted-foreground">
                              {address.addressLine2}
                            </p>
                          )}
                          <p className="text-muted-foreground">
                            {address.city}{address.state && `, ${address.state}`}, {address.postalCode}
                          </p>
                          <p className="text-muted-foreground">
                            {address.country}
                          </p>
                          {address.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Примечания: {address.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditAddress(address)}
                          disabled={!!editingAddressId}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDeleteAddress({
                              id: address.id,
                              addressLine1: address.addressLine1,
                            })
                          }
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Нет сохраненных адресов
                </h3>
                <p className="text-muted-foreground mb-4">
                  Добавьте адрес для быстрого оформления заказов
                </p>
                <Button onClick={() => setIsAddingNew(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить первый адрес
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Модальное окно подтверждения удаления */}
      <AlertDialog
        open={!!addressToDelete}
        onOpenChange={(open) => !open && setAddressToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить адрес?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить адрес "
              {addressToDelete?.addressLine1}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
