import { describe, it, expect, beforeEach } from 'vitest';
import { getProductMainImages } from '../../src/lib/product-images';

// Мок для базы данных
const mockDb = {
    select: vi.fn(),
    from: vi.fn(),
    innerJoin: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
};

describe('getProductMainImages', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return empty object for empty productIds array', async () => {
        const result = await getProductMainImages(mockDb, []);
        expect(result).toEqual({});
    });

    it('should return image URLs for products with main images', async () => {
        const mockFiles = [
            {
                productId: 'product1',
                filePath: '/images/product1-main.jpg',
                fileType: 'main',
                fileOrder: 0,
            },
            {
                productId: 'product2',
                filePath: '/images/product2-main.jpg',
                fileType: 'main',
                fileOrder: 0,
            },
        ];

        // Настраиваем мок для цепочки вызовов
        mockDb.select.mockReturnValue({
            from: mockDb.from,
        });
        mockDb.from.mockReturnValue({
            innerJoin: mockDb.innerJoin,
        });
        mockDb.innerJoin.mockReturnValue({
            where: mockDb.where,
        });
        mockDb.where.mockReturnValue({
            orderBy: mockDb.orderBy,
        });
        mockDb.orderBy.mockResolvedValue(mockFiles);

        const result = await getProductMainImages(mockDb, ['product1', 'product2']);

        expect(result).toEqual({
            product1: 'https://example.com/images/product1-main.jpg',
            product2: 'https://example.com/images/product2-main.jpg',
        });
    });

    it('should handle products without images', async () => {
        const mockFiles = [
            {
                productId: 'product1',
                filePath: '/images/product1-main.jpg',
                fileType: 'main',
                fileOrder: 0,
            },
        ];

        mockDb.select.mockReturnValue({
            from: mockDb.from,
        });
        mockDb.from.mockReturnValue({
            innerJoin: mockDb.innerJoin,
        });
        mockDb.innerJoin.mockReturnValue({
            where: mockDb.where,
        });
        mockDb.where.mockReturnValue({
            orderBy: mockDb.orderBy,
        });
        mockDb.orderBy.mockResolvedValue(mockFiles);

        const result = await getProductMainImages(mockDb, ['product1', 'product2']);

        expect(result).toEqual({
            product1: 'https://example.com/images/product1-main.jpg',
            product2: null,
        });
    });

    it('should handle database errors gracefully', async () => {
        mockDb.select.mockReturnValue({
            from: mockDb.from,
        });
        mockDb.from.mockReturnValue({
            innerJoin: mockDb.innerJoin,
        });
        mockDb.innerJoin.mockReturnValue({
            where: mockDb.where,
        });
        mockDb.where.mockReturnValue({
            orderBy: mockDb.orderBy,
        });
        mockDb.orderBy.mockRejectedValue(new Error('Database error'));

        const result = await getProductMainImages(mockDb, ['product1']);

        expect(result).toEqual({});
    });
}); 