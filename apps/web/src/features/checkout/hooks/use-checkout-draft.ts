'use client'
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useCart } from "~/features/cart/hooks/use-cart";
import { useSession } from "~/features/user-auth/hooks/use-session";
import { type CheckoutFormValues, CheckoutDraftPartialValues } from "@qco/web-validators";
import { getDirtyFields } from "~/lib/utils";

interface UseCheckoutDraftProps {
  form: UseFormReturn<CheckoutFormValues>;
}

/**
 * Хук для управления автосохранением черновика оформления заказа
 */
export const useCheckoutDraft = ({ form }: UseCheckoutDraftProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { cart, isLoading: isCartLoading } = useCart();
  const { session, isAuthenticated } = useSession();

  // Получаем customerId из сессии пользователя
  const customerId = session?.user?.id;

  // Опции запроса для получения черновика
  const getDraftQueryOptions = trpc.checkout.getDraft.queryOptions({
    customerId: customerId,
    sessionId: cart?.sessionId,
  });

  // Получаем данные черновика
  const { data: draftResponse, isLoading: isDraftLoading, error: draftError } = useQuery({
    ...getDraftQueryOptions,
    enabled: !isCartLoading && (Boolean(customerId) || Boolean(cart?.sessionId)),
  });

  // Извлекаем данные черновика из ответа
  const draftData = draftResponse?.success ? draftResponse.data : null;

  // Опции мутации для сохранения черновика
  const saveDraftMutationOptions = trpc.checkout.saveDraft.mutationOptions({
    onSuccess: (data) => {
      // Инвалидируем кэш запроса черновика
      queryClient.invalidateQueries({
        queryKey: trpc.checkout.getDraft.queryKey({
          customerId: customerId,
          sessionId: cart?.sessionId,
        }),
      });
    },
    onError: (error) => {
      console.error("Ошибка при сохранении черновика:", error);
    },
  });

  // Инициализируем мутацию
  const saveDraftMutation = useMutation(saveDraftMutationOptions);

  // Функция для сохранения черновика с отправкой только измененных полей
  const saveDraft = () => {
    if (!customerId && !cart?.sessionId) {
      console.error("Не удалось сохранить черновик: отсутствует ID пользователя или сессии");
      return;
    }

    // Получаем только измененные поля из React Hook Form
    const dirtyFields = form.formState.dirtyFields;
    const formValues = form.getValues();
    const changedFields = getDirtyFields(dirtyFields, formValues);

    // Если нет изменений, не отправляем запрос
    if (Object.keys(changedFields).length === 0) {
      console.log("Нет изменений для сохранения в черновике");
      return;
    }

    saveDraftMutation.mutate({
      customerId: customerId,
      sessionId: cart?.sessionId,
      draftData: changedFields,
    });
  };

  // Загружаем данные черновика в форму при монтировании
  useEffect(() => {
    if (draftData?.draftData) {
      // Сбрасываем форму с данными черновика и очищаем dirtyFields
      form.reset(draftData.draftData as CheckoutFormValues);
    }
  }, [draftData, form]);

  // Функция для принудительного сохранения всех данных (например, при отправке формы)
  const saveFullDraft = (data: CheckoutFormValues) => {
    if (!customerId && !cart?.sessionId) {
      console.error("Не удалось сохранить черновик: отсутствует ID пользователя или сессии");
      return;
    }

    saveDraftMutation.mutate({
      customerId: customerId,
      sessionId: cart?.sessionId,
      draftData: data,
    });
  };

  // Функция для создания onBlur обработчика для поля
  const createOnBlurHandler = (fieldName: keyof CheckoutFormValues) => {
    return () => {
      // Проверяем, что поле действительно изменилось
      if (form.formState.dirtyFields[fieldName]) {
        console.log(`Сохранение черновика при blur поля: ${fieldName}`);
        saveDraft();
      }
    };
  };

  return {
    isDraftLoading,
    saveDraft,
    saveFullDraft,
    createOnBlurHandler,
    isSaving: saveDraftMutation.isPending,
    draftError,
  };
};
