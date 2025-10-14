// @ts-nocheck

import {useCallback, useMemo} from "react";
import isHotkey from "is-hotkey";
import {createEditor, Descendant, Editor, Element as SlateElement, Transforms, Text} from "slate";
import {Slate, Editable, withReact, useSlate} from "slate-react";
import {withHistory} from "slate-history";
import {Button, Space, Tooltip} from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  CodeOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  FontSizeOutlined,
} from "@ant-design/icons";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
};

const HOTKEYS: Record<string, keyof TextMarks> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"] as const;
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"] as const;

type ParagraphElement = { type: "paragraph"; align?: Align; children: Descendant[] };
type HeadingOneElement = { type: "heading-one"; align?: Align; children: Descendant[] };
type HeadingTwoElement = { type: "heading-two"; align?: Align; children: Descendant[] };
type BlockQuoteElement = { type: "block-quote"; align?: Align; children: Descendant[] };
type ListItemElement = { type: "list-item"; children: Descendant[] };
type NumberedListElement = { type: "numbered-list"; align?: Align; children: Descendant[] };
type BulletedListElement = { type: "bulleted-list"; align?: Align; children: Descendant[] };
type CustomElement =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | BlockQuoteElement
  | ListItemElement
  | NumberedListElement
  | BulletedListElement;

type Align = typeof TEXT_ALIGN_TYPES[number];

type TextMarks = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const initialValue: Descendant[] = useMemo(() => {
    const html = value || "";
    const parsed = deserializeHtml(html);
    return parsed.length ? parsed : [{ type: "paragraph", children: [{ text: "" }] }];
  }, [value]);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(val: Descendant[]) => onChange?.(serializeHtml(val))}
    >
      <Toolbar />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        onKeyDown={(event: React.KeyboardEvent) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
}

function Toolbar() {
  const editor = useSlate();
  return (
    <Space style={{ marginBottom: 8, flexWrap: "wrap" }}>
      <Tooltip title="Heading 1"><Button size="small" onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, "heading-one"); }} icon={<FontSizeOutlined />} /></Tooltip>
      <Tooltip title="Heading 2"><Button size="small" onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, "heading-two"); }} icon={<FontSizeOutlined />} /></Tooltip>
      <Tooltip title="Bold"><Button size="small" type={isMarkActive(editor, "bold") ? "primary" : "default"} onMouseDown={(e) => { e.preventDefault(); toggleMark(editor, "bold"); }} icon={<BoldOutlined />} /></Tooltip>
      <Tooltip title="Italic"><Button size="small" type={isMarkActive(editor, "italic") ? "primary" : "default"} onMouseDown={(e) => { e.preventDefault(); toggleMark(editor, "italic"); }} icon={<ItalicOutlined />} /></Tooltip>
      <Tooltip title="Underline"><Button size="small" type={isMarkActive(editor, "underline") ? "primary" : "default"} onMouseDown={(e) => { e.preventDefault(); toggleMark(editor, "underline"); }} icon={<UnderlineOutlined />} /></Tooltip>
      <Tooltip title="Code"><Button size="small" type={isMarkActive(editor, "code") ? "primary" : "default"} onMouseDown={(e) => { e.preventDefault(); toggleMark(editor, "code"); }} icon={<CodeOutlined />} /></Tooltip>
      <Tooltip title="Numbered List"><Button size="small" onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, "numbered-list"); }} icon={<OrderedListOutlined />} /></Tooltip>
      <Tooltip title="Bulleted List"><Button size="small" onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, "bulleted-list"); }} icon={<UnorderedListOutlined />} /></Tooltip>
      <Tooltip title="Align Left"><Button size="small" type={isBlockActive(editor, "left", "align") ? "primary" : "default"} onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, "left"); }} icon={<AlignLeftOutlined />} /></Tooltip>
      <Tooltip title="Align Center"><Button size="small" type={isBlockActive(editor, "center", "align") ? "primary" : "default"} onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, "center"); }} icon={<AlignCenterOutlined />} /></Tooltip>
      <Tooltip title="Align Right"><Button size="small" type={isBlockActive(editor, "right", "align") ? "primary" : "default"} onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, "right"); }} icon={<AlignRightOutlined />} /></Tooltip>
      {/* Removed justify and quote buttons to avoid unavailable icons */}
    </Space>
  );
}

function isAlignType(format: string): format is Align {
  return (TEXT_ALIGN_TYPES as readonly string[]).includes(format);
}
function isListType(format: string) {
  return (LIST_TYPES as readonly string[]).includes(format as any);
}

