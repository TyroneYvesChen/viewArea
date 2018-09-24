#ViewArea  判断可视区域（常用于css3动画）<br/>
```options
{
    moveInOffset: 0,    //dom移入可视范围时判断的偏移量
    moveOutOffset: 0,  //dom移出可视范围时判断的偏移量
    eventWait: 300,     //节流触发时间间隔，默认300ms
    inFn: function (element) {
     //移入可视区域callback
    },
     outFn: function (element) {
     //移出可视区域callback
    }
}

```