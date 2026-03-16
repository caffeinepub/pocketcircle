import { HttpAgent } from "@icp-sdk/core/agent";
import { useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

export function useStorageUpload(): {
  uploadImage: (
    file: File,
    onProgress?: (pct: number) => void,
  ) => Promise<string>;
  isUploading: boolean;
} {
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage(
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<string> {
    setIsUploading(true);
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const { hash } = await storageClient.putFile(bytes, onProgress);
      const url = await storageClient.getDirectURL(hash);
      return url;
    } catch (err) {
      console.warn("Blob upload failed, falling back to data URL", err);
      // Convert to base64 data URL so it persists across page reloads
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    } finally {
      setIsUploading(false);
    }
  }

  return { uploadImage, isUploading };
}
