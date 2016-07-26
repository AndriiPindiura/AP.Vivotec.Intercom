var flag = false;
var intRowIndex = 0;
var ActiveX_Version = '1,0,0,162';


// ActiveX Support Detection
function DetectionActiveXSupport() {
    if (navigator.userAgent.toLowerCase().indexOf('msie') != -1)
        return true;

    return false;
}



// ***** XMLHttp *****
// ===== Create XMLHttpRequest ======
var xmlHttp;

function createXHR() {

    if (window.XMLHttpRequest)
        xmlHttp = new XMLHttpRequest();
    else if (window.ActiveXObject)
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');

    if (!xmlHttp) {
        alert('YOUR BROWSER DON\'T SUPPORT XMLHTTP');
        return false;
    }
}

// ===== XMLHttp.Resquest ===== 
// ----- Result "flag = true" -----
function catchResult_flag() {

    if (xmlHttp.readyState == 4)	// Connect complete
        if (xmlHttp.status == 200)	// process complete
            flag = true;
        else
            alert('Error:' + xmlHttp.status);
}

/*
// ----- Result alert("Save OK") -----
function catchResult_alert_OK(){

	if( xmlHttp.readyState == 4 )
		if( xmlHttp.status == 200 )
			alert('Save OK');
}

// ----- Result alert("OK"), flag = true, set_html_item_status(false) -----
function catchResult_alert_OK_item_status(){

	if( xmlHttp.readyState == 4 )
		if( xmlHttp.status == 200 ){
			alert('Save OK');
			flag = true;
			set_html_item_status( false );
		}
}

// ----- Result flat = true, set_html_item_status(false) -----
function catchResult_item_status(){

	if( xmlHttp.readyState == 4 )
		if( xmlHttp.status == 200 ){
			flag = true;
			set_html_item_status( false );
		}
}

// ===== POST Process =====
function xmlHttp_process( url, para ){

	xmlHttp.open( 'POST', url, true );
	xmlHttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
	xmlHttp.send( para );
}
*/

// ===== Check AM-43XX IS WIFI Exist =====
function IsAM43xx_Wifi(model, netinf) {
    //system_deviceinformation_model = 'AM4311-E'; 
    var iPos = model.indexOf("AM43");

    if (iPos < 0)
        return false;

    var WPS = Math.floor(parseInt(netinf) / 16); // 0 : Ralink RT73 BG, 1: Ralink RT3370 BGN, 2: Realtek RTL8192 BGN, F: No wifi	
    if (WPS == 15)
        return false;

    return true;
}


// ===== GET Process =====
function xmlHttp_process_GET(url) {

    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
}
// =========================================================================================================================

// ===== HTML item =====
function disable_input(ID) {

    document.getElementById(ID).disabled = true;
}

function enable_input(ID) {

    document.getElementById(ID).disabled = false;
}

// ----- set_html_item_status(stat) -----
function set_html_item_status(stat) {

    for (var i = 0; i < document.all.tags('select').length; i++)
        document.all.tags('select').item(i).disabled = stat;

    for (i = 0; i < document.all.tags('input').length; i++)
        document.all.tags('input').item(i).disabled = stat;
}

// ----- Hidden item or items -----
function select_display(ID, SW_ID) {    // checkbox => hidden or show multiple elements ID:array(),SW_ID: is a switch id

    if (typeof (ID) == 'string') {
        if (!document.getElementById(SW_ID).checked)
            document.getElementById(ID).style.display = 'none';
        else
            document.getElementById(ID).style.display = '';
    }
    else {
        for (var i = 0; i < ID.length; i++)
            if (!document.getElementById(SW_ID).checked)
                document.getElementById(ID[i]).style.display = 'none';
            else
                document.getElementById(ID[i]).style.display = '';
    }
}

// ----- Disable item or items -----
function checkbox_ctrl(ctrl, ID) {                        // checkbox => disabled or enabled single "input"

    if (document.getElementById(ctrl).checked == true)
        document.getElementById(ID).disabled = false;
    else
        document.getElementById(ID).disabled = true;
}

