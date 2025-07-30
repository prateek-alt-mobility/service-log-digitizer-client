# Common Components

## FileUpload

A versatile file upload component with drag and drop support, file preview, and upload progress indicators.

### Features

- Drag and drop file upload
- File type validation
- File size limits
- Multiple file support
- Upload progress indicator
- Success/error states
- File preview with size information
- Ability to remove selected files

### Basic Usage

```tsx
import { FileUpload } from '@/components/common/file-upload';

// Basic usage
<FileUpload onFilesSelected={(files) => console.log(files)} />;
```

### Props

| Prop                 | Type                                            | Default                 | Description                                        |
| -------------------- | ----------------------------------------------- | ----------------------- | -------------------------------------------------- |
| `onFilesSelected`    | `(files: File[]) => void`                       | -                       | Function called when files are selected or dropped |
| `maxSize`            | `number`                                        | `5 * 1024 * 1024` (5MB) | Maximum file size in bytes                         |
| `multiple`           | `boolean`                                       | `false`                 | Allow multiple files to be selected                |
| `accept`             | `string`                                        | -                       | Accepted file types (e.g. "image/png,image/jpeg")  |
| `containerClassName` | `string`                                        | -                       | Custom class name for the container                |
| `showPreview`        | `boolean`                                       | `true`                  | Show file preview                                  |
| `progress`           | `number`                                        | `0`                     | Upload progress (0-100)                            |
| `status`             | `'idle' \| 'uploading' \| 'success' \| 'error'` | `'idle'`                | Upload status                                      |
| `errorMessage`       | `string`                                        | -                       | Error message to display                           |

### Examples

#### Image Upload with Type Restrictions

```tsx
<FileUpload
  accept="image/png,image/jpeg,image/gif"
  onFilesSelected={(files) => handleImageFiles(files)}
  maxSize={2 * 1024 * 1024} // 2MB
/>
```

#### Document Upload with Progress

```tsx
<FileUpload
  accept=".pdf,.doc,.docx"
  onFilesSelected={(files) => handleDocumentFiles(files)}
  status={uploadStatus}
  progress={uploadProgress}
  errorMessage={uploadStatus === 'error' ? 'Upload failed' : undefined}
/>
```

#### Multiple File Upload

```tsx
<FileUpload multiple onFilesSelected={(files) => handleMultipleFiles(files)} />
```

### Integration with React Hook Form

```tsx
<FormField
  control={form.control}
  name="files"
  render={({ field: { onChange, value, ...rest } }) => (
    <FormItem>
      <FormLabel>Upload Files</FormLabel>
      <FormControl>
        <FileUpload
          onFilesSelected={(files) => onChange(files.length > 0 ? files : null)}
          {...rest}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```
