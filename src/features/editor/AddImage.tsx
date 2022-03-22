import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import { ImageEditorPlugin } from '@draft-js-plugins/image';

interface AddImageProps {
    editorState: EditorState;
    plugin: ImageEditorPlugin;
    onUpdate: (editorState: EditorState) => void;
}

const CHECKMARK = '\u2714';
const CROSS = '\u2715';

// Dummy behaviour pass URL of a hosted image rather than local uploading
// Suggested http://via.placeholder.com/320x120
const AddImage = ({ editorState, plugin, onUpdate }: AddImageProps) => {
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const toggleOpen = () => {
        setOpen((prev) => !prev);
    };

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        setImageUrl(value);
    };

    const updateHandler = () => {
        onUpdate(plugin.addImage(editorState, imageUrl, {}));
    };

    const cancelHandler = () => {
        setOpen(false);
        setImageUrl('');
    };

    return (
        <>
            <button type="button" onClick={toggleOpen}>
                Img
            </button>
            {open && (
                <>
                    <input
                        type="text"
                        placeholder="Image url..."
                        onChange={changeHandler}
                    />
                    <button type="button" onClick={updateHandler}>
                        {CHECKMARK}
                    </button>
                    <button type="button" onClick={cancelHandler}>
                        {CROSS}
                    </button>
                </>
            )}
        </>
    );
};

export default AddImage;
