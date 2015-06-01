(function(window){
  "use strict"; 
  // Don't do anything if Promise is defined.
  // Maybe it was supported natively in browser.
  if ("Promise" in window) {
    return ;
  }

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
    
    var queue = [];
    
    var state = "pending";
    var statevalue = null;
    
    this.length = 1;
    
      
    this.all = function(iterable) {
    };
    
    this.race = function(iterable) {
      
    };
    
    this.reject = function(reason) {
      state = "rejected";
      statevalue = reason;
      processQueue();
    };
    
    this.resolve = function(value) {
      state = "fulfilled";
      statevalue = value;
      processQueue();
    };
    
    function processQueue() {
      if (state === "fulfilled") {
        var succCallback = queue.shift()["success"];
        succCallback && succCallback(statevalue);
      } else if (state === "rejected") {
        var errCallback = queue.shift()["error"];
        errCallback && errCallback(statevalue);
      }
    }
    
    this.getState = function() {
      return state;
    };
    
    this.getStateValue = function() {
      return statevalue;
    };
    
    this.getQueue = function() {
      return queue;
    }
    
    executor.call(this, this.resolve, this.reject);
  }
  Promise.prototype.catch = function(onRejected) {

    return this;
  };
  Promise.prototype.then = function(onFulfilled, onRejected) {
    this.getQueue().push({
      success: onFulfilled,
      error: onRejected
    });
    return this;
  };
  
  window.Promise = Promise;
}(window));
