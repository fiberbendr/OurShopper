import { useEffect, useRef, useState } from "react";
import { queryClient } from "@/lib/queryClient";

export function useWebSocket() {
  const [status, setStatus] = useState<"synced" | "syncing" | "offline">("offline");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    function connect() {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setStatus("synced");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "purchase_added" || data.type === "purchase_deleted") {
            setStatus("syncing");
            queryClient.invalidateQueries({ queryKey: ["/api/purchases"] });
            setTimeout(() => setStatus("synced"), 500);
          }
        } catch (error) {
          console.error("WebSocket message error:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus("offline");
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setStatus("offline");
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect...");
          connect();
        }, 3000);
      };
    }

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { status };
}