function checkbox_ctrl_array(ctrl, arrayID) {             // checkbox => disabled or enabled multiple "input"

    if (document.getElementById(ctrl).checked == true)
        for (var i = 0; i < arrayID.length; i++)
            document.getElementById(arrayID[i]).disabled = false;
    else
        for (var i = 0; i < arrayID.length; i++)
            document.getElementById(arrayID[i]).disabled = true;
}

// ===== Check =====
// ----- 當keyin 不是 0-9 return false (輸入時)-----
function Check_Num() {

    if ((event.keyCode < 48) || (event.keyCode > 57))
        return false;
}

// ----- 當keyin 不是 0-9 return false (Save時) -----
function Check_ifNum(ID, AlertName) {

    var str = document.getElementById(ID).value;

    for (var i = 0; i < str.length; i++)
        if (str.charCodeAt(i) > 57 || str.charCodeAt(i) < 48) {
            alert(AlertName + ' ' + IsNum);
            return true;
        }
}

// ----- 當key in 不是"數字"或"點" return false -----
function Check_Num_Point() {

    if (!((event.keyCode > 47) && (event.keyCode < 58) || (event.keyCode == 46)))
        return false;
}

// ----- 當key in 有中文時, return true -----
function Check_chinese(ID, AlertName) {

    var str = document.getElementById(ID).value;

    for (var i = 0; i < str.length; i++)
        if (str.charCodeAt(i) > 128) {
            alert(AlertName + ' ' + NotChinese + ' !!');
            return true;
        }

    return false;
}

// ----- 檢查是否沒有輸入 -----
function isempty(ID, AlertName) {

    var str = document.getElementById(ID).value;

    if (str == '') {
        alert(AlertName + ' ' + Is_Empty);
        return true;
    }
    else
        return false;
}




String.prototype.Blength = function () {
    var arr = this.match(/[^\x00-\xff]/ig);
    return arr == null ? this.length : this.length + arr.length;
}


// ----- 檢查字串長度( html Id, 長度, 警告名稱 ) -----
function check_strlen(ID, Min, Max, AlertName) {
    var str = document.getElementById(ID).value;

    //if( str.length > Max ){
    //alert ( "string Byte Length : " + str.Blength() + " --> " + getStrLength(str) );
    //if( str.Blength() > Max ){
    if (getStrLength(str) > Max) {
        alert(AlertName + ' ' + Length + ' > ' + Max);
        return true;
    }
        //else if( str.length < Min ){
        //else if( str.Blength() < Min ){
    else if (getStrLength(str) < Min) {
        alert(AlertName + ' ' + Length + ' < ' + Min);
        return true;
    }
    else
        return false;
}

function getStrLength(str) {
    var length = 0;
    for (var i = 0; i < str.length; i++) {
        word = str.charCodeAt(i);
        if (word > 255)
            length += 3
        else
            length++;
    }
    return length;
}

