import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function useFileUpload() {
  const trpc = useTRPC();
  const createPresignedUrlMutationOptions =
    trpc.attachments.createPresignedUrl.mutationOptions();
  const { mutate: createPresignedUrl } = useMutation(
    createPresignedUrlMutationOptions,
  );

  const uploadFile = async (
    file: File,
  ): Promise<{
    key: string;
    url: string;
    name?: string;
    mimeType?: string;
    size?: number;
  }> => {
    return new Promise((resolve, reject) => {
      createPresignedUrl(
        {
          key: file.name,
          temporary: false,
        },
        {
          onSuccess: async ({ url, key }) => {
            try {
              // Upload file to S3
              await new Promise<void>((resolveUpload, rejectUpload) => {
                const xhr = new XMLHttpRequest();
                xhr.addEventListener("load", () => {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    resolveUpload();
                  } else {
                    rejectUpload(
                      new Error(
                        `Server error: ${xhr.status} ${xhr.statusText}`,
                      ),
                    );
                  }
                });
                xhr.addEventListener("error", () => {
                  rejectUpload(new Error("Network error while uploading file"));
                });
                xhr.addEventListener("timeout", () => {
                  rejectUpload(
                    new Error("Timeout exceeded while uploading file"),
                  );
                });
                xhr.open("PUT", url);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
              });

              resolve({
                key,
                url: URL.createObjectURL(file),
                name: file.name,
                mimeType: file.type,
                size: file.size,
              });
            } catch (uploadError) {
              reject(uploadError);
            }
          },
          onError: (error) => {
            reject(error);
          },
        },
      );
    });
  };

  return { uploadFile };
}
