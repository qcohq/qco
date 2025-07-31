import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.list - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Обработка ошибок", () => {
        it("должна обрабатывать ошибки базы данных", async () => {
            const db = helper.getDb()
            db.select.mockRejectedValue(new Error("Database error"))

            const input = {
                page: 1,
                limit: 12,
                search: "",
            }

            const caller = helper.getCaller()

            await expect(caller.categories.list(input)).rejects.toThrow("Ошибка получения категорий")
        })
    })
}) 