// ----- 不允許輸入 '%'(37), '&'(38), 單引號(39), 等號(61), '\'反斜線(92), '`'重音符號_Grave accent(96), '~'取代符號Tilde(126), 等號(61), '/'反斜線(47) 有特殊字元 return true -----
// 暫時只允許A-Z, a-z, 0-9, @, $, space, [, ]
function check_special_word(ID, AlertName) {
    var str = document.getElementById(ID).value;


    for (var i = 0; i < str.length; i++) {
        word_x = str.charCodeAt(i);

        if (((word_x >= 58) && (word_x <= 63)) ||
			 ((word_x >= 91) && (word_x <= 96)) ||
			  (word_x >= 123) ||
			  (word_x <= 47)) {
            if ((word_x == 32) || // Space
				   (word_x == 36) || // $
				   (word_x == 45) || // -
				   (word_x == 46) || // .
				   (word_x == 47) || // /
				   (word_x == 58) || // :
				   (word_x == 64) || // @
				   (word_x == 91) || // [
				   (word_x == 93) || // ]
				   (word_x == 95) || // _
				   (word_x > 255)) // Unicode
                continue;
            if ((i > 0) && (word_x == 46))
                continue;

            alert(AlertName + ' ' + Allow + ' [ A-Z, a-z, 0-9, @, $, _, [, ], ., :, / ]');

            return true;
        }
    }
    return false;

}
/*
function check_special_word( ID, AlertName ){   

	var str = document.getElementById(ID).value;

	for( var i = 0; i < str.length; i++ ){
		word_x = str.charCodeAt(i);

		if( word_x == 37 || word_x == 38 || word_x == 39 || word_x == 61 || word_x == 92 || word_x == 96 || word_x == 126 || word_x == 47){
			alert( AlertName +' '+ CanNot +' [ & \' = \\ % ]');
			return true;			
		}
	}
	return false;
}
*/
// ----- 不允許輸入 '%'(37), '&'(38), 單引號(39), 等號(61), '/'反斜線(47), '\'反斜線(92) 有特殊字元 return true -----
function check_special_word2(ID, AlertName) {

    var str = document.getElementById(ID).value;

    for (var i = 0; i < str.length; i++) {
        word_x = str.charCodeAt(i);

        if (word_x == 37 || word_x == 38 || word_x == 39 || word_x == 44 || word_x == 47 || word_x == 61 || word_x == 92) {
            alert(AlertName + ' ' + CanNot + ' [ & \' , = \\ / % ]');
            return true;
        }
    }

    return false;
}

// ----- 檢查 IP 格式 -----
function checkIP(ID) {

    var ip_address = document.getElementById(ID).value;
    var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

    if (ip_address.match(exp) == null)
        return true;    // wrong IP address
    else
        return false;  // right IP address
}

// ----- 檢查 e-mail 格式 -----
function validateEmail(email) {

    var email_exp = /^[^\s]+@[^\s]+\.[^\s]{2,3}$/;

    if (email_exp.test(email))
        return true;
    else
        return false;
}

// ----- 檢查 數字範圍 min < value < max -----
function check_num_value(ID, Min, Max) {

    var num = parseInt(document.getElementById(ID).value);

    if (num > Max || num < Min)
        return true;
    else
        return false;
}

// ----- 檢查有無"空白" -----
function check_space(ID) {

    var sp = document.getElementById(ID).value;

    for (var i = 0; i < sp.length; i++)
        if (sp.charAt(i) == ' ')
            return true;

    return false;
}

// ******************************************************************
// ******************************************************************
// ----- 只能輸入英數( 0-9, a-z, A-Z ) -----
function check_word(ID, AlertName) {

    str = document.getElementById(ID).value;
    chk = str.match(/[^A-z0-9]/g);

    if (chk) {
        alert(AlertName + ' ' + IsEnNum);
        return true;
    }
    else
        return false;
}

