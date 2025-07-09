class ModalUtil {
    /**
     * 封装 uni.showModal 为 Promise
     * @param {Object} options - 配置参数
     * @param {string} options.title - 提示的标题
     * @param {string} options.content - 提示的内容
     * @param {boolean} options.showCancel - 是否显示取消按钮，默认为 true
     * @param {string} options.cancelText - 取消按钮的文字，默认为"取消"
     * @param {string} options.cancelColor - 取消按钮的文字颜色，默认为"#000000"
     * @param {string} options.confirmText - 确定按钮的文字，默认为"确定"
     * @param {string} options.confirmColor - 确定按钮的文字颜色
     * @param {boolean} options.editable - 是否显示输入框
     * @param {string} options.placeholderText - 显示输入框时的提示文本
     * @returns {Promise<{ confirm: boolean, cancel: boolean, content?: string }>} - 返回 Promise，resolve 时返回用户操作结果
     */
    showModalAsync(options = {}) {
        return new Promise((resolve, reject) => {
            uni.showModal({
                title: options.title || '提示',
                content: options.content || '',
                showCancel: options.showCancel !== false, // 默认显示取消按钮
                cancelText: options.cancelText || '取消',
                cancelColor: options.cancelColor || '#000000',
                confirmText: options.confirmText || '确定',
                confirmColor: options.confirmColor || '#007aff',
                editable: options.editable || false,
                placeholderText: options.placeholderText || '',
                success: (res) => {
                    if (res.confirm) {
                        resolve(true);
                    } else if (res.cancel) {
                        resolve(false);
                    }
                },
                fail: (err) => {
                    resolve(false);
                }
            });
        });
    }
}

// 创建单例对象
const modalUtil = new ModalUtil();

// 导出单例对象
export default modalUtil;
