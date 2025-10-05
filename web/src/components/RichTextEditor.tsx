import ReactQuill from "react-quill";
import { useMemo } from "react";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (html: string) => void;
}) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "blockquote", "code-block"],
        ["clean"],
      ],
      clipboard: { matchVisual: false },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "blockquote",
    "code-block",
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value || ""}
      onChange={(html: string) => onChange?.(html)}
      modules={modules}
      formats={formats}
    />
  );
}
