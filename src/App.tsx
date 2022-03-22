import { useAppDispatch } from './app/hooks';
import {
    addEditor,
    initEditorState,
    setActiveEditor,
    updateEditor,
} from './features/editor/editorSlice';
import { RootState } from './app/store';

import RteEditor from './features/editor/RteEditor';

import { ContentState, convertToRaw } from 'draft-js';
import EditorDisplay from './features/editor/EditorDisplay';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import './App.css';

function App() {
    const editorState = useSelector((state: RootState) => state.editor);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initEditorState());
    }, [dispatch]);

    // Write editor state to Mock DB/localstorage
    useEffect(() => {
        localStorage.setItem('editorDb', JSON.stringify(editorState.editors));
    }, [editorState]);

    // Update editor by ID
    const changeHandler = (id: string) => (content: ContentState) => {
        dispatch(updateEditor({ id, content: convertToRaw(content) }));
    };

    // Select active editor
    const selectHandler = (id: string) => {
        dispatch(setActiveEditor(id));
    };

    return (
        <div className="App">
            <div>
                <button type="button" onClick={() => dispatch(addEditor())}>
                    Add editor
                </button>
            </div>
            <div>
                {Object.entries(editorState.editors).map(([id, editor]) => (
                    <RteEditor
                        key={id}
                        value={editor}
                        onChange={changeHandler(id)}
                        onSelect={() => selectHandler(id)}
                    />
                ))}
            </div>
            <div>
                <EditorDisplay />
            </div>
        </div>
    );
}

export default App;
