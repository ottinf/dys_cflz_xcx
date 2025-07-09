<template>
    <view class="pages">
        <view class="header">
            <view class="icon">
                <view class="left">
                    <text>{{ form.DoctorName }}</text>
                </view>
            </view>
        </view>
        <view class="content">
            <view class="date">
                <view>2025-03-13 14:47:09</view>
            </view>
            <view class="mess">
                <view>
                    服务已开启,请您详细描述问题,以便医生为您提供更优质的服务
                </view>
            </view>
            <view class="conv" v-for="(item, index) in List">
                <view class="right" v-if="item.SenderID == form.Id">
                    <view class="con">
                        <view class="text">{{ item.Text }}</view>
                    </view>
                </view>
                <view class="left" v-else>
                    <view class="con">
                        <view class="text">{{ item.Text }}</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 底部 -->
        <view class="bottom flex align-center gap-50" style="justify-content: center;">
            <view v-if="process != 9" class=" bottom-btn" @click="goNext(btn2)">{{ btn2 }}</view>
            <view v-if="process != 9" class=" bottom-btn" @click="goNext(btn1)">{{ btn1 }}</view>
            <view v-if="process == 9" @click="end">问诊结束</view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            state: false,
            data: {
                Id: null
            },
            form: {
                DiagnosesName: '',
                ordlistName: ''
            },
            List: [],
            process: '',
            btn1: '是的，我确定',
            btn2: '否',
            is_saving: false,


        }
    },
    onLoad(opt) {
        this.data.Id = opt.Id
        this.process = 0
        this.getDoctorGetMessage()


    },
    methods: {
        end() {
            this.getDrugAddMessage()
            uni.navigateTo({
                url: '/subpages/index/orderDetail?Id=' + this.form.Id
            })

        },
        async goNext(num) {
            switch (this.process) {
                case 2: this.List.push({
                    SenderID: this.form.DoctorID,
                    Text: `您描述的患有${this.form.DiagnosesName}是否在线下医院确诊过？`
                })
                    this.process++

                    break;
                case 3: this.List.push({
                    SenderID: this.form.Id,
                    Text: num
                })
                    this.process++
                    this.loadNextText()
                    break;
                case 4: this.List.push({
                    SenderID: this.form.DoctorID,
                    Text: `您确定使用${this.form.ordlistName}使用后并无不适症状？`
                })
                    this.process++
                    break;
                case 5: this.List.push({
                    SenderID: this.form.Id,
                    Text: num
                })
                    this.process++
                    await this.loadNextText()
                    this.btn1 = '没有'
                    this.btn2 = '有'
                    break;
                case 6: this.List.push({
                    SenderID: this.form.DoctorID,
                    Text: `请问有无肝、肾功能异常？`
                })
                    this.process++
                    break;
                case 7: this.List.push({
                    SenderID: this.form.Id,
                    Text: num
                })
                    this.process++
                    this.loadNextText()
                    setTimeout(() => {
                        this.List.push({
                            SenderID: this.form.DoctorID,
                            Text: `您好，根据您的病情信息，已为您开具处方，祝您早日康复。`
                        })
                        this.process++

                    }, 1000)
                    break;
                default: return

            }
        },

        async loadNextText() {
            await new Promise(resolve => setTimeout(resolve, 300))
            this.goNext()
        },
        async getDrugAddMessage() {
            if (this.is_saving) return
            try {
                this.is_saving = true
                let res = await this.$api.chat.DrugAddMessage({
                    Id: this.form.Id,
                    Chats: this.List
                })
            } catch (err) {

            }


        },

        getDoctorGetMessage() {
            this.$api.order.OrderDetail(this.data).then(res => {
                console.log(res)
                if (res.Success) {
                    this.form = res.ResData;
                    if (this.form && Array.isArray(this.form.Diagnoses)) {
                        // 使用 map 方法遍历 Diagnoses 数组并提取 MC 字段
                        // 然后使用 join 方法将提取的 MC 字段连接成一个以逗号分隔的字符串
                        const mcFields = this.form.Diagnoses.map(diagnosis => diagnosis.MC).join(',');
                        this.form.DiagnosesName = mcFields;
                        console.log(mcFields); // 输出结果
                    } else {
                        this.form.DiagnosesName = '暂无';
                    }
                    if (this.form && Array.isArray(this.form.ordlist)) {
                        // 使用 map 方法遍历 Diagnoses 数组并提取 MC 字段
                        // 然后使用 join 方法将提取的 MC 字段连接成一个以逗号分隔的字符串
                        const mcFields = this.form.ordlist.map(diagnosis => diagnosis.MedName).join(',');
                        this.form.ordlistName = mcFields;
                        console.log(mcFields); // 输出结果
                    } else {
                        this.form.ordlistName = '暂无';
                    }
                    this.process = 1
                    this.List.push({
                        SenderID: this.form.Id,
                        Text: `您好，${this.form.DoctorName}医生。
                            我是${this.form.Name},今年${this.form.Age}岁，
                            ${this.form.Gender == 1 ? '男' : '女'}生。`
                    })
                    this.List.push({
                        SenderID: this.form.DoctorID,
                        Text: `您好，我是${this.form.DoctorName}医生，已收到您的申请，正在审核您的病历信息中。`
                    })
                    this.process = 2
                    this.loadNextText()
                } else {
                    uni.showToast({
                        title: res.ErrMsg,
                        icon: 'none'
                    })
                }
            })

        },

    },


}


