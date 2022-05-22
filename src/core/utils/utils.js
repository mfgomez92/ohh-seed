export default class Utils {

}

/**
 *
 * @param key
 * @returns {string}
 */
Utils.camelToKebabCase = function (key) {
    var result = key.replace( /([A-Z])/g, " $1" ).trim();
    return result.split(' ').join('-').toLowerCase();
}

/**
 *
 * @param url
 * @returns {Promise<string>}
 */
Utils.getHTTP = async function (url) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    resolve(this.responseText);
                } else {
                    reject(this.status);
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    });
};

Utils.removeElementsOfClass = function (styleClass) {
    let list = document.getElementsByClassName(styleClass);
    while (list.length > 0) {
        list[0].parentNode.removeChild(list[0]);
    }

};


/**
 * Hide element setting display:none
 * @param element
 */
Utils.hideElement = async function (element, animated = false) {
    if (element == null) {
        console.warn("trying to delete null");
        return;
    }
    if (animated) {
        await Utils.fadeOut(element);
        element.style.display = 'none';
    } else {
        element.style.display = "none";
    }
};


/**
 * Hide element with id setting display:none
 * @param id {string}
 */
Utils.hideElementById = async function (id, animated) {
    await Utils.hideElement(document.getElementById(id), animated);
};


/**
 * Show element setting display:block
 * @param element
 */
Utils.showElement = async function (element, animated) {
    if (element == null) {
        console.warn("trying to delete null");
        return;
    }
    if (animated) {
        element.style.display = "block";
        await Utils.fadeIn(element);
    } else {
        element.style.display = "block";
    }
};

/**
 * Show element with id setting display:block
 * @param id {string}
 */
Utils.showElementById = function (id) {
    Utils.showElement(document.getElementById(id));
};

/**
 *
 * @param element
 * @param eventHandler
 */
Utils.onClick = function (element, eventHandler) {
    element.onclick = eventHandler;
    // Utils.addListener(element, "click", handler);
}

/**
 *
 * @param element
 * @param eventHandler
 */
Utils.onClickOnce = function(element, eventHandler) {
    Utils.addOnePlayEventListener(element, "click", eventHandler);

}


/**
 * Adds a click listener to the element
 * @param element
 * @param eventHandler
 */
Utils.onClickById = function (elementId, eventHandler) {
    Utils.onClick(document.getElementById(elementId), eventHandler);
}


/**
 * Listen to the event one time
 * @param element
 * @param eventName
 * @param handler
 */
Utils.addOnePlayEventListener = function (element, eventName, handler) {
    let oneEventHandler = function (e) {
        Utils.removeEventListener(element, eventName, oneEventHandler);
        handler(e);
    };
    Utils.addEventListener(element, eventName, oneEventHandler);
}

/**
 * Adds an eventListener to an element
 * @param element
 * @param eventName
 * @param handler
 */
Utils.addEventListener = function (element, eventName, handler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, handler);
    } else {
        element['on' + eventName] = handler;
    }
}

/**
 * Adds an eventListener to an element
 * @param element
 * @param eventName
 * @param handler
 */
Utils.removeEventListener = function (element, eventName, handler) {
    if (element.addEventListener) {
        element.removeEventListener(eventName, handler, false);
    } else if (element.detachEvent) {
        element.detachEvent('on' + eventName, handler);
    } else {
        element['on' + eventName] = null;
    }
}

/**
 *
 * @param array {array}
 * @param element
 */
Utils.removeElementFromArray = function (element, array) {
    const index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
}

/**
 * Returns a random element from the array
 * @param array
 * @returns {*}
 */