function toggleBlock(editor: Editor, format: string) {
  const isActive = isBlockActive(editor, format, isAlignType(format) ? "align" : "type");
  const isList = isListType(format);

  Transforms.unwrapNodes(editor, {
    match: (n: Node) => !Editor.isEditor(n as any) && SlateElement.isElement(n as any) && isListType(((n as any).type) as any) && !isAlignType(format),
    split: true,
  });

  let newProperties: Partial<SlateElement & { align?: Align; type?: string }>;
  if (isAlignType(format)) {
    newProperties = { align: isActive ? undefined : (format as Align) };
  } else {
    newProperties = { type: isActive ? "paragraph" : isList ? "list-item" : format } as any;
  }
  Transforms.setNodes(editor, newProperties as any);

  if (!isActive && isList) {
    const block: any = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

function isBlockActive(editor: Editor, format: string, blockType: "type" | "align" = "type") {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: any) => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          if (blockType === "align" && "align" in (n as any)) {
            return (n as any).align === format;
          }
          return (n as any).type === format;
        }
        return false;
      },
    })
  );
  return !!match;
}

function toggleMark(editor: Editor, format: keyof TextMarks) {
  const isActive = isMarkActive(editor, format);
  if (isActive) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
}

function isMarkActive(editor: Editor, format: keyof TextMarks) {
  const marks: any = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

function Element({ attributes, children, element }: { attributes: any; children: any; element: CustomElement }) {
  const style: any = {};
  if ("align" in element && element.align) style.textAlign = element.align;
  switch (element.type) {
    case "block-quote":
      return <blockquote style={style} {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul style={style} {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 style={style} {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 style={style} {...attributes}>{children}</h2>;
    case "list-item":
      return <li style={style} {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol style={style} {...attributes}>{children}</ol>;
    default:
      return <p style={style} {...attributes}>{children}</p>;
  }
}

function Leaf({ attributes, children, leaf }: { attributes: any; children: any; leaf: Text & TextMarks }) {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.code) children = <code>{children}</code>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
}

// Serialization: Slate -> HTML (subset)
function serializeHtml(nodes: Descendant[]): string {
  return nodes.map((n) => serializeNode(n as any)).join("");
}

function serializeNode(node: any): string {
  if (Text.isText(node)) {
    let text = escapeHtml(node.text);
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    if (node.underline) text = `<u>${text}</u>`;
    if (node.code) text = `<code>${text}</code>`;
    return text;
  }
  const children = (node.children || []).map(serializeNode).join("");
  const style = node.align ? ` style="text-align:${node.align}"` : "";
  switch (node.type) {
    case "heading-one": return `<h1${style}>${children}</h1>`;
    case "heading-two": return `<h2${style}>${children}</h2>`;
    case "block-quote": return `<blockquote${style}>${children}</blockquote>`;
    case "numbered-list": return `<ol${style}>${children}</ol>`;
    case "bulleted-list": return `<ul${style}>${children}</ul>`;
    case "list-item": return `<li>${children}</li>`;
    default: return `<p${style}>${children}</p>`;
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Deserialization: HTML (subset) -> Slate
function deserializeHtml(html: string): Descendant[] {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;
  const result: Descendant[] = [];
  body.childNodes.forEach((n) => {
    const el = n as HTMLElement;
    const node = deserializeElement(el);
    if (node) result.push(node);
  });
  return result;
}

function deserializeElement(el: HTMLElement): Descendant | null {
  const styleAlign = (el.style?.textAlign || "") as Align | "";
  const children = Array.from(el.childNodes).map((cn) => deserializeChild(cn)).flat();
  const hasChildren = children.length ? children : [{ text: "" } as any];
  switch (el.nodeName) {
    case "H1": return { type: "heading-one", align: styleAlign || undefined, children: hasChildren } as any;
    case "H2": return { type: "heading-two", align: styleAlign || undefined, children: hasChildren } as any;
    case "BLOCKQUOTE": return { type: "block-quote", align: styleAlign || undefined, children: hasChildren } as any;
    case "OL": return { type: "numbered-list", align: styleAlign || undefined, children: hasChildren } as any;
    case "UL": return { type: "bulleted-list", align: styleAlign || undefined, children: hasChildren } as any;
    case "LI": return { type: "list-item", children: hasChildren } as any;
    case "P": return { type: "paragraph", align: styleAlign || undefined, children: hasChildren } as any;
    default:
      // Wrap stray text nodes into paragraph
      if (el.nodeType === Node.TEXT_NODE) {
        return { type: "paragraph", children: [{ text: (el.textContent || "") }] } as any;
      }
      // Fallback to paragraph with its text content
      return { type: "paragraph", children: [{ text: el.textContent || "" }] } as any;
  }
}

function deserializeChild(node: ChildNode): any {
  if (node.nodeType === Node.TEXT_NODE) {
    return [{ text: node.textContent || "" }];
  }
  if (!(node instanceof HTMLElement)) return [{ text: "" }];
  const el = node as HTMLElement;
  const children = Array.from(el.childNodes).map(deserializeChild).flat();
  switch (el.nodeName) {
    case "STRONG": return children.map((c: any) => ({ ...c, bold: true }));
    case "EM": return children.map((c: any) => ({ ...c, italic: true }));
    case "U": return children.map((c: any) => ({ ...c, underline: true }));
    case "CODE": return children.map((c: any) => ({ ...c, code: true }));
    case "LI": return [{ type: "list-item", children }];
    default:
      const block = deserializeElement(el);
      return block ? [block] : children;
  }
}
