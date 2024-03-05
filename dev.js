function makeTrackedPromise(promise) {
    let status = "pending";
    let result;
  
    const trackedPromise = promise.then(
      value => {
        status = "fulfilled";
        result = value;
        return value;
      },
      error => {
        status = "rejected";
        result = error;
        throw error;
      }
    );
  
    trackedPromise.getStatus = () => status;
    trackedPromise.getResult = () => result;
  
    return trackedPromise;
  }
  
  // Example usage
  const originalPromise = new Promise((resolve, reject) => {
    resolve(52, 69);
    // reject();
  });
  
//   const trackedPromise = makeTrackedPromise(originalPromise);
  const trackedPromise = originalPromise;
  
  trackedPromise.then((a, b) => {
    // console.log(trackedPromise.getStatus()); // "fulfilled" if resolved
    console.log(a);
    console.log(b);
  }).catch(() => {
    console.log(trackedPromise.getStatus()); // "rejected" if rejected
  });
  