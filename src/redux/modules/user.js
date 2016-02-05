const SET_USER = 'seaBattle/user/SET_USER';

const initialState = '';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_USER:
      return action.name;
    default:
      return state;
  }
}

export const setUser = (name) => ({
  type: SET_USER,
  name,
});
