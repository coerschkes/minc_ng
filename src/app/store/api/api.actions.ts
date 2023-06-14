import { createAction, props } from '@ngrx/store';

export const updateApiKey = createAction(
  '[Api] Update Api Key',
  props<{ apiKey: string }>()
);
