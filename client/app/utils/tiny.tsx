// import React, { useEffect, useRef, useState } from 'react';
// import { Editor } from '@tinymce/tinymce-react';
// import { useDispatch, useSelector } from 'react-redux';
// import tinymce from 'tinymce/tinymce';
// type TinyEditorProps = {
//   editorContent: string;
//   setEditorContent: (details: string) => void;
// };

// const TinyEditor = ({ editorContent, setEditorContent }: TinyEditorProps) => {
//   const theme = useSelector((store: any) => store.theme) || 'default';

//   const editorRef: any = useRef(null);

//   const editorChangeHandler = (newValue: string, editor: any) => {
//     let fullDescriptionStr = editor.getContent();
//     // let fullDescriptionStr = editorRef.current.getContent();
//     setEditorContent(fullDescriptionStr);
//   };

//   useEffect(() => {
//     editorRef;
//   }, [theme]);

//   return (
//     <>
//       <Editor
//         // apiKey={process.env.REACT_APP_TINY_API_KEY}
//         apiKey='0gcfn1h3elqivm5lnmjtdghp58szb9uza1r0gsb0v3b4cj1z'
//         onInit={(evt, editor) => (editorRef.current = editor)}
//         initialValue='<p>This is the initial content of the editor.</p>'
   
        

//         init={{
//           height: 313,
//           width: '100%',
//           menubar: false,
//           plugins: [
//             'advlist autolink lists link image charmap print preview anchor',
//             'searchreplace visualblocks code fullscreen',
//             'insertdatetime',
//             'media',
//             'table',
//             'paste',
//             'help',
//             'wordcount'
//           ],
//           toolbar:
//             'undo redo | formatselect | ' +
//             'bold italic backcolor | alignleft aligncenter ' +
//             'alignright alignjustify | bullist numlist outdent indent | ' +
//             'removeformat | help',
//           content_style:
//             'body { font-family:Helvetica,Arial, sans-serif; font-size:14px}',
//           skin: `${theme === 'dark' ? 'oxide-dark' : 'oxide'}`,
//           content_css: `${theme === 'dark' ? 'dark' : 'oxide'}`,
//         }}
        
          
        
//           // skin: 'oxide-dark',
//           // content_css: 'dark',
//           // skin: window.matchMedia('(prefers-color-scheme: dark)').matches
//           //   ? 'oxide-dark'
//           //   : 'oxide',
//           // content_css: window.matchMedia('(prefers-color-scheme: dark)').matches
//           //   ? 'dark'
//           //   : 'default',
      
//         value={editorContent}
//         onEditorChange={editorChangeHandler}
//       />
//       {/* <button
//         className='mt-2 cursor-pointer appearance-none text-center block w-auto px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
//         onClick={log}
//       >
//         Save Product Detail
//       </button> */}
//     </>
//   );
// };

// export default TinyEditor;
// components/EditorComponent.tsx

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

type TinyEditorProps = {
  editorContent: string;
  setEditorContent: (details: string) => void;
};

const TinyEditor = ({ editorContent, setEditorContent }: TinyEditorProps) => {
  const editorRef: any = useRef(null);

    const editorChangeHandler = (newValue: string, editor: any) => {
      let fullDescriptionStr = editor.getContent();
      // let fullDescriptionStr = editorRef.current.getContent();
      setEditorContent(fullDescriptionStr);
    };
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY || "no-api-key"}
      init={{
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        // tinycomments_author: 'Author name',
        // mergetags_list: [
        //   { value: 'First.Name', title: 'First Name' },
        //   { value: 'Email', title: 'Email' },
        // ],

       
        ai_request: (request:any, respondWith:any) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
      }}
      value={editorContent}
      onEditorChange={editorChangeHandler}
      initialValue="Welcome to TinyMCE!"
    />
  );
};

export default TinyEditor;
