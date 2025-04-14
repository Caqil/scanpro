import { useState, useCallback } from 'react';

interface UploadProgressOptions {
  url: string;
  method?: 'POST' | 'PUT';
  headers?: Record<string, string>;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: Error | null;
  data: any | null;
}

const useFileUpload = () => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    data: null,
  });

  const uploadFile = useCallback(
    (file: File, formData: FormData, options: UploadProgressOptions) => {
      if (!file) return;

      setState({
        isUploading: true,
        progress: 0,
        error: null,
        data: null,
      });

      // Create XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progressPercent = Math.round((event.loaded / event.total) * 100);
          setState((prev) => ({ ...prev, progress: progressPercent }));
          if (options.onProgress) {
            options.onProgress(progressPercent);
          }
        }
      });

      // Handle response
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            setState({
              isUploading: false,
              progress: 100,
              error: null,
              data,
            });
            if (options.onSuccess) {
              options.onSuccess(data);
            }
          } catch (error) {
            setState({
              isUploading: false,
              progress: 0,
              error: new Error('Failed to parse response'),
              data: null,
            });
            if (options.onError) {
              options.onError(new Error('Failed to parse response'));
            }
          }
        } else {
          let errorMessage = 'Upload failed';
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            // Ignore parse error
          }
          
          setState({
            isUploading: false,
            progress: 0,
            error: new Error(errorMessage),
            data: null,
          });
          if (options.onError) {
            options.onError(new Error(errorMessage));
          }
        }
      });

      // Handle network errors
      xhr.addEventListener('error', () => {
        setState({
          isUploading: false,
          progress: 0,
          error: new Error('Network error occurred'),
          data: null,
        });
        if (options.onError) {
          options.onError(new Error('Network error occurred'));
        }
      });

      // Handle aborted uploads
      xhr.addEventListener('abort', () => {
        setState({
          isUploading: false,
          progress: 0,
          error: new Error('Upload cancelled'),
          data: null,
        });
        if (options.onError) {
          options.onError(new Error('Upload cancelled'));
        }
      });

      // Send the request
      xhr.open(options.method || 'POST', options.url, true);
      
      // Set custom headers if provided
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      xhr.send(formData);

      // Return abort function to allow cancelling the upload
      return () => {
        if (xhr && xhr.readyState !== 4) {
          xhr.abort();
        }
      };
    },
    []
  );

  return {
    ...state,
    uploadFile,
    resetUpload: () => {
      setState({
        isUploading: false,
        progress: 0,
        error: null,
        data: null,
      });
    },
  };
};

export default useFileUpload;