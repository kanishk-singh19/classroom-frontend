import { Trash, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { UploadWidgetProps, UploadWidgetValue } from "@/types";

// Get Cloudinary config from environment with fallbacks
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

function UploadWidget({
  value = null,
  onChange,
  disabled = false,
}: UploadWidgetProps) {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);
  const retryCountRef = useRef(0);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isWidgetReady, setIsWidgetReady] = useState(false);

  // Always keep latest onChange
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync external value → internal preview
  useEffect(() => {
    setPreview(value);
    if (!value) {
      setDeleteToken(null);
    }
  }, [value]);

  // Initialize Cloudinary widget (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Cloudinary config is available
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.error("Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.");
      return;
    }

    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false;

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "uploads",
          maxFileSize: 5_000_000,
          clientAllowedFormats: ["png", "jpg", "jpeg"],
        },
        (error, result) => {
          if (!error && result.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };

            setPreview(payload);
            setDeleteToken(result.info.delete_token ?? null);
            onChangeRef.current?.(payload);
          }
        }
      );

      setIsWidgetReady(true);
      return true;
    };

    if (initializeWidget()) return;

    // Max 20 retries (10 seconds max)
    const MAX_RETRIES = 20;
    const intervalId = window.setInterval(() => {
      if (retryCountRef.current >= MAX_RETRIES) {
        window.clearInterval(intervalId);
        console.error("Failed to initialize Cloudinary widget after maximum retries.");
        return;
      }
      
      if (initializeWidget()) {
        window.clearInterval(intervalId);
      } else {
        retryCountRef.current++;
      }
    }, 500);

    return () => {
      window.clearInterval(intervalId);
      // Clean up widget on unmount
      if (widgetRef.current) {
        widgetRef.current = null;
      }
    };
  }, []);

  const openWidget = () => {
    if (!disabled && isWidgetReady && widgetRef.current) {
      widgetRef.current.open();
    }
  };

  const removeFromCloudinary = async () => {
    if (!preview) return;

    setIsRemoving(true);

    try {
      if (deleteToken) {
        const params = new URLSearchParams();
        params.append("token", deleteToken);

        await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
          {
            method: "POST",
            body: params,
          }
        );
      } else {
        console.warn("No delete token available. Image may still exist on Cloudinary.");
      }
    } catch (error) {
      console.error("Failed to remove image from Cloudinary", error);
    } finally {
      setPreview(null);
      setDeleteToken(null);
      onChangeRef.current?.(null);
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="Uploaded file" />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={removeFromCloudinary}
            disabled={isRemoving || disabled}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      ) : (
        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              <p>Click to upload photo</p>
              <p>PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadWidget;