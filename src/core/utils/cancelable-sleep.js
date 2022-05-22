export default class CancelableSleep {

    /**
     *
     * This class is for cancel a sleep while is sleeping.
     * Ussagge example:
     *
     *
      async anAsyncFunction () {
        try {
            var sleep = new CancelableSleep();
            await sleep.start(2000);
            doThingsAfterSleep();
        }catch (e) {
            doThingsIfSleepWasCanceled();
        }
       }
     

       function cancelTheSleep () {
            sleep.cancel();
       }

     *
     *
     */


    constructor() {
        this.wasCanceled = false;
    }


    /**
     * Start the timer
     * @param timeout
     * @returns {Promise<any>}
     */
    start (timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.wasCanceled) {
                    reject();
                }else {
                    resolve();
                }
            }, timeout);
        });
    }


    /**
     * Cancel the timer
     */
    cancel () {
        this.wasCanceled = true;
    }

}