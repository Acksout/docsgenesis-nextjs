'use client';

import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import {HeadingNode} from '@lexical/rich-text';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import React from 'react';
import {trefoil} from 'ldrs'

import {
    FloatingComposer,
    FloatingThreads,
    liveblocksConfig,
    LiveblocksPlugin,
    useEditorStatus
} from '@liveblocks/react-lexical'


trefoil.register()


import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin'
import {useThreads} from '@liveblocks/react/suspense';
import Comments from '../Comments';
import {DeleteModal} from '../DeleteModal';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.

function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}

export function Editor({roomId, currentUserType}: { roomId: string, currentUserType: UserType }) {
    const status = useEditorStatus();
    const {threads} = useThreads();

    const initialConfig = liveblocksConfig({
        namespace: 'Editor',
        nodes: [HeadingNode],
        onError: (error: Error) => {
            console.error(error);
            throw error;
        },
        theme: Theme,
        editable: currentUserType === 'editor',
    });


    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container size-full">
                <div className="flex min-w-full justify-between toolbar-wrapper">
                    <ToolbarPlugin/>
                    {currentUserType === 'editor' && <DeleteModal roomId={roomId}/>}
                </div>

                <div className="flex flex-col items-center justify-start editor-wrapper">
                    {status === 'not-loaded' || status === 'loading' ?
                        <div className="flex justify-center items-center h-screen">
                            <l-trefoil
                                size="40"
                                stroke="4"
                                stroke-length="0.15"
                                bg-opacity="0.1"
                                speed="1.4"
                                color="white"
                            />
                        </div> : (
                            <div
                                className="relative mb-5 h-fit w-full shadow-md editor-inner min-h-[1100px] max-w-[800px] lg:mb-10">
                                <RichTextPlugin
                                    contentEditable={
                                        <ContentEditable className="h-full editor-input"/>
                                    }
                                    placeholder={<Placeholder/>}
                                    ErrorBoundary={LexicalErrorBoundary}
                                />
                                {currentUserType === 'editor' && <FloatingToolbarPlugin/>}
                                <HistoryPlugin/>
                                <AutoFocusPlugin/>
                            </div>
                        )}

                    <LiveblocksPlugin>
                        <FloatingComposer className="w-[350px]"/>
                        <FloatingThreads threads={threads}/>
                        <Comments/>
                    </LiveblocksPlugin>
                </div>
            </div>
        </LexicalComposer>
    );
}
