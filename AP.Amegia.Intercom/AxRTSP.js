// ===== Full Screen =====
function Full_Screen() {

    var rtsp = document.getElementById('RTSPCtl');
    var is_full = rtsp.Get_Full();

    if (!is_full) rtsp.Set_Full(1);
    else rtsp.Set_Full(0);
}

// ===== Voice =====
function Set_Voice() {

    var rtsp = document.getElementById('RTSPCtl');
    var Mute = rtsp.Get_Mute();
    var Talk = rtsp.Get_Talk();

    if (Mute == 1) {	// Turn on the Voice
        if (Talk == 2) {
            rtsp.Set_Talk(0);

            $('#display_talk').val(1);
            $('#display_talk').attr('src', '../images/icon/talk.gif');

            clearTimeout(Talk_Timer);
        }

        rtsp.Set_Mute(0);

        $('#display_listen').val(0);
        $('#display_listen').attr('src', '../images/icon/listen-2.gif');
    }
    else {				// Turn off the Voice
        rtsp.Set_Mute(1);

        $('#display_listen').val(1);
        $('#display_listen').attr('src', '../images/icon/listen.gif');
    }
}

// ===== Talk =====
function Double_Talk() {

    //	var admin_pw = $('#admin_pw').val();
    var rtsp = document.getElementById('RTSPCtl');

    //	rtsp.Set_ID( 'admin' );
    //	rtsp.Set_PW( admin_pw );

    var Talk = rtsp.Get_Talk();
    var Mute = rtsp.Get_Mute();

    if (Talk == 0) {
        if (Mute == 0) {
            rtsp.Set_Mute(1);

            $('#display_listen').val(1);
            $('#display_listen').attr('src', '../images/icon/listen.gif');
        }

        if (rtsp.Set_Talk(2) != 0) {
            $('#display_talk').val(0);
            $('#display_talk').attr('src', '../images/icon/talk-2.gif');
            Talk_Timer = setTimeout('Disconnect_Talk(1)', 1000 * 60 * 10);
        }
    }
    else {
        rtsp.Set_Talk(0);

        $('#display_talk').val(1);
        $('#display_talk').attr('src', '../images/icon/talk.gif');

        clearTimeout(Talk_Timer);
    }
}

// ===== Talk Disconnect =====
function Disconnect_Talk(parameter) {

    var rtsp = document.getElementById('RTSPCtl');
    var Talk = rtsp.Get_Talk();

    if (Talk == 2) {
        rtsp.Set_Talk(0);

        $('#display_talk').val(1);
        $('#display_talk').attr('src', '/images/icon/talk.gif');

        clearTimeout(Talk_Timer);

        if (parameter == 1)
            alert(LV_msg3);
    }
}

// ===== Record =====
function Event_Record() {

    var rtsp = document.getElementById('RTSPCtl');

    if (isWin7())
        alert(LV_msg1);

    var Path = $('#record_path').val();
    var record_file_path = Path + '\\AM.avi';
    var Video_Source = $('#Video_Source').val();
    var Stream_Framerate = parseInt(media_profile_framerate[Video_Source]);

    var record_img_arry = $('#display_record').attr('src').split('/');
    var record_img = record_img_arry[record_img_arry.length - 1];

    if (rtsp.IsRecord() == 0) {
        rtsp.StartRecord(record_file_path, Stream_Framerate);

        if (rtsp.IsDiskFull() == 1) {
            alert(LV_msg2);
            rtsp.StopRecord();
        }
        else if (record_img == 'record-2.gif') {
            $('#display_record').attr('src', '/images/icon/record.gif');
        }
        else {
            Recycle_check_disk();
            $('#display_record').attr('src', '/images/icon/record-2.gif');
        }
    }
    else {
        rtsp.StopRecord();
        $('#display_record').attr('src', '/images/icon/record.gif');
        alert('[ ' + LV_FilePath + ' ] ' + Path + '\\');
    }
}

// ===== stop Record =====
function Stop_Record() {
    var rtsp = document.getElementById('RTSPCtl');

    if (rtsp.IsRecord() != 0) {
        rtsp.StopRecord();
        document.getElementById('display_record').src = '../images/icon/record.gif';
    }

    Disconnect_Talk(0);
}

// ===== Snapshot =====
function Event_Snapshot() {

    var rtsp = document.getElementById('RTSPCtl');

    if (isWin7())
        alert(LV_msg1);

    var Now = new Date();
    var year = Now.getYear();
    var month = Now.getMonth() + 1;
    var day = Now.getDate();
    var clock = Now.getHours();
    var minute = Now.getMinutes();
    var second = Now.getSeconds();

    var store_path = $('#record_path').val();
    //	var file_path_name = store_path +'\\'+ year +'-'+ month +'-'+ day +'-'+ clock +'-'+ minute +'-'+ second +'.jpg';
    var file_path_name = store_path + '\\AM.jpg';
    var path_msg = store_path + '\\';

    if (rtsp.Snapshot(file_path_name) == 1)
        alert('OK' + '\n[ ' + LV_FilePath + ' ]: ' + path_msg);
    else
        alert('Fail');
}

