export default class ApiClient {
  constructor() {
    ['get', 'post', 'put', 'patch', 'del'].forEach(method =>
      this[method] = endpoint =>
        fetch(endpoint, { method }).then(res => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json().then(json => Promise.resolve(json));
        })
    );
  }
}