Utils.getRandomElementFromArray = function (array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns n random elements from array
 * @param array
 * @param count
 * @returns {array}
 */
Utils.getRandomElementsFromArray = function (array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}


/**
 * Return the query parameter in the URL
 * @param nameParam {string} name of parameter
 */
Utils.getURLGetParameterByName = function (nameParam) {
    let url = window.location.href;
    nameParam = nameParam.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + nameParam + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Returns a random number
 */
Utils.getRandomNumber = function (maxValue) {
    return Math.floor(Math.random() * maxValue)
}

/**
 * Returns an array of random unique values
 * Used to get random positions of the word letters, to give them as clues one at a time
 */
Utils.getRandomArrayOfUniqueValues = function (numberOfValues, maxValue, seed = 0) {
    var arr = [];
    while (arr.length < numberOfValues) {
        //TODO use the seed value to set it the same allways
        // possible solution: http://davidbau.com/encode/seedrandom.js
        // http://davidbau.com/archives/2010/01/30/random_seeds_coded_hints_and_quintillions.html
        var random = Math.random();
//        var random = Math.seedrandom(seed);
        var r = Math.floor(Math.random() * maxValue) + 1;
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}

/**
 * generates uuid
 * @returns {string}
 */
Utils.uuid = function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


/**
 *
 * @param milliseconds
 * @returns {Promise<any>}
 */
Utils.waitForMilliseconds = function (milliseconds) {
    return new Promise(r => setTimeout(r, milliseconds));
}


/**
 *
 * @param seconds
 * @returns {Promise<any>}
 */
Utils.waitForSeconds = function (seconds) {
    return Utils.waitForMilliseconds(1000 * seconds);
}


Utils.deferredPromise = function () {
    var deferred = {
        promise: null,
        resolve: null,
        reject: null
    };

    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
};

Utils.cancelableTimeout = (delay, value) => {
    let timer = 0;
    let reject = null;
    const promise = new Promise((resolve, _reject) => {
        reject = _reject;
        timer = setTimeout(resolve, delay, value);
    });
    return {
        get promise() {
            return promise;
        },
        cancel() {
            if (timer) {
                clearTimeout(timer);
                timer = 0;
                reject();
                reject = null;
            }
        }
    };
};

/**
 *
 * @param text {string}
 */
Utils.isEmptyString = function (text) {
    if (text == null) return true;
    if (text == 'undefined') return true;
    if (text == "") return true;
    return false;
}


Utils.fadeOutBySelector = async function (id) {
    await Utils.fadeOut(document.querySelector(id));
}

Utils.fadeOut = function (element) {
    return new Promise((resolve, reject) => {
        if (element == null) {
            console.warn("trying to fade null");
            return;
        }

        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.02) {
                element.style.opacity = "0";
                element.style.filter = 'alpha(opacity=' + 100 + ")";
                clearInterval(timer);
                resolve();
            } else {
                element.style.opacity = op;
                element.style.filter = 'alpha(opacity=' + op * 100 + ")";
                op -= op * 0.3;
            }
        }, 50);

    });

}

Utils.waitAfterDOMUpdated = async function () {
    return new Promise(function (resolve, reject) {
        window.requestAnimationFrame(resolve);
    });
}


Utils.fadeInBySelector = async function (id) {
    await Utils.fadeIn(document.querySelector(id));
}

Utils.fadeIn = function (element) {
    return new Promise((resolve, reject) => {


        if (element == null) {
            console.warn("trying to fade null");
            return;
        }

        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.02) {
                element.style.opacity = "1";
                element.style.filter = 'alpha(opacity=' + 0 + ")";
                clearInterval(timer);
                resolve();
            } else {
                element.style.opacity = "" + (1 - op);
                element.style.filter = 'alpha(opacity=' + (1 - op) * 100 + ")";
                op -= op * 0.3;
            }
        }, 50);
    });
}

// The debounce function receives our function as a parameter
Utils.debounce = (fn) => {

    // This holds the requestAnimationFrame reference, so we can cancel it if we wish
    let frame;

    // The debounce function returns a new function that can receive a variable number of arguments
    return (...params) => {

        // If the frame variable has been defined, clear it now, and queue for next frame
        if (frame) {
            cancelAnimationFrame(frame);
        }

        // Queue our function call for the next frame
        frame = requestAnimationFrame(() => {

            // Call our function and pass any params we received
            fn(...params);
        });

    }
};

Utils.createHTMLElementFromString = function (text) {
    return document.createRange().createContextualFragment(text).firstChild;
}

Utils.createHTMLFragmentFromString = function (text) {
    return document.createRange().createContextualFragment(text);
}

Utils.pixelateImage = function(imageUrl, sampleSize) {
    return new Promise((resolve, reject) => {
        let c = document.createElement("canvas");
        let ctx = c.getContext('2d');
        let img1 = new Image();
    
        img1.onload = function () {
    
          let w = img1.width;
          let h = img1.height;
    
          c.width = w;
          c.height = h;
          ctx.drawImage(img1, 0, 0);
    
          var pixelArr = ctx.getImageData(0, 0, w, h).data;
    
          for (let y = 0; y < h; y += sampleSize) {
            for (let x = 0; x < w; x += sampleSize) {
              let p = (x + (y*w)) * 4;
              ctx.fillStyle = "rgba(" + pixelArr[p] + "," + pixelArr[p + 1] + "," + pixelArr[p + 2] + "," + pixelArr[p + 3] + ")";
              ctx.fillRect(x, y, sampleSize, sampleSize);
            }
          }
    
          resolve(c.toDataURL("image/jpeg"));      
        };
        img1.src = imageUrl;
    });

  }


