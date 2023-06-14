import { createReducer, on } from '@ngrx/store';
import { updateApiKey } from './api.actions';

const initialApiKey = '';
export const apiKeyReducer = createReducer(
  initialApiKey,
  on(updateApiKey, (state, action) => (state = action.apiKey))
);
