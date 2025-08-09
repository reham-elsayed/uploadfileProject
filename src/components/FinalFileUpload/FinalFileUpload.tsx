import * as React from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { UploadIcon } from "lucide-react"

interface FileUploadProps extends DropzoneOptions {
  value?: File[]
  onValueChange?: (files: File[]) => void
  progress?: Record<string, number>
  className?: string
}

const FinalFileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ value = [], onValueChange, progress = {}, className, ...props }, ref) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        onValueChange?.([...value, ...acceptedFiles])
      },
      ...props
    })

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-dashed p-4 transition-colors",
          isDragActive ? "bg-primary/10" : "bg-muted/20",
          className
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <UploadIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-center text-sm text-muted-foreground">
            {isDragActive
              ? "Drop files here"
              : "Drag & drop or click to browse"}
          </p>
          
          {value.length > 0 && (
            <div className="mt-4 w-full space-y-2">
              {value.map((file) => (
                <div key={file.name}>
                  <div className="flex justify-between">
                    <span className="truncate text-sm">{file.name}</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onValueChange?.(value.filter(f => f !== file))
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  {progress[file.name] !== undefined && (
                    <Progress value={progress[file.name]} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
)
export default FinalFileUpload