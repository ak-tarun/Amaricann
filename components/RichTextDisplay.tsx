
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ content, className }) => {
  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default RichTextDisplay;
