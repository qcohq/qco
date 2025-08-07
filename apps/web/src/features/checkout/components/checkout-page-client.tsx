"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@qco/ui/components/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { clearCartData, getCartIdForApi } from "@/lib/cart-utils";
import { useTRPC } from "@/trpc/react";
import { checkoutFormSchema, type CheckoutFormValues } from "@qco/web-validators";

import { CheckoutStates } from "./checkout-states";
// Импорты компонентов
import { ContactInformationForm } from "./contact-information-form";
import { DeliveryAddressForm } from "./delivery-address-form";
import { OrderSummary } from "./order-summary";
import { PaymentMethodForm } from "./payment-method-form";
import { ShippingMethodForm } from "./shipping-method-form";
// Импорты новых компонентов для интеграции с профилем
import { ProfileDataSelector } from "./profile-data-selector";
import { SavedAddressesSelector } from "./saved-addresses-selector";
import { SaveToProfileCheckbox } from "./save-to-profile-checkbox";
import { useCheckoutDraft } from "../hooks/use-checkout-draft";
import { useProfileDataForCheckout, type AddressData } from "../hooks/use-profile-data";
import { useIsMobile } from "@/hooks/use-mobile";
import type { RouterOutputs } from "@qco/web-api";


interface CheckoutPageProps {
    cart: RouterOutputs['cart']['getCart'];
}

