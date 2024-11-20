/**
 * Retrieves the value of a specific cookie.
 * @param name - The name of the cookie to retrieve.
 * @returns The cookie value or undefined if not found.
 */
export const getCookieValue = (name: string): string | undefined => {
    if (typeof document === 'undefined') {
      console.warn('getCookieValue called on the server.');
      return undefined;
    }
  
    const matches = document.cookie.match(new RegExp(
      `(?:^|; )${name.replace(/([.$?*|{}()[]\/+^])/g, '\\$1')}=([^;]*)`
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };
  