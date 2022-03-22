import { useCallback, useState } from 'react';
import {
    ContentState,
    convertFromRaw,
    EditorState,
    RawDraftContentState,
    RichUtils,
} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';

import AddImage from './AddImage';
import { RTE_STYLE } from '../../constants/styles';

import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/image/lib/plugin.css';

import styles from './RteEditor.module.css';

interface RteEditorProps {
    value: RawDraftContentState;
    onSelect: () => void;
    onChange: (content: ContentState) => void;
}

const imagePlugin = createImagePlugin();

// TODO: Implement image styles to identify any bottlenecks
const RteEditor = ({ value, onChange, onSelect }: RteEditorProps) => {
    // Init local state with current store value
    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(convertFromRaw(value))
    );

    // Set local editor state and pass content up to App for storage
    const changeHandler = useCallback(
        (editorState: EditorState) => {
            setEditorState(editorState);
            onChange(editorState.getCurrentContent());
        },
        [onChange]
    );

    // Simple key command helper utility from DraftJS
    // TODO: Probably make a callback
    const handleKeyCommand = (command: string, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            changeHandler(newState);
            return 'handled';
        }

        return 'not-handled';
    };

    // Handlers
    // TODO: Definitely make simple handlers CB's so they don't recalculate on each render
    const styleClickHandler = (type: string) =>
        changeHandler(RichUtils.toggleInlineStyle(editorState, type));
    const clickBold = () => styleClickHandler(RTE_STYLE.BOLD);
    const clickItalic = () => styleClickHandler(RTE_STYLE.ITALIC);
    const clickUnderline = () => styleClickHandler(RTE_STYLE.UNDERLINE);

    return (
        <div className={styles.RteEditor}>
            <div className={styles.Buttons}>
                <button onClick={clickBold}>Bold</button>
                <button onClick={clickItalic}>Italic</button>
                <button onClick={clickUnderline}>Underline</button>
                <AddImage editorState={editorState} plugin={imagePlugin} onUpdate={changeHandler} />
            </div>
            <Editor
                onFocus={onSelect}
                editorState={editorState}
                onChange={changeHandler}
                handleKeyCommand={handleKeyCommand}
                plugins={[imagePlugin]}
            />
        </div>
    );
};

export default RteEditor;
