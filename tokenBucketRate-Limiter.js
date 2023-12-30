//class
// 3 functions
//  1. refillBucket
//  2. consumeToken
//  3. handleReq.

/*
 *   every user will have a bucket
 */
class TokenBucket {
  #refillAmount;
  #capacity;
  #refillTime;
  #db = {}; // key : {tokenAvailable , lastTokenTime or last Refill time}
  constructor(capacity, refillAmount, refillTime) {
    this.#capacity = capacity; // maximum capacity of the bucket, after which it will overflow the tokens
    this.#refillAmount = refillAmount; // refill amount
    this.#refillTime = refillTime; // amount of time between refills (in seconds)
  }

  // given a key( specific to the user ) fill the bucket with refillAmount
  #refillBucket(key) {
    if (!this.#db[key]) return null;

    const { tokens, timeStamp } = this.#db[key];
    const currentTime = Date.now();
    const elapshedTime = Math.floor(
      (currentTime - timeStamp) / (this.#refillTime* 1000)
    );
    const newTokens = elapshedTime * this.#refillAmount;

    this.#db[key] = {
      tokens: Math.min(this.#capacity, tokens + newTokens),
      timeStamp: currentTime,
    };

    return this.#db[key];
    // if key exist ,
    // currentTime - last token used time >=refillTime
    // elapshed time(in seconds) * refillAmountPerSecond
    // refilling should not exceed the capacity of the bucket.
    // else (key not exist) (although we will only call this function when key exist but anyway)
    // error -> invalid key.
  }

  // craete bucket for a new user in our storage
  #createBucket(key) {
    // insert this key in db ,
    // make the tokenAvailbe to be default/capacity.
    if (!this.#db[key]) {
      this.#db[key] = {
        tokens: this.#capacity,
        timeStamp: Date.now(),
      };
    }
    return this.#db[key];
  }

  // handle Request for every user.
  // public API
  handlerRequest(key) {
    // check if user exist
    // if exist then ,
    // check if he is available to refillAmount
    // call refillAmount

    let bucket = this.#createBucket(key);
    const currentTime = Date.now();

    const elapshedTime = Math.floor((currentTime - bucket.timeStamp) / 1000);
    if (elapshedTime >= this.#refillTime) {
      bucket = this.#refillBucket(key);
    } else {
      if (bucket?.tokens <= 0) {
        throw new Error("Maximum Limit reached !! try again after some time.");
      }
    }

    if(!bucket){
        throw new Error("User Not found !!!");
    }

    bucket.tokens -=1;
    console.log(bucket);
    return true;
  }
}

module.exports=TokenBucket;