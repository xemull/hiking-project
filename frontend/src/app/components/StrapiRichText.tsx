// src/app/components/StrapiRichText.tsx

// This component takes Strapi's rich text JSON and renders it as HTML.
export default function StrapiRichText({ content }: { content: any[] }) {
  if (!content) {
    return null;
  }

  return (
    <div className="prose max-w-none">
      {content.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index}>
              {block.children.map((child: any, childIndex: number) => {
                if (child.type === 'text') {
                  let text = <span key={childIndex}>{child.text}</span>;
                  if (child.bold) text = <strong key={childIndex}>{text}</strong>;
                  if (child.italic) text = <em key={childIndex}>{text}</em>;
                  if (child.underline) text = <u key={childIndex}>{text}</u>;
                  return text;
                }
                return null;
              })}
            </p>
          );
        }
        // You can add more block types here later (e.g., 'heading', 'list')
        return null;
      })}
    </div>
  );
}