export type TextType = {
  type: "text";
  text: string;
};
export type MentionAtomType = {
  type: "mentionAtom";
  attrs: {
    id: string;
    name: "characters" | "blueprint_instances" | "documents" | "maps" | "graphs" | "events" | "words";
    label: string;
    alterId: string | null;
    projectId?: string;
  };
};
export type ImageType = {
  type: "image";
  attrs: {
    alt: string;
    src: string;
    width: number;
    height: number;
  };
};

export type ParagraphType = {
  type: "paragraph";
  attrs: {
    style: string;
    nodeIndent: null | "left" | "right";
    nodeLineHeight: null | "single" | "double";
    nodeTextAlignment: "left" | "center" | "right";
    content: (TextType | MentionAtomType | ImageType)[];
  };
  content?: (TextType | MentionAtomType | ImageType)[];
};

export type HeadingType = {
  type: "heading";
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    style: string;
  };
  content: TextType[];
};

export type DocumentContentType = {
  type: "doc";
  content?: (ParagraphType | HeadingType)[];
};
