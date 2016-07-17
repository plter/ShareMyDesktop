#数据包描述
##定义
| 名称 | 描述 |
| --- | --- |
| 服务器(server) | 发送视频流的主机,每一个连接的终端都可以做为转发服务器 |
| 客户机(caller,customer) | 订阅视频流的终端,由该终端主动呼叫Socket服务器,由Socket服务器打通与其它服务器终端的通道 |

##发送RTCSessionDescription给呼叫者的数据包
| key | 说明 |
| --- | --- |
| callerSocketId | 呼叫者Socket ID |
| desc | RTCSessionDescription 对象 |

##发送RTCIceCandidate给呼叫者的数据包
| key | 说明 |
| --- | --- |
| callerSocketId | 呼叫者Socket ID |
| candidate | RTCIceCandidate对象 |