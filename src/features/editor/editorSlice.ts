import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { convertToRaw, EditorState as DraftEditorState, RawDraftContentState } from "draft-js";
import { v4 as uuid } from 'uuid';

// Types/Interfaces
type RawEditors = { [key: string]: RawDraftContentState };

type GlobalEditorsState = { editors: RawEditors, active: string | null }

type EditorPayload = { id: string, content: RawDraftContentState };

// Thunks
export const initEditorState = createAsyncThunk(
  'editor/init',
  async () => {
    const result = await new Promise((resolve) => {
      const editors = JSON.parse(localStorage.getItem('editorDb') || '{}');

      // Mock some DB latency
      setTimeout(() => {
        resolve(editors);
      }, 1500);
    });

    return result;
  }
);

// Slice
const initialState: GlobalEditorsState = {
  editors: {},
  active: null,
}

export const editorSlice = createSlice({
  name: 'editors',
  initialState,
  reducers: {
    addEditor: (state) => {
      const id = uuid();

      state.active = id;
      state.editors[id] = convertToRaw(DraftEditorState.createEmpty().getCurrentContent());
    },
    removeEditor: (state, action: PayloadAction<string>) => {
      delete state.editors[action.payload];
    },
    updateEditor: (state, action: PayloadAction<EditorPayload>) => {
      state.editors[action.payload.id] = action.payload.content;
    },
    setActiveEditor: (state, action: PayloadAction<string>) => {
      state.active = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initEditorState.pending, (state, action: any) => {
      // TODO: Handle loading
    })
    builder.addCase(initEditorState.fulfilled, (state, action: any) => {
      state.editors = action.payload;
    })
  },
});

// Selectors

// Thunks

// Actions
export const { addEditor, removeEditor, updateEditor, setActiveEditor } = editorSlice.actions;

// Reducer
export default editorSlice.reducer;
