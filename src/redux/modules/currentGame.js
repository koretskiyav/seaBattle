const CREATE = 'seaBattle/currentGame/CREATE';
const CREATE_SUCCESS = 'seaBattle/currentGame/CREATE_SUCCESS';
const CREATE_FAILURE = 'seaBattle/currentGame/CREATE_FAILURE';

const CHOOSE = 'seaBattle/currentGame/CHOOSE';
const CHOOSE_SUCCESS = 'seaBattle/currentGame/CHOOSE_SUCCESS';
const CHOOSE_FAILURE = 'seaBattle/currentGame/CHOOSE_FAILURE';

const READY = 'seaBattle/currentGame/READY';
const READY_SUCCESS = 'seaBattle/currentGame/READY_SUCCESS';
const READY_FAILURE = 'seaBattle/currentGame/READY_FAILURE';

const LOAD = 'seaBattle/currentGame/LOAD';
const LOAD_SUCCESS = 'seaBattle/currentGame/LOAD_SUCCESS';
const LOAD_FAILURE = 'seaBattle/currentGame/LOAD_FAILURE';

const MOVE = 'seaBattle/currentGame/MOVE';
const MOVE_SUCCESS = 'seaBattle/currentGame/MOVE_SUCCESS';
const MOVE_FAILURE = 'seaBattle/currentGame/MOVE_FAILURE';

const initialState = {
  data: {},
  loading: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE:
    case CHOOSE:
    case READY:
    case LOAD:
    case MOVE:
      return {
        ...state,
        loading: true,
      };
    case CREATE_SUCCESS:
    case CHOOSE_SUCCESS:
    case READY_SUCCESS:
    case LOAD_SUCCESS:
    case MOVE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.data.game,
      };
    case CREATE_FAILURE:
    case CHOOSE_FAILURE:
    case READY_FAILURE:
    case LOAD_FAILURE:
    case MOVE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export const create = (user) => ({
  types: [CREATE, CREATE_SUCCESS, CREATE_FAILURE],
  promise: (client) => client.post(`../users/${user}`),
});

export const choose = (gameId, user) => ({
  types: [CHOOSE, CHOOSE_SUCCESS, CHOOSE_FAILURE],
  promise: (client) => client.post(`../users/${user}/game/${gameId}`),
});

export const ready = (gameId, user) => ({
  types: [READY, READY_SUCCESS, READY_FAILURE],
  promise: (client) => client.get(`../users/${user}/game/${gameId}`),
});

export const load = (gameId, user) => ({
  types: [LOAD, LOAD_SUCCESS, LOAD_FAILURE],
  promise: (client) => client.get(`../game/${gameId}/users/${user}`),
});

export const move = (gameId, user, place) => ({
  types: [MOVE, MOVE_SUCCESS, MOVE_FAILURE],
  promise: (client) => client.post(`../users/${user}/game/${gameId}/place/${place}`),
});
