# markdown语法示例

## 引用
>这是引用的内容1
>>这是引用的内容2
>>>这是引用的内容3
>>>>这是引用的内容4

## 分割线
---
----
***
*****

## 表格
表头|表头|表头
---|:--:|---:
内容内容内容内容|内容内容内容内容|内容
内容|内容|内容


## 代码
 `const MarkdownIt = require('markdown-it')`
 ```
 const md = new MarkdownIt({
   html:true,
   linkify:true,
   typographer: true,
 });
```
