"use client";

import {
  isServer,
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppContext } from "./context-provider";
import React from "react";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey[];
      successMsg?: string;
      errorMsg?: string;
      closeOverlay?: boolean;
    };
  }
}

function createQueryClient(opts?: { closeOverlay?: () => void }) {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (_data, _vars, _ctx, mutation) => {
        const { successMsg, invalidatesQuery, closeOverlay } =
          mutation.meta ?? {};

        if (successMsg) {
          toast.success(successMsg);
        }

        if (!!invalidatesQuery?.length) {
          invalidatesQuery.forEach((key) => {
            queryClient.invalidateQueries({
              queryKey: key,
              exact: false,
            });
          });
        }

        if (closeOverlay) {
          opts?.closeOverlay?.();
        }
      },
      onError: (_err, _vars, _ctx, mutation) => {
        const msg = mutation.meta?.errorMsg;
        if (msg) toast.error(msg);
      },
    }),
  });

  return queryClient;
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient(opts?: { closeOverlay?: () => void }) {
  if (isServer) {
    // Server: always make a new query client
    return createQueryClient(opts);
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = createQueryClient(opts);
    return browserQueryClient;
  }
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setLoading, clearLoading, closeOverlay } = useAppContext();

  const queryClientRef = React.useRef<QueryClient | null>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = getQueryClient({ closeOverlay });

    queryClientRef.current.setDefaultOptions({
      mutations: {
        onMutate: () => setLoading(),
        onSettled: () => clearLoading(),
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
}