const CheckoutPageClient = ({ cart }: CheckoutPageProps) => {
    const trpc = useTRPC();
    const isMobile = useIsMobile();

    // Состояние для ID корзины
    const [cartParams, setCartParams] = useState<{
        cartId?: string;
        sessionId?: string;
    }>({});

    // Состояние для режима заполнения данных
    const [dataMode, setDataMode] = useState<"profile" | "manual">("manual");
    const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
    const [showManualAddressForm, setShowManualAddressForm] = useState(true);
    const [showAddressSelector, setShowAddressSelector] = useState(false);

    // Получаем данные профиля
    const {
        profile,
        addresses,
        primaryAddress,
        isLoading: isProfileLoading,
        isAuthenticated,
        hasProfileData,
        hasAddresses,
    } = useProfileDataForCheckout();

    // Инициализируем состояние отображения селектора адресов
    useEffect(() => {
        if (isAuthenticated && hasAddresses) {
            setShowAddressSelector(true);
            setShowManualAddressForm(false);
        } else {
            setShowAddressSelector(false);
            setShowManualAddressForm(true);
        }
    }, [isAuthenticated, hasAddresses, isProfileLoading]);

    // Получаем ID корзины при монтировании компонента
    useEffect(() => {
        const params = getCartIdForApi();
        setCartParams(params);
    }, []);


    // Получаем настройки доставки
    const { data: deliverySettings } = useQuery(
        trpc.deliverySettings.getAll.queryOptions()
    );

    // Очистка корзины
    const clearCartMutation = useMutation(trpc.cart.clearCart.mutationOptions());

    // Инициализация формы
    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            apartment: "",
            city: "",
            state: "",
            postalCode: "",
            shippingMethod: "",
            deliveryDate: undefined,
            deliveryTimeSlot: "",
            deliveryInstructions: "",
            paymentMethod: "cash-on-delivery",
            saveToProfile: false,
            createProfile: false,
        },
        mode: "onChange", // Валидация при изменении
    });

    const { isDraftLoading, saveDraft, saveFullDraft, createOnBlurHandler, isSaving, draftError } = useCheckoutDraft({ form });

    // Убираем автоматическое сохранение при каждом изменении формы
    // Теперь сохранение происходит при смене фокуса с полей

    // Сохраняем черновик при изменении важных полей
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            // Сохраняем при изменении способа доставки или оплаты
            if (name === 'shippingMethod' || name === 'paymentMethod') {
                saveDraft();
            }
        });
        return () => subscription.unsubscribe();
    }, [form, saveDraft]);

    // Отображаем ошибки загрузки черновика
    useEffect(() => {
        if (draftError) {
            console.warn("Ошибка при загрузке черновика:", draftError);
            // Можно показать toast с предупреждением
            // toast.warning("Не удалось загрузить сохраненные данные");
        }
    }, [draftError]);

    const createOrderMutationOptions = trpc.orders.createOrder.mutationOptions({
        onSuccess: async (data) => {
            if (cart?.id) {
                try {
                    await clearCartMutation.mutateAsync({ cartId: cart.id });
                    clearCartData();
                } catch (error) {
                    console.error("Ошибка при очистке корзины:", error);
                }
            }

            // Показываем соответствующее уведомление в зависимости от того, что было выбрано
            if (form.getValues().saveToProfile || form.getValues().createProfile) {
                if (isAuthenticated) {
                    toast.success("Заказ создан и данные сохранены в профиль!", {
                        description: "Ваши контактные данные и адрес были сохранены в профиле для быстрого оформления следующих заказов.",
                    });
                } else {
                    toast.success("Заказ создан и профиль сохранен!", {
                        description: "Для вас был создан профиль с контактными данными и адресом для быстрого оформления следующих заказов.",
                    });
                }
            } else {
                toast.success("Заказ успешно создан!");
            }

            window.location.href = `/checkout/success?orderId=${data.orderId}`;
        },
        onError: (error) => {
            toast.error(error.message || "Ошибка при создании заказа");
        },
    });

    const { mutate: createOrder, isPending: isCreatingOrder } = useMutation(
        createOrderMutationOptions,
    );



    // Функции для работы с данными профиля
    const handleUseProfileData = () => {
        if (hasProfileData) {
            form.setValue("firstName", profile.firstName || "");
            form.setValue("lastName", profile.lastName || "");
            form.setValue("email", profile.email || "");
            form.setValue("phone", profile.phone || "");

            // Если есть основной адрес, заполняем его тоже
            if (primaryAddress) {
                form.setValue("address", primaryAddress.addressLine1);
                form.setValue("apartment", primaryAddress.addressLine2 || "");
                form.setValue("city", primaryAddress.city);
                form.setValue("state", primaryAddress.state || "");
                form.setValue("postalCode", primaryAddress.postalCode);
                setSelectedAddressId(primaryAddress.id);
            }

            setDataMode("profile");
            setShowManualAddressForm(!primaryAddress);
            setShowAddressSelector(true);
        }
    };

    const handleUseManualInput = () => {
        setDataMode("manual");
        setSelectedAddressId(undefined);
        setShowManualAddressForm(true);
        setShowAddressSelector(true);
    };

    const handleAddressSelect = (address: AddressData) => {
        form.setValue("address", address.addressLine1);
        form.setValue("apartment", address.addressLine2 || "");
        form.setValue("city", address.city);
        form.setValue("state", address.state || "");
        form.setValue("postalCode", address.postalCode);
        setSelectedAddressId(address.id);
        setShowManualAddressForm(false);
        setShowAddressSelector(true);
    };

    const handleNewAddressClick = () => {
        setSelectedAddressId(undefined);
        setShowManualAddressForm(true);
        setShowAddressSelector(false);
        // Очищаем поля адреса
        form.setValue("address", "");
        form.setValue("apartment", "");
        form.setValue("city", "");
        form.setValue("state", "");
        form.setValue("postalCode", "");
        // Устанавливаем режим ручного ввода
        setDataMode("manual");
    };

    const onSubmit = (values: CheckoutFormValues) => {
        if (!cart) {
            toast.error("Корзина пуста");
            return;
        }

        if (!values.shippingMethod) {
            toast.error("Выберите способ доставки");
            return;
        }

        // Сохраняем полный черновик перед отправкой заказа
        saveFullDraft(values);

        // Формируем данные для создания заказа
        const customerInfo = {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            address: values.address,
            apartment: values.apartment,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,
        };

        // Получаем данные о выбранном способе доставки
        const selectedShippingSetting = deliverySettings?.find(
            (setting: any) => setting.id === values.shippingMethod,
        );

        if (!selectedShippingSetting) {
            toast.error("Выбранный способ доставки недоступен");
            return;
        }

        // Рассчитываем стоимость доставки
        const shippingCost = Number.parseFloat(
            selectedShippingSetting.deliveryCost || "0",
        );
        // Используем total с сервера, который уже правильно вычислен с приоритетом salePrice
        const subtotal = cart?.total || 0;

        // Проверяем бесплатную доставку
        const threshold = Number.parseFloat(
            selectedShippingSetting.freeDeliveryThreshold || "0",
        );
        const finalShippingCost =
            threshold > 0 && subtotal >= threshold ? 0 : shippingCost;

        const orderData = {
            cartId: cart.id,
            customerInfo: {
                ...customerInfo,
                saveAddress: values.saveToProfile,
            },
            shippingMethod: {
                id: selectedShippingSetting.id,
                name: selectedShippingSetting.name,
                description: selectedShippingSetting.description || "",
                price: finalShippingCost,
                estimatedDelivery: selectedShippingSetting.estimatedDays
                    ? `${selectedShippingSetting.estimatedDays} дн.`
                    : "Не указан",
            },
            paymentMethod: {
                id: values.paymentMethod,
                type: values.paymentMethod === "cash-on-delivery" ? "cash_on_delivery" : "credit_card",
                name:
                    values.paymentMethod === "cash-on-delivery"
                        ? "Наличные курьеру"
                        : "Банковской картой курьеру",
                description:
                    values.paymentMethod === "cash-on-delivery"
                        ? "Оплата наличными при получении"
                        : "Оплата картой при получении",
            },
            // Теперь создание профиля доступно всем пользователям
            createProfile: values.createProfile || values.saveToProfile,
        };

        createOrder(orderData);
    };

    // Проверяем состояния загрузки и ошибок
    if (!cartParams.cartId && !cartParams.sessionId) {
        return <CheckoutStates type="no-cart" />;
    }


    return (
        <div className="w-full max-w-full px-2 sm:px-4 py-4 sm:py-8 mx-auto">
            <div className="w-full max-w-full lg:max-w-6xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center sm:text-left">Оформление заказа</h1>

                {/* Индикатор сохранения */}
                {isSaving && (
                    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            <span>Сохранение...</span>
                        </div>
                    </div>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, (errors) => {
                            console.log(errors);
                            toast.error("Ошибки валидации формы. Проверьте все поля.");
                        })}
                        className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-3"
                    >
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            {/* Селектор режима заполнения данных - только для авторизованных */}
                            {isAuthenticated && (
                                <ProfileDataSelector
                                    profile={profile}
                                    hasProfileData={hasProfileData}
                                    isAuthenticated={isAuthenticated}
                                    onUseProfileData={handleUseProfileData}
                                    onUseManualInput={handleUseManualInput}
                                    selectedMode={dataMode}
                                />
                            )}

                            <ContactInformationForm
                                form={form}
                                dataMode={dataMode}
                                onUseProfileData={handleUseProfileData}
                                onUseManualInput={handleUseManualInput}
                                isAuthenticated={isAuthenticated}
                                hasProfileData={hasProfileData}
                                mobileFlat={isMobile}
                                onBlur={(fieldName) => createOnBlurHandler(fieldName as keyof CheckoutFormValues)()}
                            />

                            {/* Селектор сохранённых адресов - только для авторизованных */}
                            {isAuthenticated && hasAddresses && showAddressSelector && (
                                <SavedAddressesSelector
                                    addresses={addresses}
                                    isLoading={isProfileLoading}
                                    onAddressSelect={handleAddressSelect}
                                    onNewAddressClick={handleNewAddressClick}
                                    selectedAddressId={selectedAddressId}
                                />
                            )}

                            {/* Форма адреса доставки - показываем когда нет выбранного адреса или пользователь хочет ввести новый */}
                            {showManualAddressForm && (
                                <DeliveryAddressForm
                                    form={form}
                                    showBackToAddresses={isAuthenticated && hasAddresses && !showAddressSelector}
                                    onBackToAddresses={() => {
                                        setShowAddressSelector(true);
                                        setShowManualAddressForm(false);
                                    }}
                                    mobileFlat={isMobile}
                                    onBlur={(fieldName) => createOnBlurHandler(fieldName as keyof CheckoutFormValues)()}
                                />
                            )}

                            <ShippingMethodForm
                                form={form}
                                cartTotal={cart?.total || 0}
                                userRegion={form.watch("state")}
                                mobileFlat={isMobile}
                                onBlur={(fieldName) => createOnBlurHandler(fieldName as keyof CheckoutFormValues)()}
                            />

                            {/* Checkbox для сохранения данных в профиль - теперь доступен всем */}
                            <SaveToProfileCheckbox
                                form={form}
                                isAuthenticated={isAuthenticated}
                                dataMode={dataMode}
                            />

                            <PaymentMethodForm
                                form={form}
                                mobileFlat={isMobile}
                                onBlur={(fieldName) => createOnBlurHandler(fieldName as keyof CheckoutFormValues)()}
                            />
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1 w-full">
                            <OrderSummary
                                form={form}
                                cart={cart}
                                isCreatingOrder={isCreatingOrder}
                            // Добавить mobileFlat если реализовано
                            />

                            {/* Security Notice */}
                            <div className="mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg text-center sm:text-left">
                                <div className="flex items-center gap-2 text-green-800 text-sm justify-center sm:justify-start">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="font-medium">Безопасная оплата</span>
                                </div>
                                <p className="text-xs text-green-700 mt-1">
                                    Все платежи защищены SSL-шифрованием. Данные вашей карты не
                                    сохраняются на наших серверах.
                                </p>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CheckoutPageClient;
