exports.trs客戶資料表_員工資料表_onBeforeTrans = function(row, oldRow, fields,callback)
{
    var dm = this.dataModule;
    var clientInfo = dm.clientInfo;
    var sql = "SELECT 鎖定客戶數-目前鎖定數 AS 可鎖定數 from 員工資料表 Where 員工編號='"+row.負責業務+"'"; // 取出可鎖定數
    dm.queryRaw(clientInfo, clientInfo.database, sql, {}, function(err,datas) {
        if (err) callback(err);
        else if (datas.length>0 && datas[0].可鎖定數!=null && datas[0].可鎖定數<=0) callback(new Error('無法鎖定! 鎖定客戶數已經超過限制!'));
        else if (row!=null && row.負責業務.length==0) {
            row.負責業務 = '000';
            callback(null, true);
        }
        else if (oldRow!=null && oldRow.負責業務.length==0) {
            oldRow.負責業務 = '000';
            callback(null, true);
        }
        else callback(null, true); // callback要return true讓TRS繼續交易
    });
};
