var temp_id = '';
var new_id = '';
var in_list = false;
$(function(){
    $('#openLeft').hide();
    var type = sessionStorage.productType; 
    if (type.length>0) {
        sessionStorage.productType = '';
        $.callMethod('W立體說明書','searchXR',{projectId:type},function(results){ 
            var rows = JSON.parse(results);
            $(`#DataList2`).find('br').remove();
            $(`#DataList3`).find('br').remove();
            $(`#DataList4`).find('br').remove();
            $('#dgMasterqueryObj_專案代號').setDisabled(true);
            $('#dgMasterqueryObj_專案代號').val(rows[0].專案代號);
            $('#dgMasterqueryObj_專案名稱').val(rows[0].專案名稱);
            for(i=0;i<rows.length;i++) {
                var name = rows[i].長度 + '_';
                if (rows[i].填寫噴嘴 == 'Y') {
                    name += `${rows[i].上噴嘴}:${rows[i].下噴嘴}_${rows[i].組成}`;
                }
                if(rows[i].LINEID == 1){
                    $(`#dgMasterqueryObj_點數1`).numberbox('setValue', rows[i].點數);
                    $(`#dgMasterqueryObj_連板數1`).numberbox('setValue', rows[i].連板數);
                    $(`#DataList2`).children().children().children()[1].innerHTML += '<div style="display:inline-block;" ondragstart="list_dragstart(event);" ondrop="item_drop(event);">' + 
                        `<img id="${rows[i].類別編號}_${rows[i].型號}_2_${i+1}_${rows[i].位置}" name="${name}" src="../file?q=${rows[i].圖片}&f=設備列表" class="img-responsive" style="cursor:pointer;display:inline-block;">` + '</div>';
                }
                else if (rows[i].LINEID == 2){
                    $(`#dgMasterqueryObj_點數2`).numberbox('setValue', rows[i].點數);
                    $(`#dgMasterqueryObj_連板數2`).numberbox('setValue', rows[i].連板數);
                    $(`#DataList3`).children().children().children()[1].innerHTML += '<div style="display:inline-block;" ondragstart="list_dragstart(event);" ondrop="item_drop(event);">' + 
                        `<img id="${rows[i].類別編號}_${rows[i].型號}_3_${i+1}_${rows[i].位置}" name="${name}" src="../file?q=${rows[i].圖片}&f=設備列表" class="img-responsive" style="cursor:pointer;display:inline-block;">` + '</div>';
                }
                else if (rows[i].LINEID == 3){
                    $(`#dgMasterqueryObj_點數3`).numberbox('setValue', rows[i].點數);
                    $(`#dgMasterqueryObj_連板數3`).numberbox('setValue', rows[i].連板數);
                    $(`#DataList4`).children().children().children()[1].innerHTML += '<div style="display:inline-block;" ondragstart="list_dragstart(event);" ondrop="item_drop(event);">' + 
                        `<img id="${rows[i].類別編號}_${rows[i].型號}_4_${i+1}_${rows[i].位置}" name="${name}" src="../file?q=${rows[i].圖片}&f=設備列表" class="img-responsive" style="cursor:pointer;display:inline-block;">` + '</div>';
                }
            }
            setTimeout("check_tag()", 100);
        });
    }
})
function openEQ(value) {
    $('#DataList1').children().remove();
    $('#DataList1').datalist('options').whereStr = 'A.類別編號=' + value;
    $('#DataList1').datalist('load');
}
function DataList1_onLoad(data)
{
    for(i=0;i<$("#DataList1").children().length; i++) {
        $("#DataList1").children()[i].classList.remove("list-item");
    }
}
function dlTitle_onLoad(data)
{
    $("#dlTitle").children()[0].classList.remove("list-item");
}
function DataList1_型號_formatter(value, row, index)
{
    return `<p style="color:black">${value}</p>`;
}
function DataList1_圖片_formatter(value, row, index)
{
    var name = row.長度 + '_';
    if (row.填寫噴嘴 == 'Y') {
        var type = row.組合方式.split(':');
        if (type[0]=='C' || type[1]=='C'){
            name += 'N:';
        }
        else {
            name += 'Y:';
        }
        if (type[2]=='C' || type[3]=='C'){
            name += 'N';
        }
        else {
            name += 'Y';
        }
        name += `_${row.組合方式}`;
    }
    return `<img id="${row.類別編號}_${row.型號}_1_0_${row.位置}" name="${name}" src="../file?q=${value}&f=設備列表" class="img-responsive" style="cursor:pointer;display:inline-block;" draggable="true" ondragstart="list_dragstart(event);"><br><br>`;
}
function DataList2_型號_formatter(value, row, index)
{
    return `<p style="color:black">型號</p>`;
}
function DataList2_圖片_formatter(value, row, index)
{
    return `<p style="color:black">圖片</p>`;
}
function list_dragstart(event){
    event.dataTransfer.setData("id", event.target.id.split('_')[0]);
    event.dataTransfer.setData("type", event.target.id.split('_')[1]);
    event.dataTransfer.setData("line", event.target.id.split('_')[2]);
    event.dataTransfer.setData("no", event.target.id.split('_')[3]);
    event.dataTransfer.setData("loc", event.target.id.split('_')[4]);
    event.dataTransfer.setData("write", event.target.name);
}
function dragover(event){
    in_list = true;
    event.currentTarget.style.background = "lightblue";
    event.preventDefault();
}
function dragleave(event){
    in_list = false;
    event.currentTarget.style.background = "white";
    event.preventDefault();
}
function del_dragover(event){
    event.preventDefault();
}
function del_list_drop(event){
    var id = event.dataTransfer.getData("id");
    var type = event.dataTransfer.getData("type");
    var line = event.dataTransfer.getData("line");
    var no = event.dataTransfer.getData("no");
    var loc = event.dataTransfer.getData("loc");
    if(line!=1&&!in_list){
        if (loc == 'F' && $(`#${id}_${type}_${line}_${no}_${loc}`).parent().parent().children().length != 1){
            return false;
        }
        $.confirm("確認是否刪除?", function() {
            $(`#${id}_${type}_${line}_${no}_${loc}`).parent().remove();
            check_tag();
        });
    }
}
function list_drop(event){
    var id = event.dataTransfer.getData("id");
    var type = event.dataTransfer.getData("type");
    var line = event.dataTransfer.getData("line");
    var no = event.dataTransfer.getData("no");
    var loc = event.dataTransfer.getData("loc");
    var write = event.dataTransfer.getData("write");
    var currentId = 0;
    var newNo = 1;
    if (event.currentTarget.id == "DataList2") {
        currentId = 2;
    }
    else if (event.currentTarget.id == "DataList3"){
        currentId = 3;
    }
    else if (event.currentTarget.id == "DataList4"){
        currentId = 4;
    }
    $(`#${event.currentTarget.id}`).find('br').remove();
    try {
        if (currentId != 0) {
            if ($(`#DataList${currentId}`).children().children().children().find('div').length != 0) {
                for(i=0;i<$(`#DataList${currentId}`).children().children().children().children().length;i++) {
                    var a = $(`#DataList${currentId}`).children().children().children().children()[i];
                    if(parseInt($(`#DataList${currentId}`).find(a).children()[0].id.split('_')[3]) > newNo) {
                        newNo = parseInt($(`#DataList${currentId}`).find(a).children()[0].id.split('_')[3]);
                    }
                }
                newNo = newNo + 1;
            }
            if (line == "1") {
                if (temp_id != '') {
                    if (loc == 'F') {
                        if (temp_id.split('_')[4] != 'F') { 
                            check_tag();
                            event.currentTarget.style.background = "white";
                            temp_id = '';
                            $.alert('只能放第一位！','info');
                            return false;
                        }
                    }
                    else if (loc == 'M') {
                        if (temp_id.split('_')[4] == 'F' || temp_id.split('_')[4] == 'E') { 
                            check_tag();
                            event.currentTarget.style.background = "white";
                            temp_id = '';
                            $.alert('只能放中間！','info');
                            return false;
                        }
                    }
                    else if (loc == 'E') {
                        if ($(`#${temp_id}`).parent().parent().children().children()[$(`#${temp_id}`).parent().parent().children().children().length - 1].id != temp_id) {
                            check_tag();
                            event.currentTarget.style.background = "white";
                            temp_id = '';
                            $.alert('只能放最後！','info');
                            return false;
                        }
                    }
                    var temp_HTML = $(`#${id}_${type}_1_0_${loc}`)[0].outerHTML.replace(`id="${id}_${type}_1_0_${loc}"`, `id="${id}_${type}_${temp_id.split('_')[2]}_${newNo}_${loc}"`);
                    new_id = `${id}_${type}_${temp_id.split('_')[2]}_${newNo}_${loc}`;
                    $(`#${temp_id}`)[0].outerHTML = temp_HTML;
                    if(write.split('_')[1]!="") {
                        $('#dgMasterqueryObj').show();
                    }
                    temp_id = '';
                }
                else {
                    if (loc == 'F') {
                        if ($(`#${event.currentTarget.id}`).children().children().children().children().length != 0) {
                            check_tag();
                            event.currentTarget.style.background = "white";
                            $.alert('只能放第一位！','info');
                            return false;
                        }
                    }
                    else if (loc == 'M') {
                        if ($(`#${event.currentTarget.id}`).children().children().children().children().length == 0 ||
                            $(`#${event.currentTarget.id}`).children().children().children().children().children()[$(`#${event.currentTarget.id}`).children().children().children().children().children().length - 1].id.split('_')[4] == 'E') {
                            check_tag();
                            event.currentTarget.style.background = "white";
                            $.alert('只能放中間！','info');
                            return false;
                        }
                    }
                    else if (loc == 'E') {
                        if ($(`#${event.currentTarget.id}`).children().children().children().children().length == 0) {
                            check_tag();
                            event.currentTarget.style.background = "white";
                            $.alert('只能放最後！','info');
                            return false;
                        }
                    }
                    $(`#${event.currentTarget.id}`).children().children().children()[1].innerHTML += '<div style="display:inline-block;" ondragstart="list_dragstart(event);" ondrop="item_drop(event);">' + 
                        $(`#${id}_${type}_1_0_${loc}`)[0].outerHTML.replace(`id="${id}_${type}_1_0_${loc}"`, `id="${id}_${type}_${currentId}_${newNo}_${loc}"`).replace('draggable="true" ondragstart="list_dragstart(event);" ondrop="item_drop(event);"', '') + '</div>';
                    new_id = `${id}_${type}_${currentId}_${newNo}_${loc}`;
                    if(write.split('_')[1]!="") {
                        $('#dgMasterqueryObj').show();
                    }
                }
            }
            else if (temp_id == ''){
                if (loc == 'F') {
                    if ($(`#${event.currentTarget.id}`).children().children().children().children().length != 0 || $(`#DataList${line}`).children().children().children().children().length != 1) {
                        check_tag();
                        event.currentTarget.style.background = "white";
                        $.alert('只能放第一位！','info');
                        return false;
                    }
                }
                else if (loc == 'M') {
                    if ($(`#${event.currentTarget.id}`).children().children().children().children().length == 0 ||
                        $(`#${event.currentTarget.id}`).children().children().children().children().children()[$(`#${event.currentTarget.id}`).children().children().children().children().children().length - 1].id.split('_')[4] == 'E') {
                        check_tag();
                        event.currentTarget.style.background = "white";
                        $.alert('只能放中間！','info');
                        return false;
                    }
                }
                else if (loc == 'E') {
                    if ($(`#${event.currentTarget.id}`).children().children().children().children().length == 0) {
                        check_tag();
                        event.currentTarget.style.background = "white";
                        $.alert('只能放最後！','info');
                        return false;
                    }
                }
                var newHTML = $(`#${id}_${type}_${line}_${no}_${loc}`)[0].outerHTML;
                $(`#${id}_${type}_${line}_${no}_${loc}`).parent().remove();
                $(`#${event.currentTarget.id}`).children().children().children()[1].innerHTML += '<div style="display:inline-block;" ondragstart="list_dragstart(event);" ondrop="item_drop(event);">' +
                    newHTML + '</div>';
                document.getElementById(`${id}_${type}_${line}_${no}_${loc}`).id = `${id}_${type}_${currentId}_${newNo}_${loc}`;
            }
            else if (temp_id != '') {
                var newNo2 = 1;
                if (loc == 'F') {
                    if (temp_id.split('_')[4] != 'F') { 
                        check_tag();
                        event.currentTarget.style.background = "white";
                        temp_id = '';
                        $.alert('只能放第一位！','info');
                        return false;
                    }
                }
                else if (loc == 'M') {
                    if (temp_id.split('_')[4] == 'F' || temp_id.split('_')[4] == 'E') { 
                        check_tag();
                        event.currentTarget.style.background = "white";
                        temp_id = '';
                        $.alert('只能放中間！','info');
                        return false;
                    }
                }
                else if (loc == 'E') {
                    if ($(`#${temp_id}`).parent().parent().children().children()[$(`#${temp_id}`).parent().parent().children().children().length - 1].id != temp_id) {
                        check_tag();
                        event.currentTarget.style.background = "white";
                        temp_id = '';
                        $.alert('只能放最後！','info');
                        return false;
                    }
                }
                if ($(`#DataList${line}`).children().children().children().children().find('div').length != 0) {
                    for(i=0;i<$(`#DataList${line}`).children().children().children().children().length;i++) {
                        var b = $(`#DataList${line}`).children().children().children().children()[i];
                        if(parseInt($(`#DataList${line}`).find(b).children()[0].id.split('_')[3]) > newNo2) {
                            newNo2 = parseInt($(`#DataList${line}`).find(b).children()[0].id.split('_')[3]);
                        }
                    }
                    newNo2 = newNo2 + 1;
                }
                var temp_HTML = $(`#${id}_${type}_${line}_${no}_${loc}`)[0].outerHTML.replace(`id="${id}_${type}_${line}_${no}_${loc}"`, `id="${id}_${type}_${temp_id.split('_')[1]}_${newNo2}_${loc}"`);
                $(`#${id}_${type}_${line}_${no}_${loc}`)[0].outerHTML = $(`#${temp_id}`)[0].outerHTML.replace(`id="${temp_id}"`, `id="${temp_id.split('_')[0]}_${temp_id.split('_')[1]}_${line}_${newNo}_${temp_id.split('_')[4]}"`);
                $(`#${temp_id}`)[0].outerHTML = temp_HTML;
                temp_id = '';
            }
        }
        event.currentTarget.style.background = "white";
        check_tag();
        event.preventDefault();
    }
    catch(err){
        event.currentTarget.style.background = "white";
        check_tag();
        event.preventDefault();
    }
}
function item_drop(event){
    temp_id = event.currentTarget.children[0].id;
}
function ok() {
    var up = $('#PromptDialog_上噴嘴').combobox('getValue');
    var down = $('#PromptDialog_下噴嘴').combobox('getValue');
    var limit = $(`#${new_id}`)[0].name.split('_')[1].split(':');
    if(up == '0' || down == '0') {
        $.alert('此為必填！','info');
        return false;
    }
    if (limit[0] == 'N' && up == "16" ) {
        $.alert('上噴嘴不可選擇16！','info');
        return false;
    }
    if (limit[1] == 'N' && down == "16") {
        $.alert('下噴嘴不可選擇16！','info');
        return false;
    }
    var a = $(`#${new_id}`)[0].name.split('_')[0];
    var b = $(`#${new_id}`)[0].name.split('_')[2];
    $(`#${new_id}`)[0].name = `${a}_${up}:${down}_${b}`
    new_id = '';
    check_tag();
    $('#PromptDialog_上噴嘴').combobox('setValue', '0');
    $('#PromptDialog_下噴嘴').combobox('setValue', '0');
    $('#dgMasterqueryObj').hide();
}
function cancel() {
    $(`#${new_id}`).parent()[0].remove();
    check_tag();     
    $('#PromptDialog_上噴嘴').combobox('setValue', '0');
    $('#PromptDialog_下噴嘴').combobox('setValue', '0');
    $('#dgMasterqueryObj').hide();
}
function check_tag(){
    for(i=1;i<=3;i++){
        var tag = '<p style="color:red;display:inline-block;">&nbsp&nbsp&nbsp</p>';
        for(j=0;j<$(`#DataList${i+1}`).children().children().children().find('div').length;j++){
            if (j==0){
                tag += `<img style="width:${$(`#DataList${i+1}`).find($(`#DataList${i+1}`).children().children().children().children()[j]).children()[0].width}px;">`;
            }
            else {
                tag += `<img style="width:${$(`#DataList${i+1}`).find($(`#DataList${i+1}`).children().children().children().children()[j]).children()[0].width-12}px;">`;
            }
            tag += '<p style="color:red;display:inline-block;">▴</p>';
        }
        $(`#line${i}_tag`)[0].innerHTML = tag;
        $(`#DataList${i+1}`).find('span').remove();
        var width = 10;
        for(j=0;j<$(`#DataList${i+1}`).children().children().children().find('div').length;j++){
            var a = $(`#DataList${i+1}`).children().children().children().children()[j];
            var name = $(`#DataList${i+1}`).find(a).children()[0].name;
            var b = '';
            if(name!=undefined) {
                b = name.split('_')[1];
            }
            if(name!=undefined && b != '' && b.split(':')[0] != 'Y' && b.split(':')[0] != 'N') {
                var check_id = $(`#DataList${i+1}`).find($(`#DataList${i+1}`).children().children().children().children()[j]).children()[0].id;
                var check_name = $(`#DataList${i+1}`).find($(`#DataList${i+1}`).children().children().children().children()[j]).children()[0].name;
                $(`<span style="font-size:18px;color:red;position:absolute;top:15px;left:${width+42}px">${check_name.split('_')[1].split(':')[0]}</span><span style="font-size:18px;color:red;position:absolute;top:55px;left:${width+42}px">${check_name.split('_')[1].split(':')[1]}</span>`).appendTo($(`#${check_id}`).parent('div'));
                var a = $(`#DataList${i+1}`).children().children().children().children()[j];
                width += $(`#DataList${i+1}`).find(a).children()[0].width;
            }
            else {
                var a = $(`#DataList${i+1}`).children().children().children().children()[j];
                width += $(`#DataList${i+1}`).find(a).children()[0].width;
            }
        }
        if ($(`#DataList${i+1}`).children().children().children().children().length == 0) {
            $(`#DataList${i+1}`).children().children().children()[1].innerHTML = "<br><br><br><br>";
        }
    }
}
function closeLeft(){
    $('#EQ').parent().parent().hide();
    $('#DataList2').parent().toggleClass('col-xs-12').toggleClass('col-xs-8').toggleClass('col-sm-9');
    $('#closeLeft').hide();
    $('#openLeft').show();
}
function openLeft(){
    $('#EQ').parent().parent().show();
    $('#DataList2').parent().toggleClass('col-xs-8').toggleClass('col-sm-9').toggleClass('col-xs-12');
    $('#openLeft').hide();
    $('#closeLeft').show();
}
function save(value){
    var datas = [];
    var obj = {};
    var obj_line1 = {"lineId": 1};
    var obj_line2 = {"lineId": 2};
    var obj_line3 = {"lineId": 3};
    var obj_line_des = [];
    var obj_line_temp = {};
    obj["projectId"] = $('#dgMasterqueryObj_專案代號').val();
    obj["projectName"] = $('#dgMasterqueryObj_專案名稱').val();
    obj["salesman"] = $.getVariableValue('user'); 
    for (i=1;i<4;i++) {
        obj_line_des = [];
        for(j=0;j<$(`#DataList${i+1}`).children().children().children().find('div').length;j++){
            obj_line_temp = {};
            var a = $(`#DataList${i+1}`).children().children().children().children()[j];
            var id = $(`#DataList${i+1}`).find(a).children()[0].id;
            var name = $(`#DataList${i+1}`).find(a).children()[0].name;
            obj_line_temp["id"] = id.split('_')[0];
            obj_line_temp["machine"] = id.split('_')[1];
            if (name.split('_')[1] == ''){
                obj_line_temp["combine"] = '';
            }
            else {
                obj_line_temp["combine"] = name.split('_')[2];
            }
            obj_line_temp["width"] = name.split('_')[0];
            obj_line_temp["nozzle"] = name.split('_')[1];
            obj_line_temp["no"] = j + 1;
            obj_line_des.push(obj_line_temp);
        }
        if (i==1){
            obj_line1["node"] = parseInt($('#dgMasterqueryObj_點數1').val()) ? parseInt($('#dgMasterqueryObj_點數1').val()):0;
            obj_line1["plate"] = parseInt($('#dgMasterqueryObj_連板數1').val()) ? parseInt($('#dgMasterqueryObj_連板數1').val()):0;
            obj_line1["description"] = obj_line_des;
        }
        else if (i==2){
            obj_line2["node"] = parseInt($('#dgMasterqueryObj_點數2').val()) ? parseInt($('#dgMasterqueryObj_點數2').val()):0;
            obj_line2["plate"] = parseInt($('#dgMasterqueryObj_連板數2').val()) ? parseInt($('#dgMasterqueryObj_連板數2').val()):0;
            obj_line2["description"] = obj_line_des;
        }
        else if (i==3){
            obj_line3["node"] = parseInt($('#dgMasterqueryObj_點數3').val()) ? parseInt($('#dgMasterqueryObj_點數3').val()):0;
            obj_line3["plate"] = parseInt($('#dgMasterqueryObj_連板數3').val()) ? parseInt($('#dgMasterqueryObj_連板數3').val()):0;
            obj_line3["description"] = obj_line_des;
        }
    }
    datas.push(obj);
    datas.push(obj_line1);
    datas.push(obj_line2);
    datas.push(obj_line3);
    if (value == "save"){
        $.callMethod('W立體說明書','insertXR',{datas:datas},function(result){ 
            $.alert(' 存檔成功!','info');
        });
    }
    else if (value == "upload") {
        var post_data = {
            "url": "https://pns.pist.com.tw:4443/api/device",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "X-Api-Key": "SFJFgjwefegihgtaslfifhernfkghaofk",
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(datas),
        };
        $.ajax(post_data).done(function (response) {
            $.callMethod('W立體說明書','insertXR',{datas:datas},function(result){ 
                $.alert('上傳成功!','info');
            });
        });
    }
}
