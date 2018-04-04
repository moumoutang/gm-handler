# 功能说明

- 提供一个http服务，可跟对传过来的参数从网络上download图片，并按照位置参数来进行合并图片；
- 考虑到图片合成属于高CPU操作，使用rabbitMq提供队列服务，控制并发处理量；
- 图片服务调用gm (GraphicsMagick for node.js)；
- 最终图片生成结果会存储在本地；
- pm2 控制进程；

# 入参说明
``` JSON
{
    "images":[
        {
            "bg":{
                "url":"合成用的背景图", //合成用背景图（也就是底图）
                "height":"1200", //底图的缩放后高度 （需要提供最终图片需要的宽高）
                "width":"675" //底图的缩放后宽度
            },
            "layers":[ // 需要合成的图  按照数组位置  最先的在最底下
                {
                    "url":"",
                    "height":"910", //此图需要缩放到多大进行合成
                    "width":"750",
                    "posX":"10", // 此图对于底图左上角X轴距离
                    "posY":"10", // 此图对于底图左上角Y轴距离
                    "crop":{ //若底图需要进行裁剪，需要提供裁剪参数
                        "offsetX":"53", // 裁剪开始的位置
                        "offsetY":"50", // 裁剪开始的位置
                        "height":"800", // 裁剪的目标长宽
                        "width":"700"// 裁剪的目标长宽
                    }
                }
            ]
        }
	]
}
``` 
# 使用说明

【开始】 npm start   执行的是pm2 start process.yml,可在process.yml配置多个程序

【重启】 npm restart

【关闭】 npm kill

