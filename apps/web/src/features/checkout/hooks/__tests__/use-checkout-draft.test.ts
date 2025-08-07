import { renderHook, act } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { useCheckoutDraft } from "../use-checkout-draft";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Мокаем зависимости
vi.mock("~/trpc/react", () => ({
  useTRPC: () => ({
    checkout: {
      getDraft: {
        queryOptions: vi.fn().mockReturnValue({
          queryKey: ["checkout", "getDraft"],
          queryFn: vi.fn(),
        }),
        queryKey: vi.fn().mockReturnValue(["checkout", "getDraft"]),
      },
      saveDraft: {
        mutationOptions: vi.fn().mockReturnValue({
          mutationFn: vi.fn(),
          onSuccess: vi.fn(),
          onError: vi.fn(),
        }),
      },
    },
  }),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockReturnValue({
    data: {
      success: true,
      data: {
        id: "draft_123",
        draftData: {
          firstName: "Иван",
          lastName: "Иванов",
        },
      },
    },
    isLoading: false,
    error: null,
  }),
  useMutation: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  }),
  useQueryClient: vi.fn().mockReturnValue({
    invalidateQueries: vi.fn(),
  }),
}));

// Мокаем useCart
vi.mock("~/features/cart/hooks/use-cart", () => ({
  useCart: () => ({
    cart: {
      id: "cart_123",
      sessionId: "session_123",
    },
    isLoading: false,
  }),
}));

// Мокаем useSession
vi.mock("~/features/user-auth/hooks/use-session", () => ({
  useSession: () => ({
    session: {
      user: {
        id: "user_123",
      },
    },
    isAuthenticated: true,
  }),
}));

describe("useCheckoutDraft", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен инициализировать хук без ошибок", () => {
    const { result } = renderHook(() => {
      const form = useForm();
      return useCheckoutDraft({ form });
    });

    expect(result.current).toBeDefined();
    expect(result.current.isDraftLoading).toBe(false);
    expect(result.current.draft).toBeDefined();
    expect(result.current.draftError).toBeNull();
    expect(result.current.isSaving).toBe(false);
  });

  it("должен обрабатывать успешный ответ от getDraft", () => {
    const { result } = renderHook(() => {
      const form = useForm();
      return useCheckoutDraft({ form });
    });

    expect(result.current.draft).toEqual({
      id: "draft_123",
      draftData: {
        firstName: "Иван",
        lastName: "Иванов",
      },
    });
  });

  it("должен обрабатывать ошибку от getDraft", () => {
    const mockUseQuery = vi.mocked(require("@tanstack/react-query").useQuery);
    mockUseQuery.mockReturnValueOnce({
      data: {
        success: false,
        error: "Черновик не найден",
        data: null,
      },
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => {
      const form = useForm();
      return useCheckoutDraft({ form });
    });

    expect(result.current.draft).toBeNull();
    expect(result.current.draftError).toBe("Черновик не найден");
  });

  it("должен вызывать сохранение черновика", async () => {
    const mockMutate = vi.fn();
    const mockUseMutation = vi.mocked(require("@tanstack/react-query").useMutation);
    mockUseMutation.mockReturnValueOnce({
      mutate: mockMutate,
      isPending: false,
    });

    const { result } = renderHook(() => {
      const form = useForm();
      return useCheckoutDraft({ form });
    });

    // Вызываем сохранение
    await act(async () => {
      result.current.saveDraft();
    });

    // Проверяем, что функция сохранения была вызвана
    expect(mockMutate).toHaveBeenCalled();
  });
});
