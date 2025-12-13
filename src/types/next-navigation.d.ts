// Type declarations for next/navigation
declare module 'next/navigation' {
  import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
  import { Params } from 'next/dist/server/request/params';
  import { ReadonlyURLSearchParams } from 'next/dist/client/components/readonly-url-search-params';

  export function useSearchParams(): ReadonlyURLSearchParams;
  export function usePathname(): string;
  export function useRouter(): AppRouterInstance;
  export function useParams<T extends Params = Params>(): T;
  export function useSelectedLayoutSegments(parallelRouteKey?: string): string[];
  export function useSelectedLayoutSegment(parallelRouteKey?: string): string | null;
  
  // Re-exports from navigation.react-server
  export function notFound(): never;
  export function forbidden(): never;
  export function unauthorized(): never;
  export function redirect(url: string, type?: "push" | "replace"): never;
  export function permanentRedirect(url: string, type?: "push" | "replace"): never;
  
  export type RedirectType = 'push' | 'replace';
  export class ReadonlyURLSearchParams extends URLSearchParams {}
}