<template>
    <view class="pad-30 pages">
        <view class="flex-cs bors">
            <view><span>*</span>姓名</view>
            <input type="text" v-model="name" placeholder="请输入就诊人姓名">
        </view>
        <view class="flex-cs bors">
            <view>身份证号</view>
            <input type="number" v-model="idNumber" placeholder="请输入身份证号">
        </view>
        <view class="flex-cs bors">
            <view><span>*</span>性别</view>
            <view class="flex align-center gap-10">
                <picker @change="bindPickerChange" @cancel="bindPickerCancel" :value="genderIndex" :range="genders">
                    <input type="text" v-model="selectedGender" placeholder="点击选择您的性别" disabled>
                </picker>
                <uni-icons type="right" size="18" color="#999"></uni-icons>
            </view>
        </view>
        <view class="flex-cs bors">
            <view>出生日期</view>
            <view class="flex align-center gap-10">
                <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
                    <input type="text" v-model="birthday" placeholder="点击选择出生日期" disabled>
                </picker>
                <uni-icons type="right" size="18" color="#999"></uni-icons>
            </view>
        </view>
        <view class="flex-cs bors">
            <view><span>*</span>年龄</view>
            <input type="number" v-model="age" placeholder="请输入就诊人年龄">
        </view>
        <view class="flex-cs bors">
            <view>联系电话</view>
            <input type="number" v-model="tel" placeholder="请输入联系电话">
        </view>
        <button class="bottom-btn" :plain="true" style="border: none;" :disabled="disabled">保存</button>
    </view>
</template>
<script>
export default {
    data() {
        const currentDate = this.getDate({
            format: true
        })
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // JavaScript的月份是从0开始的
        const day = String(today.getDate()).padStart(2, '0');
        return {
            disabled: true,
            date: currentDate,
            genders: ['男', '女'],
            genderIndex: 0, // 默认选择第一个选项
            selectedGender: '',
            name: '',
            idNumber: '',
            tel: '',
            address: '',
            birthday: '', // 用来存储选择的出生日期
            age: '', // 用来存储计算出来的年龄
            startDate: '1900-01-01', // 开始日期
            endDate: `${year}-${month}-${day}`, // 结束日期设为今天
        }
    },
    computed: {
    },
    methods: {
        // checkFormCompletion() {
        //     this.disabled = !this.watchFields.every(field => Boolean(this[field]));
        // },

        // 选择性别
        bindPickerChange(e) {
            this.genderIndex = e.detail.value;
            this.selectedGender = this.genders[this.genderIndex];
            // this.checkFormCompletion(); // 更新按钮状态
        },
        bindPickerCancel() {
            // 取消
        },
        bindDateChange(e) {
            const selectedDate = e.detail.value;
            this.birthday = selectedDate;
            const birthDate = new Date(selectedDate);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            this.age = age;
            // this.checkFormCompletion(); // 更新按钮状态
        },
        getDate(type) {
            const date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            if (type === 'start') {
                year = year - 60;
            } else if (type === 'end') {
                year = year + 2;
            }
            month = month > 9 ? month : '0' + month;
            day = day > 9 ? day : '0' + day;
            return `${year}-${month}-${day}`;
        },
        goPage(url) {
            uni.navigateTo({
                url: url
            })
        }
    },
    watch: {


    }
}
</script>
<style>
.pages {
    background: #fff;
}

.pages .flex-cs.bors:last-of-type {
    border-bottom: 0;
    padding-bottom: 0;
    margin-bottom: 0;
}

.bottom-btn {
    position: fixed;
    bottom: 30rpx;
    left: 10rpx;
    right: 10rpx;
    padding: 25rpx 0;
    border: none;
    font-size: 30rpx;
    background: #76e5bb !important;
    color: #fff !important;
}

button[disabled] {
    background: #999999 !important;
}

.b1 {
    color: #fff;
    background: #1789f8;
    font-size: 26rpx;
    margin-left: 10rpx;
    padding: 10rpx;
}

input {
    flex: 1;
    text-align: right;
}

span {
    color: red;
}
</style>