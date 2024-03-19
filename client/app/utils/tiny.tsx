import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useDispatch, useSelector } from 'react-redux';
import tinymce from 'tinymce/tinymce';
type TinyEditorProps = {
  editorContent: string;
  setEditorContent: (details: string) => void;
};

const TinyEditor = ({ editorContent, setEditorContent }: TinyEditorProps) => {
  const theme = useSelector((store: any) => store.theme) || 'default';

  const editorRef: any = useRef(null);

  const editorChangeHandler = (newValue: string, editor: any) => {
    let fullDescriptionStr = editor.getContent();
    // let fullDescriptionStr = editorRef.current.getContent();
    setEditorContent(fullDescriptionStr);
  };

  useEffect(() => {
    editorRef;
  }, [theme]);

  return (
    <>
      <Editor
        // apiKey={process.env.REACT_APP_TINY_API_KEY}
        apiKey='suupfl25ycnno16lor0unpo0nu5ra4v5forlrcx45kxx39vv'
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue='<p>This is the initial content of the editor.</p>'
        init={{
          height: 313,
          width: '100%',
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style:
            'body { font-family:Helvetica,Arial, sans-serif; font-size:14px}',
          skin: `${theme === 'dark' ? 'oxide-dark' : 'oxide'}`,
          content_css: `${theme === 'dark' ? 'dark' : 'oxide'}`,
          // skin: 'oxide-dark',
          // content_css: 'dark',
          // skin: window.matchMedia('(prefers-color-scheme: dark)').matches
          //   ? 'oxide-dark'
          //   : 'oxide',
          // content_css: window.matchMedia('(prefers-color-scheme: dark)').matches
          //   ? 'dark'
          //   : 'default',
        }}
        value={editorContent}
        onEditorChange={editorChangeHandler}
      />
      {/* <button
        className='mt-2 cursor-pointer appearance-none text-center block w-auto px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
        onClick={log}
      >
        Save Product Detail
      </button> */}
    </>
  );
};

export default TinyEditor;
