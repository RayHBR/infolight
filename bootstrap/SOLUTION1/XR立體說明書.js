function insertXR(){
    window.top.addTab('W立體說明書','W立體說明書', 'bootstrap/W立體說明書');
}
function dgMaster_onUpdate(row)
{
    window.top.addTab('W立體說明書','W立體說明書', 'bootstrap/W立體說明書');
	return false;
}

function dgMaster_onSelect(index, row)
{
    sessionStorage.productType = row.專案代號;
}
