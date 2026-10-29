"use client";

import {
  type DataSnapshot,
  getDatabase,
  onValue,
  ref,
} from "firebase/database";
import { useEffect, useEffectEvent, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";

interface RealtimeSubscriptionState<T> {
  path: string;
  data: T | undefined;
  error: Error | undefined;
}

interface UseRealtimeSubscriptionResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

/**
 * Subscribes to the Realtime Database value at `path` and parses each snapshot.
 * Pass `undefined` to stay unsubscribed (not loading, no data).
 *
 * Results are stored together with the path they came from, so a change of
 * path reads as loading (and drops the previous path's data and error) during
 * render, without resetting state from inside the effect.
 */
export function useRealtimeSubscription<T>(
  path: string | undefined,
  parse: (snapshot: DataSnapshot) => T,
): UseRealtimeSubscriptionResult<T> {
  const [state, setState] = useState<RealtimeSubscriptionState<T>>();

  const onSnapshot = useEffectEvent(
    (snapshotPath: string, snapshot: DataSnapshot) => {
      setState({ path: snapshotPath, data: parse(snapshot), error: undefined });
    },
  );
  const onError = useEffectEvent((errorPath: string, error: Error) => {
    setState((prev) => ({
      path: errorPath,
      data: prev?.path === errorPath ? prev.data : undefined,
      error,
    }));
  });

  useEffect(() => {
    if (path === undefined) return;
    return onValue(
      ref(getDatabase(getClientApp()), path),
      (snapshot) => {
        onSnapshot(path, snapshot);
      },
      (error) => {
        onError(path, error);
      },
    );
  }, [path]);

  const current =
    path !== undefined && state?.path === path ? state : undefined;
  return {
    data: current?.data,
    isLoading: path !== undefined && current === undefined,
    error: current?.error,
  };
}
