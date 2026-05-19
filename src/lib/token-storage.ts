const REFRESH_KEY = 'panacea.refresh';

export const tokenStorage = {
  getRefresh(): string | null {
    return sessionStorage.getItem(REFRESH_KEY);
  },
  setRefresh(token: string): void {
    sessionStorage.setItem(REFRESH_KEY, token);
  },
  clearRefresh(): void {
    sessionStorage.removeItem(REFRESH_KEY);
  },
};
