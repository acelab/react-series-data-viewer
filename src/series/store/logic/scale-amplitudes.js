// @flow

import * as R from 'ramda';
import {Observable} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {createAction} from 'redux-actions';
import {setAmplitudeScale} from '../state/bounds';
import type {State} from '../state/bounds';
import {updateViewedChunks} from './fetch-chunks';

export const SET_AMPLITUDES_SCALE = 'SET_AMPLITUDES_SCALE';
export const setAmplitudesScale = createAction(SET_AMPLITUDES_SCALE);
export const RESET_AMPLITUDES_SCALE = 'RESET_AMPLITUDES_SCALE';
export const resetAmplitudesScale = createAction(RESET_AMPLITUDES_SCALE);
export type Action = ((any) => void) => void;

export const createScaleAmplitudesEpic = (fromState: any => State) => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<Action> => {
  return action$.pipe(
    ofType(SET_AMPLITUDES_SCALE),
    Rx.map(R.prop('payload')),
    Rx.withLatestFrom(state$),
    Rx.map(([payload, state]) => {
      const scale = payload;
      const amplitudeScale = fromState(state);

      return (dispatch) => {
        dispatch(setAmplitudeScale(scale*amplitudeScale));
        dispatch(updateViewedChunks());
      };
    })
  );
};

export const createResetAmplitudesEpic = (fromState: any => State) => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<Action> => {
  return action$.pipe(
    ofType(RESET_AMPLITUDES_SCALE),
    Rx.map(() => {
      return (dispatch) => {
        dispatch(setAmplitudeScale());
        dispatch(updateViewedChunks());
      };
    })
  );
};
