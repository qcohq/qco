"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@qco/ui/components/button";
import { Input } from "@qco/ui/components/input";
import { Textarea } from "@qco/ui/components/textarea";
import { Switch } from "@qco/ui/components/switch";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@qco/ui/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import type { ProductDetailsProps } from "../types";
import { productEditFormSchema, type ProductEditFormData } from "@qco/validators";

// TODO: Использовать тип из схемы пропсов формы редактирования продукта, если появится в @qco/validators
interface ProductEditFormProps {
    product: ProductDetailsProps["product"];
    onSubmit: (data: ProductEditFormData) => void;
    isLoading?: boolean;
}

export function ProductEditForm({ product, onSubmit, isLoading = false }: ProductEditFormProps) {
    const form = useForm<ProductEditFormData>({
        resolver: zodResolver(productEditFormSchema),
        defaultValues: {
            name: product.name,
            description: product.description || "",
            basePrice: product.basePrice || undefined,
            salePrice: product.salePrice || undefined,
            stock: product.stock || undefined,
            sku: product.sku || "",
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            isPopular: product.isPopular,
            isNew: product.isNew,
            seoTitle: product.seoTitle || "",
            seoDescription: product.seoDescription || "",
        },
    });

    function handleSubmit(values: ProductEditFormData) {
        onSubmit(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter product name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The name of the product as it will appear to customers
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter product description"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Detailed description of the product
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="basePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Base Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Original price of the product
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="salePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sale Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Discounted price (optional)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : undefined)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Available quantity in stock
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKU</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter SKU" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Stock Keeping Unit identifier
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Active</FormLabel>
                                            <FormDescription>
                                                Make this product visible to customers
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Featured</FormLabel>
                                            <FormDescription>
                                                Highlight this product on the homepage
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="isPopular"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Popular</FormLabel>
                                            <FormDescription>
                                                Mark as a popular product
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isNew"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">New</FormLabel>
                                            <FormDescription>
                                                Mark as a new product
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>SEO Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="seoTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SEO Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter SEO title" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Title for search engine optimization
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="seoDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SEO Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter SEO description"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Description for search engine optimization
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
} 