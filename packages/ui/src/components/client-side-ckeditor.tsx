// components/client-side-custom-editor.js
'use client' // Required only in App Router.

import dynamic from 'next/dynamic';

const ClientSideCKEditor = dynamic(() => import('./ckeditor'), { ssr: false });

export default ClientSideCKEditor;