// ***************************
// ***** Active-X function *****
// ***************************
// ===== write Active-X string =====
function give_activex(ax_width, ax_height) {

    var Browser = Get_Browser_Info();

    if (Browser.match('IE'))
        var ActiveX_str = '<OBJECT ID="RTSPCtl" width="' + ax_width + '" height="' + ax_height + '" CLASSID="CLSID:1384A8DE-7296-49DA-B7F8-8A9A5984BE52" CODEBASE="/AxRTSP.cab#version=' + ActiveX_Version + '"></OBJECT>';
    else {
        var remote_address = give_remote_addr();

        var ActiveX_str = '<object ID="RTSPCtl" width="' + ax_width + '" height="' + ax_height + '" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab">';
        ActiveX_str += '<param name="src" value="http://' + remote_address + '/viewer/underwater/quicktime/qt.mov">';
        ActiveX_str += '<param name="qtsrc" value="rtsp://' + remote_address + ':554/v01>';
        ActiveX_str += '<param name="controller" value="true">';
        ActiveX_str += '<param name="scale" value="tofit">';
        ActiveX_str += '<param name="autoplay" value="true">';
        ActiveX_str += '<param name="volume" value="55">';
        ActiveX_str += '<param name="showlogo" value="true">';
        ActiveX_str += '<param name="moviename" value="Camera">';
        ActiveX_str += '<param name="cache" value="false">';
        ActiveX_str += '<param name ="qtsrcdontusebrowser" value="TRUE">';
        ActiveX_str += '<embed';
        ActiveX_str += ' src="http://' + remote_address + '/viewer/underwater/quicktime/qt.mov"';
        ActiveX_str += ' width="' + ax_width + '" height="' + ax_height + '"';
        ActiveX_str += ' controller="true"';
        ActiveX_str += ' scale="tofit"';
        ActiveX_str += ' autoplay="true"';
        ActiveX_str += ' volume="55"';
        ActiveX_str += ' showlogo="false"';
        ActiveX_str += ' moviename="Camera"';
        ActiveX_str += ' cache="false"';
        ActiveX_str += ' qtsrc="rtsp://' + remote_address + ':554/v01"';
        ActiveX_str += ' qtsrcdontusebrowser="TRUE"';
        ActiveX_str += ' type="video/quicktime"';
        ActiveX_str += ' pluginspage="http://www.apple.com/quicktime/download/">';
        ActiveX_str += '</embed>';
        ActiveX_str += '</object>';
    }

    return ActiveX_str;
}

// ===== Return IP Address =====
function give_remote_addr() {

    var addr = location.href + ';';
    var addr_start = addr.indexOf('/') + 2;

    var addr_sign_start = addr.indexOf(':') + 1;
    var addr_sign_end = addr.indexOf(':', addr_sign_start);

    if (addr_start != 1) {
        if (addr_sign_end != -1)
            var addr = addr.substring(addr_start, addr_sign_end);
        else {
            var addr_end = addr.indexOf('/', addr_start);
            addr = addr.substring(addr_start, addr_end);
        }

        document.getElementById('remote_addr').value = addr;

        return addr;
    }
    else {
        alert('Ineffective IP Address');
        location.href('../index.html');
        return false;
    }
}

// ===== Get Remote Address(  port ) =====
function Get_Reomote_AddressPort() {

    var port_start = location.href.indexOf(':') + 1;
    var isPort = location.href.indexOf(':', port_start);

    if (isPort != -1) {
        var port_end = location.href.indexOf('/', port_start + 3);
        var httpport = parseInt(location.href.substring(isPort + 1, port_end));

        return httpport;
    }
    else
        return 0;
}

// ===== Load Active-X =====
function Event_Load(Remote_Address, Rtsp_Port, Stream_Name) {
    var rtsp = document.getElementById('RTSPCtl');
    var Page = document.getElementById('Page').value;

    rtsp.Disconnect();

    Rtsp_Port = parseInt(Rtsp_Port);

    if (Remote_Address.match('yoics.net')) {
        var location_url = location.href;
        var Remote_length = Remote_Address.length;
        var Remote_start = location_url.indexOf(':') + 1;
        var str_start = location_url.indexOf(':', Remote_start) + 1;
        var str_end = location_url.indexOf('/', str_start);
        Rtsp_Port = parseInt(location_url.substring(str_start, str_end));
    }

    rtsp.Set_URL(Remote_Address); // ActiveX option ==> set video source Address
    rtsp.Set_Port(Rtsp_Port);     // ActiveX option ==> set ddns of network setting rstp port
    rtsp.Set_Path(Stream_Name);  	// ActiveX option ==> set id of link stream
    rtsp.Connect();                	// ActiveX option ==> link video source
    rtsp.Set_Audio(1);            // ActiveX option ==> set transfer vioce
    rtsp.Set_Mute(1);             // ActiveX option ==> set mute
    rtsp.Set_AutoConnect(1);       	// ActiveX option ==> set Auto Connect
    //	rtsp.Set_Debug(1);
    var HPort = Get_Reomote_AddressPort();
    if (HPort != 0)
        rtsp.Set_WPort(HPort);
    else
        rtsp.Set_WPort(80);

    if (Page == 'live_view') {
        var Mute = rtsp.Get_Mute();
        rtsp.Set_Mute(Mute);

        //		document.getElementById('Link_Page_text').disabled = false;
    }
}

