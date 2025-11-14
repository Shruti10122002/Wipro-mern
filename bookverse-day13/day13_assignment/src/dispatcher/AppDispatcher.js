const AppDispatcher = {
  callbacks: [],
  
  register(callback) {
    this.callbacks.push(callback);
    return this.callbacks.length - 1;
  },

  dispatch(action) {
    this.callbacks.forEach(cb => cb(action));
  }
};

export default AppDispatcher;