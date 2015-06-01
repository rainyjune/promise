(function(window){
  "use strict"; 
  // Don't do anything if Promise is defined.
  // Maybe it was supported natively in browser.
  if ("Promise" in window) {
    return ;
  }
  alert("my");

  /**
   * Constructor
   * @param {function} executor - Function object with two arguments resolve and reject.
   * @return {Promise}
   *
   */
  function Promise(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("Argument 1 of Promise.constructor is not a function");
    }
    
    var callbacks = { "ok": [], "fail": [] }; 
    var slice = Array.prototype.slice;
    
    var status = "pending";
    var statevalue;
    
    this.length = 1;

    function resolveInterval(state, args) {
      if (status !== "pending") {
        throw new Error("Promise has already been resolved");
      }
      status = state;
      statevalue = slice.call(args, 0);
      callbacks[state].forEach(function(e){
        e.apply(e, statevalue);
      });
    }
    
    var reject = function() {
      resolveInterval("fail", arguments);
    };
    
    var resolve = function() {
      resolveInterval("ok", arguments);
    };
    
    this.getState = function() {
      return status;
    };
    
    this.getStateValue = function() {
      return statevalue;
    };
    
    this.getQueue = function() {
      return callbacks;
    }
    
    executor.call(this, resolve, reject);
  }

  /**
   * Returns a promise object that is resolved with the given value.
   * @param {mixed} value - A promise, or a thenable, or an object.
   * @return {Promise}
   *
   */
  Promise.resolve = function(value) {
    return new Promise(function(resolve, reject){
      resolve(value);
    });
  };

  Promise.reject = function() {
  };

  Promise.all = function() {
  };

  Promise.race = function() {
  };

  Promise.prototype.catch = function(onRejected) {
    return this;
  };
  Promise.prototype.then = function(onFulfilled, onRejected) {
    var self = this;
    function promiseInternal(state, func) {
      if (typeof func !== "function") {
        throw new TypeError("Callback argument must be a Function");
      }
      var currentState = self.getState(),
          currentStateValue = self.getStateValue();
      if (currentState === state) {
        func.apply(func, currentStateValue);
      } else {
        self.getQueue()[state].push(func);
      }
      return self;
    }
    promiseInternal("ok", onFulfilled);
    promiseInternal("fail", onRejected);

    return this;
  };
  
  window.Promise = Promise;
}(window));