// -----------------------------------------------------------------------------
function clear_value(form) {

    var str = '', ft, fv;

    for (var i = 0; i < form.elements.length; i++) {
        fv = form.elements[i];
        ft = fv.type;

        switch (ft) {
            case 'text':
                form.elements[i].value = '';
                break;

            case 'password':
                form.elements[i].value = '';
                break;

            case 'checkbox':
                form.elements[i].checked = false;
                break;

            case 'select-one':
                form.elements[i].value = 0;
                break;

            default:
                break;
        }
    }
}

// ================== Other function ============================================
function change_frame_scale(content_height) {

    var board_ID = new Array('primary_setup', 'secondary_setup', 'setup_primary_left_bottom', 'setup_primary_right_bottom', 'setup_secondary_left_bottom', 'setup_secondary_right_bottom', 'setup_primary_bottom_line', 'setup_secondary_bottom_line', 'setup_primary_left_line', 'setup_primary_right_line', 'setup_secondary_left_line', 'setup_secondary_right_line', 'Primary_Page', 'setup_content');

    for (var i = 0; i < board_ID.length; i++) {
        switch (i) {
            case 0:
                parent.document.getElementById(board_ID[i]).style.height = content_height - 30; // primary_setup
                break;

            case 1:
                parent.document.getElementById(board_ID[i]).style.height = content_height - 30; // secondary_setup
                break;

            case 2:
                parent.document.getElementById(board_ID[i]).style.top = content_height - 44;  // setup_primary_left_bottom
                break;

            case 3:
                parent.document.getElementById(board_ID[i]).style.top = content_height - 44; // setup_primary_right_bottom
                break;

            case 4:
                parent.document.getElementById(board_ID[i]).style.top = content_height - 44; // setup_secondary_left_bottom
                break;

            case 5:
                parent.document.getElementById(board_ID[i]).style.top = content_height - 44; // setup_secondary_right_bottom
                break;

            case 6:
                parent.document.getElementById(board_ID[i]).style.top = content_height - 32; // setup_primary_bottom_line
                break;

            case 7:
                parent.document.getElementById(board_ID[i]).style.top = content_height - 32; // setup_secondary_bottom_line
                break;

            case 8:
                parent.document.getElementById(board_ID[i]).style.height = content_height - 58; // setup_primary_left_line
                break;

            case 9:
                parent.document.getElementById(board_ID[i]).style.height = content_height - 58; // setup_primary_right_line
                break;

            case 10:
                parent.document.getElementById(board_ID[i]).style.height = content_height - 58; // setup_secondary_left_line
                break;

            case 11:
                parent.document.getElementById(board_ID[i]).style.height = content_height - 58; // setup_secondary_right_line
                break;

            case 12:
                parent.document.getElementById(board_ID[i]).style.height = content_height - 50; // Primary_Page
                break;

            case 13:
                parent.document.getElementById(board_ID[i]).style.height = content_height; // setup_content
                break;

            default:
                break;
        }
    }
}

// ************************
// ***** "File List" Page *****
// ************************
var gFlag = false;
// ===== Get Model from system_deviceinformation =====
function load_stream() {

    if (gFlag)
        return false;

    gFlag = true;

    var remote_addr = document.getElementById('remote_addr').value;
    var rtsp_port = document.getElementById('rtsp_port').value;
    var filename = document.getElementById('filename').value;

    Event_Load(remote_addr, rtsp_port, filename);
    wait_ActiveX();

    var Get_url = '/cgi-bin/operator/operator.cgi?action=get.system.model&timeStamp=' + new Date().getTime();

    createXHR();

    xmlHttp.onreadystatechange = catchResult_determine_model_set_audio;
    xmlHttp_process_GET(Get_url);
}

