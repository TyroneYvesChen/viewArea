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

module.exports = {
    getElementTop,
    getViewPort,
    getDocumentPort
}