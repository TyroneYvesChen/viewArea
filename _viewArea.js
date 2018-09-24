// myPlugin.js
(function (definition) {
    "use strict"
    // CommonJS
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition()
        // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition)
        // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self

        // initialize myPlugin as a global.
        global.myPlugin = definition()
        // global.myPlugin = definition        

    } else {
        throw new Error("This environment was not anticipated by myPlugin,Please file a bug.")
    }
})(function () {
    var ViewArea = function (element, options) {
        var defaultOptions = {
            moveInOffset: 0,    //dom移入可视范围时判断的偏移量,单位px,向上方向为正
            moveOutOffset: 0,  //dom移出可视范围时判断的偏移量,单位px,向下方向为正
            eventWait: 300      //节流触发时间间隔，默认300ms
        }
        this.options = Object.assign({}, defaultOptions, options)
        this.init(element)
    }

    ViewArea.prototype.ViewAreaResult = function (element) {
        var moveInOffset = this.options.moveInOffset   //dom移入可视范围时判断的偏移量
        var moveOutOffset = this.options.moveOutOffset   //dom移出可视范围时判断的偏移量
        var windowScrollTop = document.documentElement.scrollTop || document.body.scrollTop     //滚轮距离顶部高度
        var domTopDistance = utils.getElementTop(element)   //dom距离顶部高度
        var domHeight = element.offsetHeight    //dom自身高度
        var windowHeight = document.documentElement.clientHeight      //window可视区域高度
        var scrollTop = windowScrollTop > (domTopDistance + domHeight + moveOutOffset)
        var scrollBottom = windowScrollTop < (domTopDistance - windowHeight - moveInOffset)
        var result = scrollTop || scrollBottom
        return result
    }
    ViewArea.prototype.callBackFn = function (element, result) {
        var options = this.options
        var inFn = options.inFn
        var outFn = options.outFn
        if (!result && !!inFn) {
            inFn(element)
        }
        else if (!!outFn) {
            outFn(element)
        }
    }
    ViewArea.prototype.init = function (element) {
        var length = element.length
        var eventWait = this.options.eventWait
        
        this.domDetector(element)
        window.addEventListener('scroll', utils.throttle(function () {
            if (!length) {
                this.bindingCbFn(element)
            }
            else {
                for (var i = 0; i < length; i++) {
                    this.bindingCbFn(element[i])
                }
            }
            // this.bindingCbFn(element)
        }.bind(this), eventWait), false)
    }

    ViewArea.prototype.domDetector = function (element) {
        var length = element.length
        var isDom

        if (!length) {
            isDom = utils.isDomElement(element)
        }
        else {
            for (var i = 0; i < length; i++) {
                isDom = utils.isDomElement(element[i])
                if (!isDom) {
                    // throw new Error('第' + i + '元素不是dom元素！')
                    break
                }
            }
        }
        if (!isDom) {
            throw new Error('元素不是dom元素！')
        }
    }

    ViewArea.prototype.bindingCbFn = function (element) {
        var result = this.ViewAreaResult(element)
        this.callBackFn(element, result)
    }



    /*utils*/

    function getElementTop(elem) {
        var elemTop = elem.offsetTop//获得elem元素距相对定位的父元素的top
        elem = elem.offsetParent//将elem换成起相对定位的父元素
        while (elem != null) {
            //只要还有相对定位的父元素
            /*获得父元素 距他父元素的top值,累加到结果中 */
            elemTop += elem.offsetTop
            //再次将elem换成他相对定位的父元素上
            elem = elem.offsetParent
        }
        return elemTop
    }

    // 判断是否是dom对象
    function isDomElement(obj) {
        return !!(obj && (obj.nodeType == 1 || obj.nodeType == 9));
    }

    // 节流
    function throttle(func, wait) {
        var timeout, context, args, result;
        var previous = 0;

        var later = function () {
            previous = +new Date();
            timeout = null;
            func.apply(context, args)
        };

        var throttled = function () {
            var now = +new Date();
            //下次触发 func 剩余的时间
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            // 如果没有剩余的时间了或者你改了系统时间
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                func.apply(context, args);
            } else if (!timeout) {
                timeout = setTimeout(later, remaining);
            }
        };
        return throttled;
    }

    var utils = {
        getElementTop: getElementTop,
        isDomElement: isDomElement,
        throttle: throttle
    }

    function myPlugin() {
        return function (element, options) {
            return new ViewArea(element, options)
        }
    }
    return myPlugin()
})