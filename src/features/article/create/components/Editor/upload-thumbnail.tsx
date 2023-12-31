import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FileRejection, useDropzone } from "react-dropzone";

type Timage = {
  src?: string | null;
  name?: string | null;
};

const UploadThumbnail = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [images, setImages] = useState<Timage>({});

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejection: FileRejection[]) => {
      // validation error msg
      fileRejection.map(({ errors }) => {
        errors.map((item) => {
          if (item.code === "file-too-large") {
            toast.error(`File is larger than 5 MB`);
          }
          if (item.code === "file-invalid-type") {
            toast.error(item.message);
          }
        });
      });

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          setImages({
            src: base64Data,
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );
  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg"],
    },
    maxFiles: 1,
    maxSize: 5242880,
  });

  return (
    <div className="mt-5">
      <Button
        size={"sm"}
        variant={"default"}
        onClick={() => {
          if (isOpen) return setOpen(false);
          setOpen(true);
        }}
      >
        {isOpen ? (
          <span>Hide cover</span>
        ) : images.src ? (
          <span>Open cover</span>
        ) : (
          <span>Upload cover ?</span>
        )}
      </Button>

      {isOpen && (
        <div className="mt-5 h-[150px] w-full border border-dashed">
          <div className="relative flex h-full items-center justify-center gap-2">
            <input {...getInputProps()} ref={inputRef} />

            {!images.src && (
              <div
                {...getRootProps()}
                className="absolute inset-0 flex items-center justify-center"
              >
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag drop an image here, or click to select an image</p>
                )}
              </div>
            )}

            {images.src && (
              <div className="relative h-[150px] w-[200px]">
                <Image
                  src={images.src}
                  alt={images.name as string}
                  fill
                  quality={50}
                  className="w-[150px] object-scale-down"
                />
              </div>
            )}

            <div className="flex gap-2">
              {images.src && (
                <>
                  <Button
                    onClick={() => inputRef.current?.click()}
                    variant={"outline"}
                    size={"sm"}
                  >
                    <p>Change</p>
                  </Button>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      setImages({ src: null });
                    }}
                    variant={"destructive"}
                    size={"sm"}
                  >
                    <p>Remove</p>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UploadThumbnail;