function catchResult_determine_model_set_audio() {

    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
            eval(xmlHttp.responseText);

            Model = Model.toUpperCase();

            if (system_deviceinformation_model.match('AM7000'))
                document.getElementById('set_audio').disabled = true;
            else
                document.getElementById('set_audio').disabled = false;
        }
    }
}

// -----------------------------------------------------------------------
function unload_stream() {

    gFlag = false;

    var rtsp = document.getElementById('RTSPCtl');

    rtsp.Disconnect();
    //	clearTimeout(window_Timer);
}

// -----------------------------------------------------------------------
var window_Delay = 10;

function wait_ActiveX() {
    /*
        if ( gFlag == false ){
            return false;
        }
    */
    var rtsp = document.getElementById('RTSPCtl');

    if (window_Delay > 0) {
        if (rtsp.Get_VideoHeight() != 0) {
            rtsp.width = rtsp.Get_VideoWidth();
            rtsp.height = rtsp.Get_VideoHeight();

            window.resizeTo(rtsp.Get_VideoWidth() + 100, rtsp.Get_VideoHeight() + 100);

            if (window_Delay != 10)
                clearTimeout(window_Timer);

            window_Delay = 10;
        }
        else {
            window_Delay--;
            window_Timer = setTimeout('wait_ActiveX()', 1000);
        }
    }
    else {
        window_Delay = 10;
        clearTimeout(window_Timer);
        alert('Time out !');
        window.close();
    }
}

// -----------------------------------------------------------------------------
function text_position_smooth_img(ID) {

    var Smooth_Img = document.getElementById(ID).src;

    if (ID.match('Now_Page_text'))
        Smooth_Img = Smooth_Img.replace('.gif', '-1.gif');
    else
        Smooth_Img = Smooth_Img.replace('-2.gif', '-1.gif');

    document.getElementById(ID).src = Smooth_Img;
}

// -----------------------------------------------------------------------------
function text_position_revice_img(ID) {

    var Revice_Img = document.getElementById(ID).src;
    var Revice_value = document.getElementById(ID).value;

    if (ID.match('Now_Page_text'))
        Revice_Img = Revice_Img.replace('-1.gif', '.gif');
    else
        Revice_Img = Revice_Img.replace('-1.gif', '-2.gif');

    document.getElementById(ID).src = Revice_Img;
}

// ===== Get_Browser_Info =====
function Get_Browser_Info() {
    //FOR IE10 and later....
    return navigator.userAgent.toUpperCase();
}

function GetCookie(cookiename) {

    var c = $.cookie(cookiename);
    return c;
}

function SetCookie(cookiename, cookievalue) {

    $.cookie(cookiename, cookievalue, { path: '/', expires: 30 });
}

/* example cookie 
	// ----- Set -----
	SetCookie( 'c1', t1, 30 );

	// ----- Get -----
	var g1 = GetCookie( 'c1' ); // if no cookie return null
	alert( g1 );
*/

// ===== Motion Link =====
function Motion_Link() {
    location.href = 'Motion_Detection.html';
}

