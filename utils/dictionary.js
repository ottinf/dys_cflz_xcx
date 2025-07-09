class MedicalDictionary {
  constructor() {

    this.dic_user_type = [{
        id: 0,
        code: 'System',
        name: '系统人员',
      },
      {
        id: 10001,
        code: 'Doctor',
        name: '医院医师',
      },
      {
        id: 10002,
        code: 'Pharmacist',
        name: '医院药师'
      },
      {
        id: 10901,
        code: 'HosOther',
        name: '医院其他人员'
      },
      {
        id: 20001,
        code: 'DrugWorker',
        name: '药店工作员',
      },
      {
        id: 20002,
        code: 'DrugPhar',
        name: '药店药师'
      },
      {
        id: 20901,
        code: 'DrugOther',
        name: '药店其他人员'
      },
      {
        id: 90001,
        code: 'AgentWorker',
        name: '代理工作员'
      },
      {
        id: 90901,
        code: 'AgentOther',
        name: '代理其他人员'
      },
      {
        id: 30001,
        code: 'Tester',
        name: '其他'
      },
      {
        id: 30000,
        code: 'TestAdmin',
        name: '测试员管理'
      },
      {
        id: 41000,
        code: 'Patient',
        name: '患者'
      }
    ];
    
    this.dic_patient_status_type = [
        { id: 1, key: 'Default', value: 0, name: '全部', note: '表示所有状态的集合，查询用，不特指特定状态。' },
        { id: 2, key: 'Obsolete', value: -10000, name: '订单作废', note: '订单已被取消，无法继续处理。' },
        { id: 3, key: 'DrugSave', value: 10000, name: '药店推送数据', note: '药店已上传数据，但尚未推送药品。' },
        { id: 4, key: 'DrugPush', value: 10100, name: '药店推送药品', note: '药店已推送药品，等待后续处理。' },
        { id: 5, key: 'PatientSave', value: 20000, name: '患者已补充', note: '患者已提供必要的补充信息。' },
        { id: 6, key: 'WaitDoctor', value: 20500, name: '等待医生接单', note: '等待医生接单。' },
        { id: 6, key: 'PatientSelectDoctor', value: 20900, name: '已选择医师', note: '患者已选择医生，可以进行问诊。' },
        { id: 6, key: 'DoctorSelectPatient', value: 20901, name: '医师已接单', note: '医生已接单，可以进行问诊。' },
        { id: 7, key: 'PatientJoin', value: 30100, name: '患者准备问诊', note: '患者已进入问诊准备阶段。' },
        { id: 8, key: 'DoctorJoin', value: 30200, name: '医师已接诊', note: '医生已接诊患者，问诊开始。' },
        { id: 9, key: 'InquiryEnd', value: 30900, name: '问诊已结束', note: '问诊过程已完成，等待后续步骤。' },
        { id: 10, key: 'DoctorEdit', value: 40000, name: '医师审查和编辑', note: '医生正在审查和编辑患者信息。' },
        { id: 11, key: 'DoctorReEdit', value: 40100, name: '医师重审和编辑', note: '医生需要对之前的审查和编辑进行重新处理。' },
        { id: 12, key: 'DoctorPass', value: 40900, name: '通过医师审核', note: '医生已确认患者信息无误，审核通过。' },
        { id: 13, key: 'DoctorNotPass', value: -40000, name: '医师未通过审核', note: '医生审核未通过，可能需要重新提交信息。' },
        { id: 14, key: 'UploadNoScan', value: 50000, name: '患者未扫码', note: '患者尚未完成扫码操作。' },
        { id: 15, key: 'UploadScan', value: 50100, name: '患者已扫码', note: '患者已完成扫码，可以进行后续步骤。' },
        { id: 16, key: 'UploadBefore', value: 50200, name: '表示预上传', note: '数据已准备好，即将开始上传。' },
        { id: 17, key: 'UploadOk', value: 50300, name: '上传结束', note: '数据上传完成，等待确认。' },
        { id: 18, key: 'UploadFailed', value: -50300, name: '上传失败', note: '数据上传过程中出现错误，需重新尝试。' },
        { id: 19, key: 'UploadEnd', value: 50900, name: '上传完成', note: '数据上传已确认完成。' },
        { id: 20, key: 'UploadSign', value: 60100, name: '准备签名', note: '准备进行电子处方签名。' },
        { id: 20, key: 'UploadSignBefore', value: 60200, name: '预签名', note: '正在进行签名。' },
        { id: 21, key: 'UploadSignFailed', value: -60000, name: '签名失败', note: '签名过程失败，需重新尝试。' },
        { id: 22, key: 'UploadSignOk', value: 60900, name: '电子处方已签名', note: '电子处方已成功签名。' },
        { id: 23, key: 'Finish', value: 90000, name: '已完成', note: '所有流程已完成，订单处理完毕。' },
        { id: 24, key: 'UploadCalceled', value: -90000, name: '已撤销', note: '流程已被撤销，操作终止。' }
    ];

    this.dic_pat_sys_type = [{
        id: 0,
        name: '无业务'
      },
      {
        id: 1,
        name: '图文问诊'
      },
      {
        id: 2,
        name: '视频问诊'
      },
      {
        id: 3,
        name: '药店补方'
      }
    ];

    this.dic_pat_med_type = [{
        id: 0,
        name: '非流转处方'
      },
      {
        id: 11,
        name: '普通流转处方'
      },
      {
        id: 140104,
        name: '门诊慢病处方'
      },
      {
        id: 140201,
        name: '门诊特病处方'
      }
    ];

    this.dic_work_status = [{
        id: 0,
        name: '休息中'
      },
      {
        id: 10000,
        name: '工作中'
      },
      {
        id: 20000,
        name: '自动问诊'
      },
      {
        id: 30000,
        name: '问诊中'
      },
      {
        id: -10000,
        name: '禁用'
      }
    ];

    this.dic_med_type = [{
        id: 1,
        name: '西药'
      },
      {
        id: 2,
        name: '中成药'
      },
      {
        id: 3,
        name: '中药饮片'
      },
      {
        id: 9,
        name: '中药颗粒'
      }
    ];
    
    this.dic_message_type= [{
        value: 0,
        name: '普通文本'
      },
      {
        value: 101,//废弃
        name: '问诊卡'
      },
      {
        value: 102,//废弃
        name: '治疗方案'
      },
      {
        value: 201,
        name: '邀请加入视频'
      },
      {
        value: 301,
        name: '视频结束'
      }
    ];

    this.videoEventType= [{
        id: 11000,
        name: 'inited',
        type: 'inited'
      },
      {
        id: 12000,
        name: 'local_play',
        type: 'local_play'
      },
      {
        id: 13000,
        name: 'remote_play',
        type: 'remote_play'
      },
      {
        id: 14000,
        name: 'local_stop',
        type: 'local_stop'
      },
      {
        id: 15000,
        name: 'remote_stop',
        type: 'remote_stop'
      },
      {
        id: 16000,
        name: 'doc_in',
        type: 'doc_in'
      },
      {
        id: 17000,
        name: 'doc_out',
        type: 'doc_out'
      },
      {
        id: 18000,
        name: 'pat_in',
        type: 'pat_in'
      },
      {
        id: 19000,
        name: 'pat_out',
        type: 'pat_out'
      }
    ];

    this.toast_param = [{
        type: 'success',
        title: '成功',
        position: 'top',
        duration: '1000',
        complete: () => {},
        message: '请求成功'
      },
      {
        type: 'error',
        title: '失败',
        position: 'top',
        duration: '1000',
        complete: () => {},
        message: '请求失败'
      },
      {
        type: 'default',
        title: '提示',
        position: 'top',
        duration: '1000',
        complete: () => {},
        message: ''
      },
      {
        type: 'loading',
        title: '加载',
        position: 'top',
        duration: '1000',
        complete: () => {},
        message: '正在加载....'
      },
    ];

    this.dic_use_interval = [{
        id: 1,
        code: 'Qd',
        name: '一日一次'
      },
      {
        id: 2,
        code: 'Bid',
        name: '一日二次'
      },
      {
        id: 3,
        code: 'Tid',
        name: '一日三次'
      },
      {
        id: 4,
        code: 'Qid',
        name: '一日四次'
      },
      {
        id: 5,
        code: 'P.r.n',
        name: '必要时使用'
      },
      {
        id: 6,
        code: 'Q.4.h',
        name: '每4小时一次'
      },
      {
        id: 7,
        code: 'Q.6.h',
        name: '每6小时一次'
      },
      {
        id: 8,
        code: 'Q.8.h',
        name: '每8小时一次'
      },
      {
        id: 9,
        code: 'st',
        name: '立即'
      },
      {
        id: 10,
        code: 'qn',
        name: '每晚1次'
      },
      {
        id: 11,
        code: 'qod',
        name: '隔日1次'
      },
      {
        id: 12,
        code: 'tiw',
        name: '每周三次'
      },
      {
        id: 13,
        code: 'qw',
        name: '1次/周'
      },
      {
        id: 14,
        code: 'biw',
        name: '2次/周'
      },
      {
        id: 15,
        code: 'qow',
        name: '隔周一次'
      },
      {
        id: 16,
        code: '2w',
        name: '每两周一次'
      },
      {
        id: 17,
        code: '3w',
        name: '每三周一次'
      },
      {
        id: 18,
        code: '4w',
        name: '每四周一次'
      },
      {
        id: 19,
        code: 'Q.1.h',
        name: '每一小时一次'
      },
      {
        id: 20,
        code: 'Q.2.h',
        name: '每二小时一次'
      },
      {
        id: 21,
        code: 'Q.3.h',
        name: '每三小时一次'
      },
      {
        id: 22,
        code: 'Q.12.h',
        name: '每十二小时一次'
      }
    ];

    this.dic_use_way = [{
        id: 1,
        code: 'po',
        name: '口服'
      },
      {
        id: 2,
        code: 'ih',
        name: '皮下注射'
      },
      {
        id: 3,
        code: 'ivdrip',
        name: '静脉滴注'
      },
      {
        id: 4,
        code: 'iv',
        name: '静脉注射'
      },
      {
        id: 5,
        code: 'ip',
        name: '腹腔注射'
      },
      {
        id: 6,
        code: 'inh',
        name: '雾化吸入'
      },
      {
        id: 7,
        code: 'ig',
        name: '灌胃'
      },
      {
        id: 8,
        code: 'pr',
        name: '灌肠'
      },
      {
        id: 9,
        code: 'bgcx',
        name: '膀胱冲洗'
      },
      {
        id: 10,
        code: 'la',
        name: '局部麻醉'
      },
      {
        id: 11,
        code: 'ext',
        name: '外用'
      },
      {
        id: 12,
        code: 'sgy',
        name: '塞肛用'
      },
      {
        id: 13,
        code: 'ou',
        name: '滴眼用'
      },
      {
        id: 14,
        code: 'am',
        name: '上午'
      },
      {
        id: 15,
        code: 'im',
        name: '肌肉注射'
      },
      {
        id: 16,
        code: 'iadacum',
        name: '穴位注射'
      },
      {
        id: 17,
        code: 'nerve tissue',
        name: '神经组织'
      },
      {
        id: 18,
        code: 'sos',
        name: '需要时'
      },
      {
        id: 19,
        code: 'in',
        name: '吸入'
      },
      {
        id: 20,
        code: 'pm',
        name: '下午'
      }
    ];


  }

  get(dic_name, key_name_or_condition, key_value) {
    dic_name = this.convertToUnderscore(dic_name)
    const properties = Object.keys(this);
    for (const prop of properties) {
      if (prop === dic_name || prop === `dic_${dic_name}`) {
        const dictionary = this[prop];

        // 如果只传入字典名称，返回整个字典
        if (arguments.length === 1) {
          return dictionary;
        }

        // 如果传入键名和键值，返回匹配的单个项
        if (typeof key_name_or_condition === 'string') {
          return dictionary ? dictionary.find(item => item[key_name_or_condition] == key_value) || null : null;
        }

        // 如果传入一个条件函数，返回符合条件的所有项
        if (typeof key_name_or_condition === 'function') {
          return dictionary ? dictionary.filter(key_name_or_condition) : [];
        }
      }
    }

    // 如果未找到字典，返回空数组
    return [];
  }

  convertToUnderscore(inputString) {
    return inputString
      .replace(/([A-Z])/g, '_\$1') // 在每个大写字母前加上下划线
      .toLowerCase() // 将整个字符串转换为小写
      .replace(/^_/, ''); // 去掉开头的下划线（如果有的话）
  }

}

export default new MedicalDictionary();