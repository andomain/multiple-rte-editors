import { useCallback, useState } from 'react';
import {
    ContentState,
    convertFromRaw,
    Editor,
    EditorState,
    RawDraftContentState,
    RichUtils,
} from 'draft-js';

import { RTE_STYLE } from '../../constants/styles';

import styles from './RteEditor.module.css';
import 'draft-js/dist/Draft.css';

interface RteEditorProps {
    value: RawDraftContentState;
    onSelect: () => void;
    onChange: (content: ContentState) => void;
}

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
    const styleClickHandler = (type: string) => changeHandler(RichUtils.toggleInlineStyle(editorState, type));
    const clickBold = () => styleClickHandler(RTE_STYLE.BOLD);
    const clickItalic = () => styleClickHandler(RTE_STYLE.ITALIC);
    const clickUnderline = () => styleClickHandler(RTE_STYLE.UNDERLINE);

    return (
        <div className={styles.RteEditor}>
          <div className={styles.Buttons}>
            <button onClick={clickBold}>Bold</button>
            <button onClick={clickItalic}>Italic</button>
            <button onClick={clickUnderline}>Underline</button>
          </div>
            <Editor
                onFocus={onSelect}
                editorState={editorState}
                onChange={changeHandler}
                handleKeyCommand={handleKeyCommand}
            />
        </div>
    );
};

export default RteEditor;
