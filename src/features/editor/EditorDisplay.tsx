import classNames from 'classnames';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../app/store';

import styles from './RteEditor.module.css';

const EditorDisplay = () => {
    const { active, editors } = useSelector(
        (state: RootState) => state.editor,
        shallowEqual
    );

    return (
        <div>
            {Object.entries(editors).map(([id, content]) => (
                <div
                    key={id}
                    className={classNames(styles.display, {
                        [styles.active]: id === active,
                    })}
                    dangerouslySetInnerHTML={{
                        __html: stateToHTML(convertFromRaw(content)),
                    }}
                />
            ))}
        </div>
    );
};

export default EditorDisplay;