// ===== File List( Quick Time ) =====
function Paint_QuickTime(QT_width, QT_hiehgt, FileName, Rtsp_Port, Http_Port) {

    var remote_address = give_remote_addr();

    var QT_str = '<object ID="RTSPCtl" width="' + QT_width + '" height="' + QT_hiehgt + '" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab">';
    if (Http_Port == 80) QT_str += '<param name="src" value="http://' + remote_address + '/viewer/underwater/quicktime/qt.mov">';
    else QT_str += '<param name="src" value="http://' + remote_address + ':' + Http_Port + '/viewer/underwater/quicktime/qt.mov">';
    QT_str += '<param name="qtsrc" value="rtsp://' + remote_address + ':' + Rtsp_Port + '/' + FileName + '">';
    QT_str += '<param name="controller" value="true">';
    QT_str += '<param name="scale" value="tofit">';
    QT_str += '<param name="autoplay" value="true">';
    QT_str += '<param name="volume" value="55">';
    QT_str += '<param name="showlogo" value="true">';
    QT_str += '<param name="moviename" value="Camera">';
    QT_str += '<param name="cache" value="false">';
    QT_str += '<param name ="qtsrcdontusebrowser" value="TRUE">';
    QT_str += '<embed';
    if (Http_Port == 80) QT_str += ' src="http://' + remote_address + '/viewer/underwater/quicktime/qt.mov"';
    else QT_str += ' src="http://' + remote_address + ':' + Http_Port + '/viewer/underwater/quicktime/qt.mov"';
    QT_str += ' width="' + QT_width + '" height="' + QT_hiehgt + '"';
    QT_str += ' controller="true"';
    QT_str += ' scale="tofit"';
    QT_str += ' autoplay="true"';
    QT_str += ' volume="55"';
    QT_str += ' showlogo="false"';
    QT_str += ' moviename="Camera"';
    QT_str += ' cache="false"';
    QT_str += ' qtsrc="rtsp://' + remote_address + ':' + Rtsp_Port + '/' + FileName + '"';
    QT_str += ' qtsrcdontusebrowser="TRUE"';
    QT_str += ' type="video/quicktime"';
    QT_str += ' pluginspage="http://www.apple.com/quicktime/download/">';
    QT_str += '</embed>';
    QT_str += '</object>';

    return QT_str
}

//=========================  String Validate: Regular Express ================================
function isEmpty(str) {
    return (str == null) || (str.length == 0);
}
// returns true if the string is a valid email
function isEmail(str) {
    if (isEmpty(str)) return false;
    var re = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i
    return re.test(str);
}
// returns true if the string only contains characters A-Z or a-z
function isAlpha(str) {
    var re = /[^a-zA-Z]/g
    if (re.test(str)) return false;
    return true;
}
// returns true if the string only contains characters 0-9
function isNumeric(str) {
    var re = /[\D]/g
    if (re.test(str)) return false;
    return true;
}
// returns true if the string only contains characters A-Z, a-z or 0-9
function isAlphaNumeric(str) {
    var re = /[^a-zA-Z0-9]/g
    if (re.test(str)) return false;
    return true;
}
// returns true if the string's length equals "len"
function isLength(str, len) {
    return str.length == len;
}
// returns true if the string's length is between "min" and "max"
function isLengthBetween(str, min, max) {
    return (str.length >= min) && (str.length <= max);
}
// returns true if the string is a US phone number formatted as...
// (000)000-0000, (000) 000-0000, 000-000-0000, 000.000.0000, 000 000 0000, 0000000000
function isPhoneNumber(str) {
    var re = /^\(?[2-9]\d{2}[\)\.-]?\s?\d{3}[\s\.-]?\d{4}$/
    return re.test(str);
}
// returns true if the string is a valid date formatted as...
// mm dd yyyy, mm/dd/yyyy, mm.dd.yyyy, mm-dd-yyyy
function isDate(str) {
    var re = /^(\d{1,2})[\s\.\/-](\d{1,2})[\s\.\/-](\d{4})$/
    if (!re.test(str)) return false;
    var result = str.match(re);
    var m = parseInt(result[1]);
    var d = parseInt(result[2]);
    var y = parseInt(result[3]);
    if (m < 1 || m > 12 || y < 1900 || y > 2100) return false;
    if (m == 2) {
        var days = ((y % 4) == 0) ? 29 : 28;
    } else if (m == 4 || m == 6 || m == 9 || m == 11) {
        var days = 30;
    } else {
        var days = 31;
    }
    return (d >= 1 && d <= days);
}

function isAcceptableSymbol(str) {
    var re = /[^a-zA-Z0-9] + [^a-zA-Z0-9\_\@\$\-\s]/g
    if (re.test(str)) return false;
    return true;
}