</script>
<style lang="scss" scoped>
.pages {
    position: relative;
}

.btn {
    border-radius: 10rpx;
    background: grey;
    color: #fff;

}

.bottom-btn {
    border: 1rpx solid #999;
    color: #333;
    border-radius: 10rpx;
    text-align: center;
    padding: 15rpx 50rpx;
}

.bottom-btn:last-child {
    background: #5a98ff;
    color: #fff;
}

.header {
    background: #ffffff;

    .title {
        text-align: center;
        font-size: 30rpx;
        font-weight: bold;
        padding: 20rpx 0;
    }

    .icon {
        padding: 20rpx 30rpx;
        display: flex;
        justify-content: space-between;
        font-size: 11;

        uni-icons {
            padding: 0 10rpx 0 0;
        }

        .right,
        .left {
            display: flex;
            align-items: center;

            .item {
                display: flex;
                align-items: center;

                text {
                    color: #4EA4AA;
                }
            }

            .border-right {
                padding: 0 10rpx;

                text {
                    &::after {
                        content: '';
                        display: inline-block;
                        width: 1rpx;
                        height: 20rpx;
                        background: #EAEAEA;
                        margin-left: 18rpx;

                    }
                }

            }
        }
    }
}

.content {
    background: #F3F7FA;
    height: calc(100vh - 172rpx);

    .date {
        padding: 25rpx 0;
        text-align: center;
        color: #BABEC1;
    }

    .mess {
        padding: 20rpx 30rpx;

        view {
            border-radius: 20rpx;
            background: #EBEFF2;
            padding: 20rpx 15rpx;
            color: #989C9F;
            font-size: 13;
        }
    }

    .conv {
        padding: 0 20rpx;

        .left,
        .right {
            padding-bottom: 20rpx;

            .con {
                display: flex;
                align-items: flex-start;

                .text {
                    padding: 10rpx 25rpx;
                    background: #95EC6A;
                    border-radius: 10rpx;
                }

                .img {
                    image {
                        width: 60rpx;
                        height: 60rpx;
                        border-radius: 50%;
                        padding: 0 25rpx;
                    }
                }
            }

        }

        .right {
            .con {
                padding: 10rpx 5rpx 0 112rpx;
                justify-content: flex-end;
            }
        }

        .left {


            .con {
                padding: 10rpx 117rpx 0rpx 5rpx;

                .text {

                    background: #fff;

                }
            }

        }
    }

}

.bottom {
    background: #ffffff;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    padding-bottom: 50rpx;
    padding-top: 30rpx;

    .item {
        padding: 25rpx;
        display: flex;

        input {
            width: 69%;
            padding: 0 15rpx;
        }

        .right {
            display: flex;
            align-items: center;

            view {
                padding: 10rpx 30rpx;
                background: #95EC6A;
                color: #ffffff;
                border-radius: 10rpx;
            }
        }
    }

    .option {
        background: #ffffff;
        padding: 45rpx 0;
        display: flex;
        justify-content: center;

        .video,
        .album {
            padding: 10rpx;
            margin-bottom: 10rpx;
            background: #D1F9F4;
            border-radius: 20rpx;
        }

        view {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 35rpx;

            image {
                width: 60rpx;
                height: 60rpx;
            }
        }

    }


}
</style>