export const delay = (ms: number) =>
new Promise((resolve) => setTimeout(resolve, ms));

export const apiClient = {
  get: async <T,>(url: string, mockData: T): Promise<T> => {
    await delay(800); // Simulate network latency
    return mockData;
  },
  post: async <T, D>(url: string, data: D, mockResponse: T): Promise<T> => {
    await delay(1200); // Simulate AI processing time
    return mockResponse;
  }
};