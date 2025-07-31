import type { TRPCRouterRecord } from "@trpc/server";
import { getCustomerInfo } from "./get-customer-info";
import { getDraft } from "./get-draft";
import { getSavedAddresses } from "./get-saved-addresses";
import { getSavedPaymentMethods } from "./get-saved-payment-methods";
import { saveDraft } from "./save-draft";
import { deleteDraft } from "./delete-draft";
import { cleanupOldDrafts } from "./cleanup-old-drafts";
import { validateDraft } from "./validate-draft";
import { selectShippingMethod } from "./select-shipping-method";
import { setPaymentMethod } from "./set-payment-method";
import { updateCustomerInfo } from "./update-customer-info";

export const checkoutRouter = {
    getCustomerInfo,
    getSavedAddresses,
    getSavedPaymentMethods,
    selectShippingMethod,
    setPaymentMethod,
    updateCustomerInfo,
    getDraft,
    saveDraft,
    deleteDraft,
    cleanupOldDrafts,
    validateDraft,
} satisfies TRPCRouterRecord;

