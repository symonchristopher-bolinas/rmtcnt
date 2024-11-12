import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Include the styles for React-Quill

const RichTextEditor = ({ initialContent, onContentChange }) => {
  const [content, setContent] = useState(initialContent || '');

  // When the initialContent changes (e.g., when loading a post for editing), update the state
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (value) => {
    setContent(value);
    if (onContentChange) {
      onContentChange(value); // Propagate the change up to the parent component
    }
  };

  const editorStyles = {
    minHeight: '175px',
    resize: 'vertical',
  };

  return (
    <ReactQuill value={content} onChange={handleContentChange} style={editorStyles} />
  );
};

export default RichTextEditor;
