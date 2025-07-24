1. API & Props Design
Strongly‑typed props
Replace your loose FileUploadProps with a fully described interface, e.g.:

ts
Copy
Edit
interface FileUploadProps {
  /** Show progress bar under each file */
  progress?: boolean;
  /** MIME types or file extensions to accept */
  accept?: string;
  /** Called when files are selected (before upload) */
  onSelectFile?: (files: File[]) => void;
  /** Override default upload logic */
  onUpload?: (
    files: File[],
    onProgress: (percent: number) => void
  ) => Promise<any>;
  /** Called per file on success, receives server response */
  onSuccess?: (file: File, response: any) => void;
  /** Called on any upload or network error */
  onError?: (error: unknown) => void;
  /** Label for the dropzone */
  label?: string;
  /** Tooltip text or disabled if undefined */
  tooltip?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
}
• Why: clear contract, IDE autocompletion, self‑documenting.
• Action: tighten component signature and default props.

2. Separation of Concerns
Extract hooks

useFileSelection for drag/drop + input logic

useUpload for upload + progress state

ts
Copy
Edit
const { files, handleInput, handleDrop, reset } = useFileSelection({ multiple, accept });
const { progress, uploading, upload } = useUpload(files, onUpload, onSuccess, onError);
• Why: easier to test, reuse, and maintain.
• Action: pull out side‑effects and state into custom hooks.

3. Styling & Variants
Use buttonVariants, inputVariants, etc., from shadcn/ui

Replace hard‑coded Tailwind classes with the component library’s variant APIs:

tsx
Copy
Edit
<Button variant="secondary" size="sm" disabled={...}>Choose Files</Button>
• Why: consistency across library, theme‑aware.
• Action: import and apply existing variant helpers.

4. Accessibility
Semantic roles & labels

Add aria-describedby linking dropzone to instructions.

Use <label> for file input to improve focus/activation.

Keyboard

Ensure onKeyDown handlers are on focusable elements, or use a <button>.

Progress

Use native <progress> element (Radix’s <Progress /> can wrap it) with role="progressbar", aria‑valuenow.

5. Performance
Batch state updates

Debounce onUploadProgress before calling setUploadProgress.

Lazy loading

Dynamically import heavy dependencies (e.g., axios) if rarely used.

Avoid rerenders

Memoize callbacks (useCallback) and derived values (useMemo).

6. Error Handling & UX
Validate file size & type before upload; show inline errors.

Fallbacks

Gracefully handle browsers without drag‐and‐drop.

Feedback

Show success toast or inline confirmation per file.

7. Testing & Documentation
Unit tests for hooks and edge cases (no files, server error).

Storybook stories demonstrating:

Single vs. multiple files

Custom onUpload override

Progress bar states

Docs.md: explain all props, events, example usage.

8. Contribution‑Ready Checklist
 TypeScript: all props & state fully typed, no any.

 Hook separation: logic extracted into reusable hooks.

 Styling: use shadcn/ui variant APIs, not ad‑hoc Tailwind.

 Accessibility: semantic HTML, ARIA attributes, keyboard support.

 Performance: debounce progress, memoize handlers.

 Error states: inline error messages, network‑error fallback.

 Testing: unit tests for selection, drag/drop, upload errors.

 Storybook: interactive demos for each prop combination.

 Documentation: complete prop table and usage examples in MD.

Implementing these will turn your component into a polished, composable piece that aligns with shadcn/ui’s standards and is ready for a community pull request.



const[selectedFile, setSelectedFile] = React.useState<File | null>(null);
const file = useRef<HTMLInputElement>(null);
const [isActiveDrag, setIsActiveDrag] = React.useState(false);

const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === "dragenter" || e.type === "dragover") {
    setIsActiveDrag(true);
  } else if (e.type === "dragleave") {
    setIsActiveDrag(false);
  }
}
const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
  setIsActiveDrag(false);
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    setSelectedFile(e.dataTransfer.files[0]);
  } else {
    setSelectedFile(null);
  }
}
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    setSelectedFile(e.target.files[0]);
  } else {
    setSelectedFile(null);
  }
}
const handleUpload = async () => {
  if (!selectedFile) {
    alert("Please select a file first");
    return;
  }
  const formData = new FormData();
  formData.append("file", selectedFile);
  try {
    const response = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("File uploaded successfully:", response.data);
   if(response.status === 200){
alert("File uploaded successfully");
   } 
    setSelectedFile(null); // Clear the selected file after upload
    file.current.value = ''
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Error uploading file");
  }}
  return (
  <Card >
    <CardHeader>
      <CardTitle>File Upload</CardTitle>
    </CardHeader>
    <CardContent>
    <div
 onDragEnter={handleDrag}
 onDragLeave={handleDrag}
 onDragOver={handleDrag}
 onDrop={handleDrop}
 onClick={()=>file.current?.click()}

     className='flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg mb-4 w-60'>
      <UploadCloudIcon/>
     { isActiveDrag ? (
        <p className="text-gray-500">Drop your file here</p>):
        <p className="text-gray-500">Drag and drop a file here or click to select</p>
        }
    </div>
      <Input 
      className='hidden'
      onChange={handleChange}
      ref={file}
      type="file" />
      {selectedFile ? (
        <div className="mt-4">
          <p className="text-gray-700">Selected file: {selectedFile.name}</p>
        </div>
      ): (
        <p className="text-gray-500">No file selected</p> )}
      <Button 
     onClick={handleUpload}
      className="mt-4" variant="default">
        Upload</Button>
    </CardContent>

  </Card>
  )