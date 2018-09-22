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
            moveInOffset: 0,    //dom移入可视范围时判断的偏移量
            moveOutOffset: 0  //dom移出可视范围时判断的偏移量
        }
        this.options = Object.assign({}, defaultOptions, options)
        this.init(element)
    }

    ViewArea.prototype.ViewAreaResult = function (element) {
        var windowScrollTop = document.documentElement.scrollTop || document.body.scrollTop     //滚轮距离顶部高度
        var domTopDistance = getElementTop(element)   //dom距离顶部高度
        var domHeight = getDocumentPort(element).width    //dom自身高度
        var windowHeight = document.documentElement.clientHeight      //window可视区域高度
        var scrollTop = windowScrollTop > (domTopDistance + domHeight)
        var  scrollBottom = windowScrollTop < (domTopDistance - windowHeight)
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
        window.addEventListener('scroll',function(){
            var result = this.ViewAreaResult(element)
            this.callBackFn(element, result)
        }.bind(this),false);
        
    }

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

    /*视口的大小，部分移动设备浏览器对innerWidth的兼容性不好，需要
    *document.documentElement.clientWidth或者document.body.clientWidth
    *来兼容（混杂模式下对document.documentElement.clientWidth不支持）。
    *使用方法 ： getViewPort().width
    */
    function getViewPort() {
        if (document.compatMode == "BackCompat") {   //浏览器嗅探，混杂模式
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            }
        } else {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
        }
    }

    //获得文档的大小（区别与视口）, 用法和上面相同
    function getDocumentPort() {
        if (document.compatMode == "BackCompat") {
            return {
                width: document.body.scrollWidth,
                height: document.body.scrollHeight
            }
        } else {
            return {
                width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
                height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
            }
        }
    }

    // $.fn.viewarea = function (options) {
    //     return this.each(function () {
    //         new ViewArea(this, options)
    //     })
    // }

    function myPlugin() {
        return function (element, options){
            return new ViewArea(element, options)
        }
        // return {
        //     ViewArea: ViewArea
        // }
    }
    return myPlugin()
})