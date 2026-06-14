import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Submission } from '@/types/submission';
import type { RootState } from '@/store';

type NewSubmission = Omit<Submission, 'id' | 'createdAt'>;

interface SubmissionsState {
  items: Submission[];
  lastAddedId: string | null;
}

const initialState: SubmissionsState = {
  items: [],
  lastAddedId: null,
};

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    addSubmission: {
      reducer(state, action: PayloadAction<Submission>) {
        state.items.unshift(action.payload);
        state.lastAddedId = action.payload.id;
      },
      prepare(submission: NewSubmission) {
        return {
          payload: {
            ...submission,
            id: nanoid(),
            createdAt: Date.now(),
          },
        };
      },
    },
  },
});

export const { addSubmission } = submissionsSlice.actions;

export const selectSubmissions = (state: RootState) => state.submissions.items;
export const selectLastAddedId = (state: RootState) => state.submissions.lastAddedId;

export default submissionsSlice.reducer;
