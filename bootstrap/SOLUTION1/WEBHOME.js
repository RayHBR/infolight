$.fn.disableIOSWrapper = true;
/*function login()
{
    $('#Logon1').logon('show',function(clientInfo) {
        var user = $.getVariableValue('user');
        $('#loginLink').html(user);
        window.location.reload();
    });
}*/

function login()
{
    var user = $.getVariableValue('user');
    if (user.length==0)  {
        $('#Logon1').logon('show',function(clientInfo) {
            user = $.getVariableValue('user');
            $('#loginLink').html(user);
            window.location.reload();
        });
    }
    else {
        $.confirm( "確認登出?", function() {
            $('#Logon1').logon('logout');
            $('#loginLink').html('登入');
        }); 
    }
}

function changePWD(){//20210421_ian_修改密碼
    if($('#loginLink').html().trim()=='登入'){
        $.alert('未登入，無法修改密碼','info');
    }
    else {
        $('#Logon1').logon('changePWD');
    }
}

$(function(){    
    $.callMethod('網頁上傳','getGTM',{type:1},function(result){
        var topHeadString = $("head", window.top.document).html();
        //判斷head是否已有註解
        result = result.replace(/\&gt;/g,'>');
        result = result.replace(/\&lt;/g,'<');        
        if (topHeadString.indexOf('<!-- Google Tag Manager -->') === -1) {
            $("head", window.top.document).append(result);
        }
    });
    $.callMethod('網頁上傳','getFB',{type:1},function(result){
        var topHeadString = $("head", window.top.document).html();
        //判斷head是否已有註解
        result = result.replace(/\&gt;/g,'>');
        result = result.replace(/\&lt;/g,'<');
        if (topHeadString.indexOf('<!-- FB -->') === -1) {
            $("head", window.top.document).append(result);
        }
    });
    $.callMethod('網頁上傳','getGTM',{type:2},function(result){
        var topBodyString = $("body", window.top.document).html();
        //判斷body是否已有註解
        result = result.replace(/\&gt;/g,'>');
        result = result.replace(/\&lt;/g,'<');
        if (topBodyString.indexOf('<!-- Google Tag Manager (noscript) -->') === -1) {            
            $("body", window.top.document).append(result);
        }	
    });
    window.top.document.title ='訊光';
    var showError = $.showError;
    $.showError = function(){
        sessionStorage.removeItem('clientInfo');
    };
    //$.showError = function(){};
    $.setVariableValue('website', 'infolight', function(){
        $.showError = showError;
        var user = $.getVariableValue('user');
        if (user.length>0) $('#loginLink').html(user);
    })
    $('body').on('click', '#xun_tab li', function(){
        $('#xun_tab').find('li.active').removeClass('active');
        $(this).addClass('active');
        $('.about_top').find('.tab_01').hide();
        var href = $(this).attr('href');
        $(href).fadeIn();
    })
})
function DataGrid1_消息內容_formatter(value, row, index)
{   // 消息連結格式化 
    var value = value.replace(/\s*/g,""); //去除消息內容空白
    var ret='<a onclick=openMsg(\''+row.連結+'\',\''+value+'\',\''+row.編號.toString()+'\') target="javascript:void(0)">'+value+'</a>';
    //var ret='<a onclick=openMsg(\''+row.連結+'\',\''+value+'\',\''+row.編號+'\') target="javascript:void(0)">'+value+'</a>';
    return ret;
}
function openMsg(url,value,id)
{  
    $('#Counter1').counter('addValue', id);
    window.open(url,value);
}
/* --------- QA JS Funtion ---------------    */
function openQA(menuItem){
    window.top.document.title = '訊光常見問答';
    var productType = '';   
    if (menuItem.caption == 'EEP.NET') productType = '001';       
    else if (menuItem.caption == 'Workflow') productType = '002';
    else if (menuItem.caption == 'RWD & APP 模組') productType = '003';
    else if (menuItem.caption == 'EEPCloud') productType = '010';
    else if (menuItem.caption == 'iCoder') productType = '011';
    sessionStorage.productType = productType;
    sessionStorage.productName = menuItem.caption;
    $.loadHtml('#body','#qa');
}
function DataList1_onSelect(index, row)
{
    $(this).find('.active').removeClass('active');
    $(this).find('.list-item').eq(index).addClass('active');
    $('#DataList2').datalist('setWhere',"類別=N'"+row.類別+"' AND 公司產品=N'"+row.公司產品+"'");
}
function DataList1_onBeforeLoad(param)
{
    var productType = sessionStorage.productType;
    var productName = sessionStorage.productName;
    if (productType){
        param.whereStr =  "公司產品='"+ productType +"'";
        $(".selector").val(productType);
    }else{
        param.whereStr =  "公司產品='001'";
        $(".selector").val('001');
    }
    //$('#Label2').html('常見問題/'+productName);
}
function DataList2_標題_formatter(value, row, index)
{
    //return '<span class="answer_Q pull-left"><span class="fa fa-quora" aria-hidden="true"></span>&nbsp'+value+'</span>';
    return '<span class="answer_Q pull-left"><img src="../file/images?q=Questions.png" width="35" height="30"</span>&nbsp'+ row.標題+'</span>';
}
function DataList2_回答_formatter(value, row, index)
{
    return '<span class="answer_A">'+row.回答+'</span>';
}
var loaded=false;
function DataList2_onBeforeLoad(param)
{
    if (!loaded) {
        var productType = sessionStorage.productType;
        if (productType){
            param.whereStr =  "公司產品='"+ productType +"'";
            loaded=true;
        }else{
            param.whereStr =  "公司產品='001'";
            loaded=true;
        }
    }
}
/* --------- DownLoad JS Funtion ---------------    */
function DataList3_onSelect(index, row)
{
    $(this).find('.active').removeClass('active');
    $(this).find('.list-item').eq(index).addClass('active');
    $('#DataGrid2').datagrid('setWhere',"類別='"+row.編號+"'");
}
function DataGrid2_項目_formatter(value, row, index)
{
    //var ret = '<a href="../file?q='+ encodeURIComponent(row.檔案) +'&f=Files">'+value+'</a>';
    //value = value.replace(/\s*/g,""); //去除項目空白
    var ret = '<a href="javascript:void(0)" onclick="downloadFile(\''+ row.編號 +'\',\''+ row.檔案 +'\')" style="color:#337ab7" >'+value+'</a>';
    return ret;
}
function downloadFile(id, name){
    $('#Counter2').counter('addValue', id);
    window.open('../file?q='+ encodeURIComponent(name) +'&f=Files');
}
$(function(){
    $('#BackTop').hide();
    $('#BackTop').click(function(){ 
        $('html,body').animate({scrollTop:0}, 333); //當點擊這個按鈕時，自動捲動到網頁最上方，0.333秒完成捲動的動作
    });
    $(window).scroll(function() {
        if ( $(this).scrollTop() > 600 ){ //判斷網頁可視範圍的最上方距離網頁頂端是否超過 300 px
            $('#BackTop').fadeIn(222);
        } else {
            $('#BackTop').stop().fadeOut(222);
        }
    }).scroll();
});
function openProduct(menuItem){
    var productNo = '';   
    if (menuItem.caption == 'EEP2019') productNo = '001';
    else if (menuItem.caption == 'Workflow') productNo = '002';       
    else if (menuItem.caption == 'RWD&APP模組') productNo = '003';
    else if (menuItem.caption == 'EEP.NETCore'){
        window.open('https://icoder.infolight.com/EEPNET_Core');                
    }
    else if (menuItem.caption == 'EEPCloud'){  
        sessionStorage.removeItem('clientInfo');
        window.open('https://icoder.infolight.com/icoder?m=EEPCloud_ICODER');//www會互相影響        
    }
    else if (menuItem.caption == 'iCoder'){
        window.open('https://icoder.infolight.com/icoder');        
    }
    sessionStorage.productNo = productNo;
}
function ImageList2_onClick(row)
{ 
    if(row.編號 == '012'){
        window.open('https://icoder.infolight.com/EEPNET_Core');
        $.loadHtml('#body','PRODUCTS');
    }
    if(row.編號 == '010'){
        window.open('https://icoder.infolight.com/icoder?m=EEPCloud_ICODER');
        $.loadHtml('#body','PRODUCTS');
    }
    if(row.編號 == '100'){
        window.open('https://icoder.infolight.com/icoder');
        $.loadHtml('#body','PRODUCTS');
    }
    sessionStorage.productNo =row.編號; // 記錄下商品號碼
    $.loadHtml('#body','PRODUCTS'); // 顯示商品明細頁
}
function openQA2(value){
    if (value == '001'){
        sessionStorage.productType = value;
        sessionStorage.productName = 'EEP.NET';  
    }
    if (value == '002'){
        sessionStorage.productType = value;
        sessionStorage.productName = 'Workflow';        
    }
    if (value == '003'){
        sessionStorage.productType = value;
        sessionStorage.productName = 'RWD & APP 模組';        
    }
    if (value == '010'){
        sessionStorage.productType = value;
        sessionStorage.productName = 'EEPCloud';        
    }
    if (value == '011'){
        sessionStorage.productType = value;
        sessionStorage.productName = 'iCoder';        
    }    
    $.loadHtml('#body','#qa');    
}
