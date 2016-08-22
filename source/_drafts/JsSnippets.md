## Boolean
    !!'foo'
## Number
    +'45'
    +new Date
## 闭包
    var isType = function(type) {
        return function(obj) {
            return toString.call(obj) == '[Object ' + type + ']';
        }
    }
## parseInt
    ~~3.14159
    // => 3
    ~~5.678
    // => 5
## Hex 随机
    (~~(Math.random()*(1<<24))).toString(16)
## «
    Math.pow(2,24) === (1 << 24)
    parseInt('1000000000000000000000000', 2) === (1 << 24)

