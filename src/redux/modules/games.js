const LOAD = 'seaBattle/games/LOAD';
const LOAD_SUCCESS = 'seaBattle/games/LOAD_SUCCESS';
const LOAD_FAILURE = 'seaBattle/games/LOAD_FAILURE';

const initialState = {
  data: [],
  loading: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.data.games,
      };
    case LOAD_FAILURE:
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

export const load = (user) => ({
  types: [LOAD, LOAD_SUCCESS, LOAD_FAILURE],
  promise: (client) => client.get(`../users/${user}`),
});
