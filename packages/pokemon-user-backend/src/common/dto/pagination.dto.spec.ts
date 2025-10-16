import { PaginatedResponseDto } from './pagination.dto';

describe('PaginatedResponseDto', () => {
  const mockData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  describe('constructor', () => {
    it('should create paginated response with correct metadata', () => {
      const response = new PaginatedResponseDto(mockData, 1, 10, 100);

      expect(response.data).toEqual(mockData);
      expect(response.meta).toEqual({
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it('should calculate total pages correctly for exact division', () => {
      const response = new PaginatedResponseDto(mockData, 2, 5, 20);

      expect(response.meta.totalPages).toBe(4);
    });

    it('should calculate total pages correctly with remainder', () => {
      const response = new PaginatedResponseDto(mockData, 3, 7, 22);

      expect(response.meta.totalPages).toBe(4); // Math.ceil(22/7) = 4
    });

    it('should handle empty data array', () => {
      const response = new PaginatedResponseDto([], 1, 10, 0);

      expect(response.data).toEqual([]);
      expect(response.meta).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it('should handle single page scenario', () => {
      const smallData = [{ id: 1, name: 'Only item' }];
      const response = new PaginatedResponseDto(smallData, 1, 10, 1);

      expect(response.meta.page).toBe(1);
      expect(response.meta.limit).toBe(10);
      expect(response.meta.total).toBe(1);
      expect(response.meta.totalPages).toBe(1);
    });

    it('should handle large page size', () => {
      const response = new PaginatedResponseDto(mockData, 1, 100, 50);

      expect(response.meta.totalPages).toBe(1);
    });

    it('should preserve data type and structure', () => {
      interface TestItem {
        id: number;
        name: string;
        active: boolean;
      }

      const typedData: TestItem[] = [
        { id: 1, name: 'Test', active: true },
        { id: 2, name: 'Test 2', active: false },
      ];

      const response = new PaginatedResponseDto(typedData, 1, 10, 2);

      expect(response.data).toEqual(typedData);
      expect(response.data[0].active).toBe(true);
      expect(response.data[1].active).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle zero total items', () => {
      const response = new PaginatedResponseDto([], 1, 10, 0);

      expect(response.meta.totalPages).toBe(0);
    });

    it('should handle high page numbers', () => {
      const response = new PaginatedResponseDto([], 999, 10, 100);

      expect(response.meta.page).toBe(999);
      expect(response.meta.totalPages).toBe(10);
    });

    it('should handle limit of 1', () => {
      const response = new PaginatedResponseDto([mockData[0]], 5, 1, 100);

      expect(response.meta.limit).toBe(1);
      expect(response.meta.totalPages).toBe(100);
    });
  });
});
