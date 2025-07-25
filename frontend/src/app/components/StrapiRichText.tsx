// src/app/components/StrapiRichText.tsx

// This component takes Strapi's rich text JSON and renders it as HTML.
export default function StrapiRichText({ content }: { content: any[] }) {
  if (!content) {
    return null;
  }

  // Helper function to render text with formatting
  const renderText = (child: any, childIndex: number) => {
    if (child.type === 'text') {
      let text = <span key={childIndex}>{child.text}</span>;
      if (child.bold) text = <strong key={childIndex}>{text}</strong>;
      if (child.italic) text = <em key={childIndex}>{text}</em>;
      if (child.underline) text = <u key={childIndex}>{text}</u>;
      return text;
    }
    return null;
  };

  // Helper function to render list items
  const renderListItem = (item: any, itemIndex: number) => {
    return (
      <li key={itemIndex}>
        {item.children.map((child: any, childIndex: number) => 
          renderText(child, childIndex)
        )}
      </li>
    );
  };

  return (
    <div className="prose max-w-none">
      {content.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index}>
              {block.children.map((child: any, childIndex: number) => 
                renderText(child, childIndex)
              )}
            </p>
          );
        }

        if (block.type === 'list') {
          // Handle both ordered and unordered lists
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
          
          return (
            <ListTag key={index}>
              {block.children.map((item: any, itemIndex: number) => {
                if (item.type === 'list-item') {
                  return renderListItem(item, itemIndex);
                }
                return null;
              })}
            </ListTag>
          );
        }

        // You can add more block types here later (e.g., 'heading')
        return null;
      })}
    </div>
  );
}