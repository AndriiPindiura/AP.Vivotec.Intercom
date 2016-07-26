var flag = true;
var media_profile_id = new Array();
var media_profile_url = new Array();
var media_profile_dptz_enabled = new Array();
var media_profile_resolution_width = new Array();
var media_profile_resolution_height = new Array();
var media_profile_dptz_horzoffset = new Array();
var media_profile_dptz_vertoffset = new Array();
var media_profile_dptz_width = new Array();
var media_profile_dptz_height = new Array();
var media_profile_framerate = new Array();

function Init_LiveView_Array() {
    media_profile_id.length = 0;
    media_profile_url.length = 0;
    media_profile_dptz_enabled.length = 0;
    media_profile_resolution_width.length = 0;
    media_profile_resolution_height.length = 0;
    media_profile_dptz_horzoffset.length = 0;
    media_profile_dptz_vertoffset.length = 0;
    media_profile_dptz_width.length = 0;
    media_profile_dptz_height.length = 0;
    media_profile_framerate.length = 0;
}

//==============  Slider Define =====================
var mdObj = '#resizable';

function SetSize(id, width, height) {
    $(mdObj + id).width(width);
    $(mdObj + id).height(height);
}

function SetPosition(id, top, left) {
    $(mdObj + id).css('top', top + 'px');
    $(mdObj + id).css('left', left + 'px');
}

function SetVisible(id, value) {
    if (value) $(mdObj + id).show();
    else $(mdObj + id).hide();
}
//==============  End Slider Define =====================

// ===== Ready function =====
$(document).ready(function () {
    //$('#PTZ_Control_Action').html("PTZ Action");

    $('#Lang').val(GetCookie('Language'));
    $('#Setup').html(lvSetup);
    $('#Liveview').html(lvLiveview);
    $('#display_full_screen').attr('title', lvFullScreen);
    $('#display_real_size').attr('title', lvRealSize);
    $('#display_listen').attr('title', lvListen);
    $('#display_talk').attr('title', lvTalk);
    $('#display_snapshot').attr('title', lvSnapshot);
    $('#display_record').attr('title', lvRecord);
    $('#zoom_tele').attr('title', lvZoomIn);
    $('#zoom_wide').attr('title', lvZoomOut);
    $('#zoom_stop').attr('title', lvStop);
    $('#range_img').attr('title', LV_DPTZRange);
    $('#save_preset_point').attr('title', Save);
    $('#remove_preset_point').attr('title', Remove);
    $('#menu_preset_point').attr('title', Menu);
    $('#control_secondary_arrow_open').attr('title', LV_Open);
    $('#video_source_img').attr('title', LV_VideoSource);
    $('#rotation_img').attr('title', LV_Rotation);
    $('#ptz_arrow_middle_middle, #ptz_optics_stop').attr('title', LV_Stop);
    $('#Optics_Zoom').attr('title', LV_Zoom);
    $('#Optics_Iris').attr('title', LV_Iris);
    $('#Optics_Focus').attr('title', LV_Focus);
    $('#Optics_Zone').attr('title', LV_ZoneScan);
    $('#ptz_optics_decrease').attr('title', LV_Out);
    $('#ptz_optics_increase').attr('title', LV_In);
    $('#ptz_optics_zone_stop').attr('title', LV_Off);
    $('#ptz_optics_zone_play').attr('title', LV_On);
    $('#ptz_speed').attr('title', LV_PTZSpeed);
    $('#control_secondary_arrow_close').attr('title', LV_Close);

    $('#Lang').val(GetCookie('Language'));
    $('#Setup').html(lvSetup);
    $('#Liveview').html(lvLiveview);

    $('#display_full_screen').attr('title', lvFullScreen);
    $('#display_real_size').attr('title', lvRealSize);
    $('#display_listen').attr('title', lvListen);
    $('#display_talk').attr('title', lvTalk);
    $('#display_snapshot').attr('title', lvSnapshot);
    $('#display_record').attr('title', lvRecord);

    $('#range_img').attr('title', LV_DPTZRange);
    $('#save_preset_point').attr('title', Save);
    $('#remove_preset_point').attr('title', Remove);
    $('#control_secondary_arrow_open').attr('title', LV_Open);
    $('#video_source_img').attr('title', LV_VideoSource);
    $('#rotation_img').attr('title', LV_Rotation);
    $('#ptz_arrow_middle_middle').attr('title', LV_Stop);
    $('#Optics_Zoom').attr('title', LV_Zoom);
    $('#Optics_Iris').attr('title', LV_Iris);
    $('#Optics_Focus').attr('title', LV_Focus);
    $('#Optics_Zone').attr('title', LV_ZoneScan);
    $('#ptz_optics_decrease').attr('title', LV_Out);
    $('#ptz_optics_stop').attr('title', LV_Stop);
    $('#ptz_optics_increase').attr('title', LV_In);
    $('#ptz_optics_zone_stop').attr('title', LV_Off);
    $('#ptz_optics_zone_play').attr('title', LV_On);
    $('#ptz_speed').attr('title', LV_PTZSpeed);
    $('#control_secondary_arrow_close').attr('title', LV_Close);



    if (DetectionActiveXSupport()) {
        $('#select_area_for_activex').show();
        $('#display_area').show();
        catch_liveview();

    } else {
        $.blockUI({ message: MsgLoading });
        setTimeout('catch_liveview()', 500);
    }


    // ===== Event =====
    $('#Lang').change(function () {
        StopPlugin();
        var Lang = $('#Lang').val();
        SetCookie('Language', Lang);
        location.reload();
    });

    $('#Liveview').click(function () {
        StopPlugin();
        location.reload();
    });


    // ===== Init slider =====

    $('#Zoom_slider').slider({
        animate: true,
        value: 1,
        min: 1,
        max: 20,

        stop: function (e, ui) {
            var bv = ui.value;
            $('#Zoomvalue_val').val(bv);

            zoomcam_control("zoom_slider");
        }
    });

    $('#Zoomout').click(function () {
        var bv = $('#Zoomvalue_val').val() - 1;
        bv = One_Hundred(bv, 'Zoomvalue_val');

        $('#Zoom_slider').slider('option', 'value', bv);
        zoomcam_control("zoom_slider");
    });

    $('#Zoomin').click(function () {
        var bv = parseInt($('#Zoomvalue_val').val()) + 1;
        bv = One_Hundred(bv, 'Zoomvalue_val');

        $('#Zoom_slider').slider('option', 'value', bv);
        zoomcam_control("zoom_slider");
    });

    $('#Zoomvalue_val').change(function () {
        var bv = $('#Zoomvalue_val').val();
        bv = One_Hundred(bv, 'Zoomvalue_val');

        $('#Zoom_slider').slider('option', 'value', bv);
    });



    $('#Zoom_slider').slider('option', 'value', $('#Zoomvalue_val').val());
    // ======= End Slider =======================

    $('#Setup').click(function () {
        if (DetectionActiveXSupport()) {
            var rtsp = document.getElementById('RTSPCtl');
            if (rtsp.IsRecord() != 0) {
                if (!confirm(LV_msg10))
                    return;
            }
            rtsp.StopRecord();
            document.getElementById('display_record').src = '../images/icon/record.gif';
        }
        StopPlugin();
        Save_Cookie();
        if (DetectionActiveXSupport()) {
            var rtsp = document.getElementById('RTSPCtl');
            rtsp.Disconnect();
        }

        setTimeout("gotosetup()", 2500);

    });
});



var focus_af = 0;

function zoomcam_change_speed() {
    var zoomcam_speed = $('#zoom_speed').val();
    $.cookie('zoomcam_speed', zoomcam_speed, { path: '/', expires: 30 });
}

function zoomcam_control(ID) {
    var param = "";
    var zoom_speed = $('#zoom_speed').val();

    switch (ID) {
        case 'zoom_wide':
            param = "imaging_setting_zoomcam_wide";
            break;

        case 'zoom_tele':
            param = "imaging_setting_zoomcam_tele";
            break;

        case 'zoom_stop':
            param = "imaging_setting_zoomcam_zoomstop";
            break;

        case 'focus_far':
            param = "imaging_setting_zoomcam_far";
            break;

        case 'focus_near':
            param = "imaging_setting_zoomcam_near";
            break;

        case 'focus_af':
            param = "imaging_setting_zoomcam_af";

            if (focus_af == "1") {
                focus_af = "0";
                zoom_speed = 0;
                $('#focus_af').attr("src", "../images/PTZ/button/stop/play_08.jpg");
            } else {
                focus_af = "1";
                zoom_speed = 1;
                $('#focus_af').attr("src", "../images/PTZ/button/stop/play_08-3.jpg");
            }

            break;

        case 'focus_push':
            param = "imaging_setting_zoomcam_push";
            break;

        case 'focus_infinity':
            param = "imaging_setting_zoomcam_infinity";
            break;

        case 'zoom_slider':
            param = "imaging_setting_zoomcam_zoomvalue";
            ZoomValue = $('#Zoomvalue_val').val();
            zoom_speed = getPositionValue(ZoomValue);
            break;

    }

    var Get_url = '../cgi-bin/viewer/viewer.cgi?action=set.zoomcam.setting&' + param + '=' + zoom_speed + '&timeStamp=' + new Date().getTime();

    $.ajax({
        type: 'GET',
        url: Get_url,
        dataType: 'text',
        cache: false,
        async: true,
        error: function () {
            alert(MsgResponseError);
        },
        success: function () {
        }
    });

}





function gotosetup() {
    location.href = '../operator/setup.html';
}


function StopPlugin() {
    if (DetectionActiveXSupport()) {
        Stop_Record();
    }
    else {
        Stop_QT();
    }
}



function catch_liveview() {

    var Get_url = '../cgi-bin/viewer/viewer.cgi?action=get.liveview&timeStamp=' + new Date().getTime();

    $.ajax({
        type: 'GET',
        url: Get_url,
        dataType: 'text',
        cache: false,
        async: false,
        beforeSend: function () {
            Init_LiveView_Array();
        },
        error: function () {
            alert(MsgResponseError);
        },
        success: function (response) {
            eval(response);

            // Set Talk need admin password, Connect stream need rtsp port, Decide show PTZ or DPTZ need Sensor, stream size need TVStandards
            //	$('#admin_pw').val( admin_pw );
            $('#rtsp_port').val(rtsp_port);
            $('#Sensor').val(system_deviceinformation_sensor);
            $('#TVStandards').val(system_deviceinformation_tvstandards);
            $('#Model').val(system_deviceinformation_model);

            // ===== init Optics_Zoom ======
            $('#Optics_Zoom').attr('src', '../images/PTZ/function_button/zoom-2.jpg');

            // ===== Vender =====
            if (system_deviceinformation_vender != 'nobrand' && islogo == 1 && eeprom_showlogo == 1) {
                $('#logo').show();
                $('#logo_img').attr('src', '../images/logo/' + system_deviceinformation_vender + '.gif');
            }

            // Language Item 


            var strLang = '<select id="Lang">';
            strLang += '<option value="EN">EN</option>';
            strLang += '<option value="TW">繁中</option>';
            strLang += '<option value="CH">简中</option>';

            //if ( system_deviceinformation_vender == 'nobrand')			// The Russian have some problem, close it temporary
            //	strLang += '<option value="RU">русский</option>';
            strLang += '</select>';

            $('#Lang_area').html(strLang);

            LANG = GetCookie('Language');
            if (GetCookie('Language') == null) {
                LANG = 'EN';
            }
            $('#Lang').val(LANG);

            /*
			alert (system_deviceinformation_vender);
			
			if ( system_deviceinformation_vender == 'nobrand')
				$('#LANG_RU').show();	
			else
				$('#LANG_RU').hide();
			*/
            // ===== SerialPort(hardware) , PTZ_Enable(PTZ setting) =====

            if (model_hardware_serialport == 1 && ptz_setting_enable == 1) {
                $('#PTZ_en').val(1);
                $('#PTZ').attr('checked', 'true');
            }
            else
                $('#DPTZ').attr('checked', 'true');

            if ((system_deviceinformation_model == 'AM9243-YK') || (system_deviceinformation_model == 'AM9243-YO')) {
                $('#menu_Preset_Point_tr').show();
                $('#remove_Preset_Point_tr').hide();

                var strIMG = '<img id="ptz_optics_stop"  src="../images/PTZ/button/stop/play_08.jpg" />';
                $('#IMG_PTZ_STOP').html(strIMG);

            } else {
                var strIMG = '<input type="image" id="ptz_optics_stop" 		 src="../images/PTZ/button/stop/play_08.jpg"     onmouseover="smooth_Img(id)" onmouseout="revice_Img(id)" onclick="PTZ_move_Control(0)" />';
                $('#IMG_PTZ_STOP').html(strIMG);
                $('#ptz_optics_stop').attr('title', LV_Stop);


            }


            // ===== PTZ_Protocol ===== 0:PELCO D	1:PELCO P	2:LI-LIN	3:DYNACOLOR  4: PELCO D for YOKO Only
            switch (ptz_setting_protocol) {
                case '0':
                case '1':
                case '3':
                case '4':
                    $('#Optics_Zone').attr('title', lvZoneScan);
                    break;
                case '2':
                    $('#Optics_Zone').attr('title', lvAutoPan);
                    break;

                default:
                    $('#Optics_Zone').attr('title', Unknown);
                    break;
            }

            switch (ptz_setting_protocol) {
                case '0':
                    Preset_Point_Start = 1;
                    Preset_Point_End = 32;
                    break;
                case '1':
                    Preset_Point_Start = 1;
                    Preset_Point_End = 255;
                    break;
                case '2':
                    Preset_Point_Start = 1;
                    Preset_Point_End = 128;
                    break;
                case '3':
                    Preset_Point_Start = 0;
                    Preset_Point_End = 127;
                    break;
                case '4':
                    Preset_Point_Start = 1;
                    Preset_Point_End = 32;
                    break;
            }


            //var ptz_preset_point_str = "";
            var point_str = "<select id='preset_point' onchange='goto_point(66)'>";
            for (var i = Preset_Point_Start; i <= Preset_Point_End; i++)
                point_str += "<option value=" + i + ">" + i + "</option>";

            if (ptz_setting_protocol == 0) { // Protocol = PALCO D, Forced open preset point 33, 34, 93 ~~ 99
                point_str += "<option value=33>33</option>";
                point_str += "<option value=34>34</option>";

                if ((system_deviceinformation_model == 'AM9243-YK') || (system_deviceinformation_model == 'AM9243-YO')) {
                }
                else {
                    for (i = 93; i <= 99; i++)
                        point_str += "<option value=" + i + ">" + i + "</option>";
                }
            }

            point_str += "</select>";
            $('#PTZ_Preset_Point').html(point_str);

            // ===== show "PTZ" or "DPTZ_Control" =====
            show_PTZ_or_DPTZ_Control();

            // ===== show "Video_Source" select bar =====
            if (DetectionActiveXSupport())
                var select_video_source_str = '<select id="Video_Source" onchange="change_Stat(0)">';
            else
                var select_video_source_str = '<select id="Video_Source" onchange="ChangeStream()">';


            {

            }

            for (var i = 0; i < media_profile_id.length; i++) {
                var video_source = media_profile_url[i];
                if (media_profile_dptz_enabled[i] == 1)
                    video_source += ' DPTZ';
                select_video_source_str += '<option value=' + media_profile_id[i] + '>' + video_source + '</option>';
                if ((system_deviceinformation_sensor == "fcbeh4300") && (imaging_settings_videoout == '1'))
                    break;
            }

            select_video_source_str += '</select>';
            $('#video_source_select').html(select_video_source_str);

            // ===== PTZ Speed value =====
            $('#ptz_speed_select').val(parseInt(ptz_setting_speed));

            // ===== for ActiveX =====
            var remote_address = give_remote_addr();

            // ----- Model "AM7000" (no listen & talk) -----
            if (system_deviceinformation_model.match('AM7000')) {
                $('#display_listen, #display_talk').attr('disabled', 'true');
                $('#display_listen, #display_talk').attr('title', '');
                $('#display_listen, #display_talk').css('cursor', 'default');
                $('#display_listen').attr('src', '../images/icon/listen_disable.gif');
                $('#display_talk').attr('src', '../images/icon/talk_disable.gif');
            }


            if (GetCookie('VideoSource') == null) {
                if (location.href.match('yoics.net'))
                    var Index = media_profile_url.length - 2;	// last two Stream(H.264)
                else
                    var Index = 0;

                var Video_Source = Index;
                var Rotation = 0;	// normal
                var Real_Size = 1;	// not real size
                var Record_Path = 'C:\\';

                SetCookie('VideoSource', Video_Source);
                SetCookie('Rotation', Rotation);
                SetCookie('Real_Size', Real_Size);
                SetCookie('record_path', Record_Path);
            }
            else {
                var Video_Source = parseInt(GetCookie('VideoSource'));
                var Rotation = parseInt(GetCookie('Rotation'));
                var Real_Size = parseInt(GetCookie('Real_Size'));
                var Record_Path = GetCookie('record_path');

                $('#image_rotation').val(Rotation);
                $('#display_real_size').val(Real_Size);
            }

            var S_ID = media_profile_url[Video_Source]; // URL Name
            var X_width = parseInt(media_profile_resolution_width[Video_Source]);	// Video Source width
            var X_height = parseInt(media_profile_resolution_height[Video_Source]);	// Video Source height

            $('#Video_Source').val(Video_Source);
            $('#URL_ID').val(S_ID);

            if (Real_Size == 0) {	// Real Size
                $('#display_real_size').attr('src', '../images/icon/Real_Size-2.gif');

                var A_width = X_width;
                var A_height = X_height;
            }
            else {	// not Real Size
                switch (X_width) {
                    case 1600:
                    case 640:
                    case 320:
                        var A_width = 640;
                        var A_height = 480;
                        break;

                    case 1920:
                    case 1280:
                        var A_width = 640;
                        var A_height = 360;
                        break;

                    case 160:
                        var A_width = 640;
                        var A_height = 512;
                        break;

                    case 720:
                        var A_width = X_width;
                        var A_height = X_height;
                        break;

                    case 352:
                        var A_width = 704;
                        var A_height = (X_height == 240) ? 480 : 576;
                        break;

                    case 176:
                        var A_width = 704;
                        var A_height = (X_height == 128) ? 512 : 576;
                        break;
                }
            }

            if (Rotation == 1 || Rotation == 3) {
                var tmpWH = A_width;
                A_width = A_height;
                A_height = tmpWH;
            }

            if (DetectionActiveXSupport())
                Compliance_WH(A_width, A_height);
            else
                Compliance_WH_QT(A_width, A_height);

            // ===== show Video Source scale(note) =====
            show_video_source_scale(Video_Source);


            // ===== show Path =====
            $('#record_path').val(Record_Path);
            $('#display_path').attr('title', Record_Path);

            // ===== show FPS, BPS =====
            if (DetectionActiveXSupport())
                interval_stream();

            // ===== show PTZ, DPTZ control =====
            chose_show_DPTZ_control();

            $('#Video_Source').focus();

            $('#resolution_width').val(media_profile_resolution_width[Video_Source]);
            $('#resolution_height').val(media_profile_resolution_height[Video_Source]);


            if (DetectionActiveXSupport()) {
                // ===== Rotation =====
                var rtsp = document.getElementById('RTSPCtl');
                rtsp.Set_ImageMode(Rotation);
                Event_Load(remote_address, rtsp_port, S_ID);
            } else {
                var QT_str = Give_Stream(A_width, A_height, S_ID, rtsp_port);
                $('#QTStream').html(QT_str);
                $('#QTStream').css('left', (($('#primary_live').width() - A_width) / 2) + 'px');
                $('#QTStream').css('top', (($('#primary_live').height() - A_height) / 2) + 'px');
                $.unblockUI();
            }


            flag = true;


            if (sderror == 1)
                if (confirm(LV_msg9))
                    if (confirm(SD_msg5)) {
                        $.blockUI({ message: SD_msg4 });
                        Send_SDFormat();
                    }

            if (system_deviceinformation_sensor == "fcbeh4300") {

                var zoom_speed = $.cookie('zoomcam_speed');

                $('#zoom_speed').val(zoom_speed);
                $('#zoomcam').show();

                ZoomMultipleValue = getMultipleValue(parseInt(imaging_setting_zoomcam_zoomvalue));
                $('#Zoomvalue_val').val(ZoomMultipleValue);

                //zoomcam_control("zoom_slider");
                //	$('#DPTZ_Area').show();
                //	$('#PTZ_Remote_Area').hide();						

            }
        }
    });
}

function Send_SDFormat() {

    var Get_url = '../cgi-bin/operator/operator.cgi?action=set.storage.format&timeStamp=' + new Date().getTime();

    $.ajax({
        type: 'GET',
        url: Get_url,
        dataType: 'text',
        cache: false,
        async: false,
        error: function () {
            alert(MsgResponseError);
        },
        success: function () {
            setTimeout('location.reload()', 10 * 1000);
        }
    });
}

// ===== Show "PTZ" or "DPTZ" Remote Control =====
function show_PTZ_or_DPTZ_Control() {

    if ($('#PTZ').attr('checked')) {	// PTZ
        $('#PTZ_Remote_Area').show();
        $('#DPTZ_Remote_Area').hide();
    }
    else {								// DPTZ
        $('#PTZ_Remote_Area').hide();
        $('#DPTZ_Remote_Area').show();
    }

}

// ===== show video source scale =====
function show_video_source_scale(video_source) {
    var FHD = new Array('FHD', 'VGA');
    var HD = new Array('HD', 'VGA', 'QVGA', 'QQVGA');
    var VGA = new Array('VGA', 'QVGA', 'QQVGA');
    var COMPOSITE = new Array('D1', 'CIF', 'QCIF');

    var stream_type = new Array('H.264', 'MJPG');

    var i = parseInt(video_source / 2);
    var j = parseInt(video_source % 2);

    var Sensor = $('#Sensor').val();

    switch (Sensor) {
        case 'fcbeh4300':
            video_source_str = FHD[video_source];
            break;

        case '2m':
            video_source_str = HD[i];
            break;

        case 'composite':
            video_source_str = COMPOSITE[i];
            break;

        default:
            video_source_str = VGA[i];
            break;
    }

    $('#video_source_scale').html(video_source_str + ' (' + stream_type[j] + '&nbsp;' + media_profile_resolution_width[video_source] + ' x ' + media_profile_resolution_height[video_source] + ')');
}

// ===== show FPS, BPS every second =====
function interval_stream() {

    var rtsp = document.getElementById('RTSPCtl');
    var fps_status = rtsp.Get_FPS();
    var bps_status = rtsp.Get_KBPS();

    if (fps_status >= 1)
        fps_status++;

    $('#fps').html('FPS: <font color="blue">' + fps_status + ' fps</font>');
    $('#bps').html('BPS: <font color="blue">' + bps_status + ' Kbps</font>');

    setTimeout('interval_stream()', 1000);
}

// ===== Determine show PTZ/DPTZ control =====
function chose_show_DPTZ_control() {

    var video_source = $('#Video_Source').val();
    var PTZ_en = $('#PTZ_en').val();
    var Sensor = $('#Sensor').val();


    if ((media_profile_dptz_enabled[video_source] == 1) || (PTZ_en == 1)) {
        $('#DPTZ_Area').show();

        if (PTZ_en == 0) {		// DPTZ = 1
            document.getElementById('DPTZ_Area').firstChild.id = 'DPTZ_title';	// show DPTZ remote monitor
            $('#show_PTZ_table, #PTZ_Remote_Area').hide();
            $('#DPTZ_Remote_Area').show();

            if (Sensor == "fcbeh4300") {
                $('#zoomcam').css("top", "525");
            }
        }
        else if (media_profile_dptz_enabled[video_source] == 0) { 	// PTZ = 1
            document.getElementById('DPTZ_Area').firstChild.id = 'PTZ_title';	// show PTZ remote monitor
            $('#show_PTZ_table').hide();

            if ((video_source <= 1) || (video_source >= (media_profile_id.length - 2))) {
                $('#PTZ_Remote_Area').show();
                $('#DPTZ_Remote_Area').hide();
            }
        }
        else {	// PTZ = 1 & DPTZ = 1
            document.getElementById('DPTZ_Area').firstChild.id = 'DB_PTZ_title';	// show One of DPTZ and PTZ remote monitor
            $('#show_PTZ_table').show();			// show select DPTZ or PTZ

            if (video_source >= 2)
                show_PTZ_or_DPTZ_Control();
        }
    }
    else {
        $('#DPTZ_Area').hide();
        if (Sensor == "fcbeh4300") {
            $('#zoomcam').css("top", "280");

        }
    }


}

// =====  "Video_Source" select bar be changed  =====
function change_Stat(params) {  // params = 0 ==> "Video_Source" select bar ; params = 1 ==> "real size" button 

    // ===== Video Source =====
    var video_source = parseInt($('#Video_Source').val());		// URL ID
    var S_ID = media_profile_url[video_source];
    var real_size = parseInt($('#display_real_size').val());	// 1: not real_size ; 0: real_size

    var X_width = parseInt(media_profile_resolution_width[video_source]);
    var X_height = parseInt(media_profile_resolution_height[video_source]);

    $('#resolution_width').val(X_width);
    $('#resolution_height').val(X_height);

    var remote_address = $('#remote_addr').val();
    var rtsp_port = $('#rtsp_port').val();

    var rtsp = document.getElementById('RTSPCtl');

    if (rtsp.Get_Mute() == 0) {
        rtsp.Set_Mute(1);
        $('#display_listen').val(1);
        $('#display_listen').attr('src', '../images/icon/listen.gif');
    }

    if (params == 0) {
        Disconnect_Talk(0);
        show_video_source_scale(video_source);
        chose_show_DPTZ_control();	// determine show DPTZ
        $('#URL_ID').val(S_ID);	// Stream Name
    }
    else {
        if (real_size == 1) {	// not real size become real size
            real_size = 0;
            $('#display_real_size').val(0);
            $('#display_real_size').attr('src', '../images/icon/Real_Size-2.gif');
        }
        else {	// real size become not real size
            real_size = 1;
            $('#display_real_size').val(1);
            $('#display_real_size').attr('src', '../images/icon/Real_Size.gif');
        }
    }

    if (real_size == 0) {	// Real Size
        var A_width = X_width;
        var A_height = X_height;
    }
    else {	// not Real Size
        switch (X_width) {
            case 1600:
            case 640:
            case 320:
                var A_width = 640;
                var A_height = 480;
                break;

            case 1920:
            case 1280:
                var A_width = 640;
                var A_height = 360;
                break;

            case 160:
                var A_width = 640;
                var A_height = 512;
                break;

            case 720:
                var A_width = X_width;
                var A_height = X_height;
                break;

            case 352:
                var A_width = 704;
                var A_height = (X_height == 240) ? 480 : 576;
                break;

            case 176:
                var A_width = 704;
                var A_height = (X_height == 128) ? 512 : 576;
                break;
        }
    }

    var Rotation = $('#image_rotation').val();

    if (Rotation == 1 || Rotation == 3) {
        var tmpWH = A_width;
        A_width = A_height;
        A_height = tmpWH;
    }

    if (DetectionActiveXSupport())
        Compliance_WH(A_width, A_height);
    else
        Compliance_WH_QT(A_width, A_height);


    SetCookie('VideoSource', video_source);
    Event_Load(remote_address, rtsp_port, S_ID);	// when change Video_Source reload Stream

    Change_Record_FrameRate(video_source);
}

// ===== When "real size " button be click =====
function change_Real_Size() {	// params = 0 ==> "Video_Source" select bar ; params = 1 ==> "real size" button 

    // ===== Video Source =====
    var video_source = parseInt($('#Video_Source').val());		// URL ID
    var real_size = parseInt($('#display_real_size').val());	// 1: not real_size ; 0: real_size

    var X_width = parseInt(media_profile_resolution_width[video_source]);
    var X_height = parseInt(media_profile_resolution_height[video_source]);

    $('#resolution_width').val(X_width);
    $('#resolution_height').val(X_height);

    var rtsp = document.getElementById('RTSPCtl');

    if (rtsp.Get_Mute() == 0) {
        rtsp.Set_Mute(1);
        $('#display_listen').val(1);
        $('#display_listen').attr('src', '../images/icon/listen.gif');
    }

    if (real_size == 1) {	// not real size become real size
        real_size = 0;
        $('#display_real_size').val(0);
        $('#display_real_size').attr('src', '../images/icon/Real_Size-2.gif');
    }
    else {	// real size become not real size
        real_size = 1;
        $('#display_real_size').val(1);
        $('#display_real_size').attr('src', '../images/icon/Real_Size.gif');
    }

    // ===============================================================================================
    if (real_size == 0) {	// Real Size
        var A_width = X_width;
        var A_height = X_height;
    }
    else {	// not Real Size
        switch (X_width) {
            case 1600:
            case 640:
            case 320:
                var A_width = 640;
                var A_height = 480;
                break;

            case 1920:
            case 1280:
                var A_width = 640;
                var A_height = 360;
                break;

            case 160:
                var A_width = 640;
                var A_height = 512;
                break;

            case 720:
                var A_width = X_width;
                var A_height = X_height;
                break;

            case 352:
                var A_width = 704;
                var A_height = (X_height == 240) ? 480 : 576;
                break;

            case 176:
                var A_width = 704;
                var A_height = (X_height == 128) ? 512 : 576;
                break;
        }
    }

    var Rotation = $('#image_rotation').val();

    if (Rotation == 1 || Rotation == 3) {
        var tmpWH = A_width;
        A_width = A_height;
        A_height = tmpWH;
    }

    Compliance_WH(A_width, A_height);
    SetCookie('Real_Size', real_size);
}

// =====  When Leave live view Page  =====
function send_cookie() {   // unload 

    Save_Cookie();
    window.location = '../operator/setup.html';
}

// ===== change Page graphic ( when onmouseover ) =====
function smooth_Img(ID) {	// when mouse over

    var Smooth_Img = $('#' + ID).attr('src');

    if (Smooth_Img.match('gif')) {
        if (Smooth_Img.match('-2.gif'))
            Smooth_Img = Smooth_Img.replace('-2.gif', '-1.gif');
        else
            Smooth_Img = Smooth_Img.replace('.gif', '-1.gif');
    }
    else {
        if (Smooth_Img.match('-2.jpg'))
            Smooth_Img = Smooth_Img.replace('-2.jpg', '-1.jpg');
        else
            Smooth_Img = Smooth_Img.replace('.jpg', '-1.jpg');
    }

    $('#' + ID).attr('src', Smooth_Img);
}

// ===== change Page graphic ( when mouseout ) =====
function revice_Img(ID) {	// when mouse out

    var Revice_Img = $('#' + ID).attr('src');
    var Revice_value = $('#' + ID).val();

    if (Revice_Img.match('gif')) {
        if (Revice_value == 0)
            Revice_Img = Revice_Img.replace('-1.gif', '-2.gif');
        else
            Revice_Img = Revice_Img.replace('-1.gif', '.gif');
    }
    else
        Revice_Img = Revice_Img.replace('-1.jpg', '.jpg');

    $('#' + ID).attr('src', Revice_Img);
}

// ===== change text image ( when onmouseover ) =====
function text_position_smooth_img(ID) {

    var Smooth_Img = $('#' + ID).attr('src');

    if (ID.match('Now_Page_text'))
        Smooth_Img = Smooth_Img.replace('-2.gif', '-1.gif');
    else
        Smooth_Img = Smooth_Img.replace('.gif', '-1.gif');

    $('#' + ID).attr('src', Smooth_Img);
}

// ===== change text image ( when mouseout ) =====
function text_position_revice_img(ID) {

    var Revice_Img = $('#' + ID).attr('src');
    var Revice_value = $('#' + ID).val();

    if (ID.match('Now_Page_text'))
        Revice_Img = Revice_Img.replace('-1.gif', '-2.gif');
    else
        Revice_Img = Revice_Img.replace('-1.gif', '.gif');

    $('#' + ID).attr('src', Revice_Img);
}

// ===== when secondary switch be press =====
function secondary_switch(ID) {

    var resolution_width = parseInt($('#resolution_width').val());
    var resolution_height = parseInt($('#resolution_height').val());

    if ($('#display_real_size').val() == 1) {	// no real size
        switch (resolution_width) {
            case 720:
                var reduce_border = 80;
                break;

            case 352:
                var reduce_border = 64;
                break;

            case 176:
                var reduce_border = 64;
                break;

            default:
                var reduce_border = 0;
                break;
        }

        if (ID == 'control_secondary_arrow_close') {
            $('#secondary_live').css('left', '-280px');
            $('#secondary_live_close').css('left', 0);
            $('#primary_live').css('left', '62px');

            $('#header').width(925 + reduce_border - 218);
            $('#header_top_line, #header_bottom_line').width(897 + reduce_border - 218);
            $('#header_right_top, #header_right_bottom').css('left', (911 + reduce_border - 218) + 'px');
            $('#header_right_line').css('left', (923 + reduce_border - 218) + 'px');
            $('#Liveview_Setup').css('left', (690 + reduce_border - 218) + 'px');
        }
        else {
            $('#secondary_live').css('left', 0);
            $('#secondary_live_close').css('left', '-62px');
            $('#primary_live').css('left', '280px');

            $('#header').width(925 + reduce_border);
            $('#header_top_line, #header_bottom_line').width(897 + reduce_border);
            $('#header_right_top, #header_right_bottom').css('left', (911 + reduce_border) + 'px');
            $('#header_right_line').css('left', (923 + reduce_border) + 'px');
            $('#Liveview_Setup').css('left', (690 + reduce_border) + 'px');
        }
    }
    else {	// real size
        if (resolution_width >= 640)
            var hidden_width = resolution_width;
        else {
            switch (resolution_width) {
                case 352:
                    var hidden_width = 704;
                    break;

                case 176:
                    var hidden_width = 640;
                    break;

                default:
                    var hidden_width = 640;
                    break;
            }
        }

        if (ID == 'control_secondary_arrow_close') {
            $('#secondary_live').css('left', '-280px');
            $('#secondary_live_close').css('left', 0);
            $('#primary_live').css('left', '62px');

            $('#header').width(hidden_width + 67);

            $('#header_top_line, #header_bottom_line').width(hidden_width + 39);

            $('#header_right_top, #header_right_bottom').css('left', (hidden_width + 53) + 'px');

            $('#header_right_line').css('left', (hidden_width + 65) + 'px');
            $('#Liveview_Setup').css('left', (hidden_width - 168) + 'px');
        }
        else {
            $('#secondary_live').css('left', 0);
            $('#secondary_live_close').css('left', '-62px');
            $('#primary_live').css('left', '280px');

            $('#header').width(hidden_width + 285);

            $('#header_top_line, #header_bottom_line').width(hidden_width + 257);

            $('#header_right_top, #header_right_bottom').css('left', (hidden_width + 271) + 'px');

            $('#header_right_line').css('left', (hidden_width + 283) + 'px');
            $('#Liveview_Setup').css('left', (hidden_width + 50) + 'px');
        }
    }
}

// ===== ActiveX contron =====
function isWin7() {

    var OS = navigator.userAgent;

    if (OS.match('Windows NT 6.1') || OS.match('Windows NT 7.0'))
        return true;
    else
        return false;
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

// ===== Rotation =====
function Event_ImageMode() {    // 0: Normal; 1: 90; 2: 180; 3: 270;

    var rtsp = document.getElementById('RTSPCtl');
    var chg_img = $('#image_rotation').val();

    rtsp.Set_ImageMode(chg_img);

    var Video_Source = $('#Video_Source').val();
    var real_size = $('#display_real_size').val();
    var X_width = parseInt(media_profile_resolution_width[Video_Source]);
    var X_height = parseInt(media_profile_resolution_height[Video_Source]);

    // ===============================================================================================
    if (real_size == 0) {	// Real Size
        var A_width = X_width;
        var A_height = X_height;
    }
    else {	// not Real Size
        switch (X_width) {
            case 1600:
            case 640:
            case 320:
                var A_width = 640;
                var A_height = 480;
                break;

            case 1920:
            case 1280:
                var A_width = 640;
                var A_height = 360;
                break;

            case 160:
                var A_width = 640;
                var A_height = 512;
                break;

            case 720:
                var A_width = X_width;
                var A_height = X_height;
                break;

            case 352:
                var A_width = 704;
                var A_height = (X_height == 240) ? 480 : 576;
                break;

            case 176:
                var A_width = 704;
                var A_height = (X_height == 128) ? 512 : 576;
                break;
        }
    }

    var Rotation = $('#image_rotation').val();

    if (Rotation == 1 || Rotation == 3) {
        var tmpWH = A_width;
        A_width = A_height;
        A_height = tmpWH;
    }

    Compliance_WH(A_width, A_height);
    SetCookie('Rotation', chg_img);
}

// ===== show Path =====
function show_path() {

    var rtsp = document.getElementById('RTSPCtl');

    if (isWin7())
        alert('You must be an administrator to open Internet Explorer');

    var record_path = rtsp.DirectoryBrowse('');

    if (record_path == '')
        return false;
    else {
        $('#record_path').val(record_path);
        $('#display_path').attr('title', record_path);
    }

    Save_Cookie();
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

function Change_Record_FrameRate(video_source) {

    var rtsp = document.getElementById('RTSPCtl');
    var Stream_Framerate = media_profile_framerate[video_source];

    if (rtsp.IsRecord() != 0) {
        rtsp.StopRecord();

        var Path = $('#record_path').val();
        var record_file_path = Path + '\\AM.avi';

        if (rtsp.StartRecord(record_file_path, Stream_Framerate)) {
            if (rtsp.IsDiskFull() == 1) {
                alert(LV_msg2);
                rtsp.StopRecord();
                $('#display_record').attr('src', '/images/icon/record.gif');
            }
        }
        else
            alert('error');
    }
}

var RCD_flag = false;

function Recycle_check_disk() {

    var rtsp = document.getElementById('RTSPCtl');

    if (rtsp.IsDiskFull() == 1) {
        alert(LV_msg2);
        document.getElementById('display_record').src = '/images/icon/record.gif';
        rtsp.StopRecord();
        if (RCD_flag) {
            clearTimeout(RCD_timer);
            RCD_flag = false;
        }
    }
    else {
        RCD_flag = true;
        RCD_timer = setTimeout('Recycle_check_disk()', 1000);
    }
}

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

// ===== DPTZ =====
function move_dptz(motion) {

    if (!flag) {
        alert(LV_msg4);
        return false;
    }
    else
        flag = false;

    var stream_id = parseInt($('#Video_Source').val());
    var move_range = parseInt($('#DPTZ_range').val());
    var Sensor = $('#Sensor').val();
    var TVStandards = parseInt($('#TVStandards').val());


    if (stream_id % 2 == 1)
        stream_id--;

    if (Sensor == "fcbeh4300")
        stream_id++;

    // ----- Width, Height of Stream 1 -----
    var Source_Resolution_Width = parseInt(media_profile_resolution_width[0]);
    var Source_Resolution_Height = parseInt(media_profile_resolution_height[0]);

    // ----- DPTZ (media_profile_dptz_horzoffset to x, media_profile_dptz_vertoffset to y) -----
    var Source_DPTZ_HorzOffset = parseInt(media_profile_dptz_horzoffset[stream_id]);
    var Source_DPTZ_VertOffset = parseInt(media_profile_dptz_vertoffset[stream_id]);

    // ----- Width, Height of DPTZ -----
    var Source_DPTZ_Width = parseInt(media_profile_dptz_width[stream_id]);
    var Source_DPTZ_Height = parseInt(media_profile_dptz_height[stream_id]);
    var Source_limit_Right = Source_Resolution_Width - Source_DPTZ_Width;
    var Source_limit_Down = Source_Resolution_Height - Source_DPTZ_Height;




    switch (motion) {
        case 'UP':
            Source_DPTZ_VertOffset -= move_range;
            break;

        case 'DOWN':
            Source_DPTZ_VertOffset += move_range;
            break;

        case 'LEFT':
            Source_DPTZ_HorzOffset -= move_range;
            break;

        case 'RIGHT':
            Source_DPTZ_HorzOffset += move_range;
            break;

            // ----- Left and Up -----
        case 'LU':
            Source_DPTZ_VertOffset -= move_range;
            Source_DPTZ_HorzOffset -= move_range;
            break;

            // ----- Right and Up -----
        case 'RU':
            Source_DPTZ_VertOffset -= move_range;
            Source_DPTZ_HorzOffset += move_range;
            break;

            // ----- Left and Down -----
        case 'LD':
            Source_DPTZ_VertOffset += move_range;
            Source_DPTZ_HorzOffset -= move_range;
            break;

            // ----- Right and Down -----
        case 'RD':
            Source_DPTZ_VertOffset += move_range;
            Source_DPTZ_HorzOffset += move_range;
            break;

        default:
            break;
    }

    // ----- check UP limit -----
    if (Source_DPTZ_VertOffset < 0) {
        alert(LV_msg5);
        flag = true;
        return false;
    }

    // ----- check Down limit -----
    if (Source_DPTZ_VertOffset > Source_limit_Down) {
        alert(LV_msg6);
        flag = true;
        return false;
    }

    // ----- check Left limit -----
    if (Source_DPTZ_HorzOffset < 0) {
        alert(LV_msg7);
        flag = true;
        return false;
    }

    // ----- check Right limit -----
    if (Source_DPTZ_HorzOffset > Source_limit_Right) {
        alert(LV_msg8);
        flag = true;
        return false;
    }

    media_profile_dptz_vertoffset[stream_id] = Source_DPTZ_VertOffset;
    media_profile_dptz_horzoffset[stream_id] = Source_DPTZ_HorzOffset;

    var Get_url = '/cgi-bin/viewer/viewer.cgi?action=rotate.dptz' +
				  '&media_profile_dptz_id=' + encodeURIComponent(stream_id) +
				  '&media_profile_dptz_vertoffset=' + encodeURIComponent(Source_DPTZ_VertOffset) +
				  '&media_profile_dptz_horzoffset=' + encodeURIComponent(Source_DPTZ_HorzOffset) +
				  '&system_deviceinformation_sensor=' + encodeURIComponent(Sensor) +
				  '&system_deviceinformation_tvstandards=' + encodeURIComponent(TVStandards) +
				  '&timeStamp=' + new Date().getTime();


    /*				  
        createXHR();
    
        xmlHttp.onreadystatechange = catchResult_flag;
        xmlHttp_process_GET( Get_url );
        alert( Get_url );
    */

    //Liveview_Save_process( Get_url );	
    $.ajax({
        type: 'GET',
        url: Get_url,
        dataType: 'text',
        cache: false,
        async: true,
        error: function () {
            alert(MsgResponseError);
        },
        success: function (response) {
            flag = true;


        }
    });


}


function Liveview_Save_process(Get_url) {
    $.ajax({
        type: 'GET',
        url: Get_url,
        dataType: 'text',
        cache: false,
        async: false,
        error: function () {
            alert(MsgResponseError);
        },
        success: function (response) {
            flag = true;


        }
    });
}



// ===== PTZ Settings =====
// ----- Preset Point Control -----
function goto_point(cmd) {

    if (!flag) {
        alert(LV_msg4);
        return false;
    }
    else
        flag = false;

    var go_point = $('#preset_point').val();

    if (cmd == 95) { // Menu Open
        cmd = 64;
        go_point = 95;
    }

    var Get_url = '/cgi-bin/viewer/viewer.cgi?action=ptz.control' +
				  '&ptz_cmd=' + encodeURIComponent(cmd) +
				  '&ptz_go_point=' + encodeURIComponent(go_point) +
				  '&timeStamp=' + new Date().getTime();

    createXHR();

    xmlHttp.onreadystatechange = catchResult_flag;
    xmlHttp_process_GET(Get_url);
}

// ----- Preset Point Control -----
function ZoomScan(cmd) {

    if (!flag) {
        alert(LV_msg4);
        return false;
    }
    else
        flag = false;

    var ptz_cmd = 66;
    if (cmd == "start") {
        var ptz_go_point = 99;
    }
    else {
        var ptz_go_point = 96;
    }

    var Get_url = '/cgi-bin/viewer/viewer.cgi?action=ptz.control' +
				  '&ptz_cmd=' + encodeURIComponent(ptz_cmd) +
				  '&ptz_go_point=' + encodeURIComponent(ptz_go_point) +
				  '&timeStamp=' + new Date().getTime();

    createXHR();

    xmlHttp.onreadystatechange = catchResult_flag;
    xmlHttp_process_GET(Get_url);
}



//===== PTZ Control =====
function PTZ_move_Control(cmd) {

    PTZ_move_timer = setTimeout('Call_PTZ_move_Control(' + cmd + ')', 10);
}

function PTZ_move_Control_UP(cmd) {

    clearTimeout(PTZ_move_timer);

    var Get_url = '/cgi-bin/viewer/viewer.cgi?action=ptz.control' +
				  '&ptz_cmd=' + encodeURIComponent(cmd) +
				  '&ptz_go_point=0' +
				  '&ptz_status=1' +
				  '&timeStamp=' + new Date().getTime();

    createXHR();

    xmlHttp.onreadystatechange = catchResult_flag;
    xmlHttp_process_GET(Get_url);
}

function Call_PTZ_move_Control(cmd) {

    if (!flag)
        return false;
    else
        flag = false;

    var Get_url = '/cgi-bin/viewer/viewer.cgi?action=ptz.control' +
				  '&ptz_cmd=' + encodeURIComponent(cmd) +
				  '&ptz_go_point=0' +
				  '&ptz_status=0' +
				  '&timeStamp=' + new Date().getTime();

    createXHR();

    xmlHttp.onreadystatechange = catchResult_flag;
    xmlHttp_process_GET(Get_url);
}

// ===== Optics Control =====
var Optics_Options_command_on = new Array(32, 35, 37, 80, 82); 	// Zoom,Focus,Iris,AutoZone,ZoneScan
var Optics_Options_command_off = new Array(33, 34, 36, 81, 83); 	// Zoom,Focus,Iris,AutoZone,ZoneScan

function Optics_move_Control(cmd) {

    /*
	if( !flag )
		return false;
	else
		flag = false;
	*/
    for (var i = 0; i < Optics_array.length; i++) {
        if (document.getElementById(Optics_array[i]).src.match('-2.jpg')) {
            var j = i;
            if (i == 3) {
                var Option_Zone = $('#PTZ_Protocol').val();

                if (Option_Zone == 0)
                    j++;
            }
        }
    }

    if (cmd == 'on') var cmd_number = Optics_Options_command_on[j];
    else var cmd_number = Optics_Options_command_off[j];

    var Model = $('#Model').val();
    if ((Model == 'AM9243-YK') || (Model == 'AM9243-YO')) {
        if (cmd_number == 82) {
            ZoomScan("start");
            return;
        }
        else if (cmd_number == 83) {
            ZoomScan("stop");
            return;
        }
    }

    if ((cmd_number == 37) || (cmd_number == 36)) {// IRIS do not keep action
        //Optics_move_Control_UP(cmd);
        IrisAdjust("IRIS", cmd_number, 1);
        return;
    }

    Optics_timer = setTimeout('Call_Optics_move_Control(' + cmd_number + ')', 10);
}

function Call_Optics_move_Control(cmd_number) {

    var Get_url = '/cgi-bin/viewer/viewer.cgi?action=ptz.control' +
				  '&ptz_cmd=' + encodeURIComponent(cmd_number) +
				  '&ptz_go_point=0' +
				  '&ptz_status=0' +
				  '&timeStamp=' + new Date().getTime();

    createXHR();

    xmlHttp.onreadystatechange = catchResult_flag;
    xmlHttp_process_GET(Get_url);
}

function IrisAdjust(action, change, status) {

    var Get_url = '/cgi-bin/viewer/viewer.cgi?action=ptz.control' +
			      '&ptz_cmd=' + encodeURIComponent(change) +
				  '&ptz_go_point=0' +
				  '&ptz_status=' + status +
				  '&timeStamp=' + new Date().getTime();

    createXHR();

    xmlHttp.onreadystatechange = catchResult_flag;
    xmlHttp_process_GET(Get_url);
}

function Optics_move_Control_UP(cmd) {

    //$('#PTZ_Control_Action').html("Optics_move_Control_UP CMD =>" + cmd + ", Status = 1");

    //clearTimeout( Optics_timer );

    for (var i = 0; i < Optics_array.length; i++) {
        if (document.getElementById(Optics_array[i]).src.match('-2.jpg')) {
            var j = i;
            if (i == 3) {
                var Option_Zone = $('#PTZ_Protocol').val();
                if (Option_Zone == 0)
                    j++;
            }
        }
    }

    if (cmd == 'on') var cmd_number = Optics_Options_command_on[j];
    else var cmd_number = Optics_Options_command_off[j];

    var Model = $('#Model').val();
    //if ( Model == 'AM9243-YK' ) {
    if ((Model == 'AM9243-YK') || (Model == 'AM9243-YO')) {
        if ((cmd_number == 82) || (cmd_number == 83) || (cmd_number == 36) || (cmd_number == 37))
            return;
    }

    var Get_url = '/cgi-bin/viewer/viewer.cgi?action=ptz.control' +
			      '&ptz_cmd=' + encodeURIComponent(cmd_number) +
				  '&ptz_go_point=0' +
				  '&ptz_status=1' +
				  '&timeStamp=' + new Date().getTime();

    createXHR();

    xmlHttp.onreadystatechange = catchResult_flag;
    xmlHttp_process_GET(Get_url);
}

// ----- Show Optics Options Alt -----
var Optics_array = new Array('Optics_Zoom', 'Optics_Focus', 'Optics_Iris', 'Optics_Zone');

function Optics_Alt(Optics) {

    for (var i = 0; i < Optics_array.length; i++) {
        var Optics_Img = document.getElementById(Optics_array[i]).src;

        if (Optics_Img.match('-2.jpg'))
            document.getElementById(Optics_array[i]).src = Optics_Img.replace('-2.jpg', '.jpg');
    }

    var Decrease = document.getElementById('ptz_optics_decrease');
    var Increase = document.getElementById('ptz_optics_increase');

    switch (Optics) {
        case 'Optics_Zoom':
            document.getElementById(Optics).src = document.getElementById(Optics).src.replace('.jpg', '-2.jpg');
            $('#ptz_optics_decrease').attr('title', LV_In);
            $('#ptz_optics_increase').attr('title', LV_Out);
            $('#ptz_optics_decrease, #ptz_optics_stop, #ptz_optics_increase').show();
            $('#ptz_optics_zone_stop, #ptz_optics_zone_play').hide();
            break;

        case 'Optics_Focus':
            document.getElementById(Optics).src = document.getElementById(Optics).src.replace('.jpg', '-2.jpg');
            $('#ptz_optics_decrease').attr('title', LV_Near);
            $('#ptz_optics_increase').attr('title', LV_Far);
            $('#ptz_optics_decrease, #ptz_optics_stop, #ptz_optics_increase').show();
            $('#ptz_optics_zone_stop, #ptz_optics_zone_play').hide();
            break;

        case 'Optics_Iris':
            document.getElementById(Optics).src = document.getElementById(Optics).src.replace('.jpg', '-2.jpg');
            $('#ptz_optics_decrease').attr('title', LV_Close);
            $('#ptz_optics_increase').attr('title', LV_Open);
            $('#ptz_optics_decrease, #ptz_optics_stop, #ptz_optics_increase').show();
            $('#ptz_optics_zone_stop, #ptz_optics_zone_play').hide();

            $("#ptz_optics_increase").mouseup(function (e) {
                // Don't cancel the browser's default action  
            });

            $("#ptz_optics_decrease").mouseup(function (e) {
                // Don't cancel the browser's default action  
            });
            break;

        case 'Optics_Zone':
            document.getElementById(Optics).src = document.getElementById(Optics).src.replace('.jpg', '-2.jpg');
            $('#ptz_optics_decrease').attr('title', LV_Off);
            $('#ptz_optics_increase').attr('title', LV_On);
            $('#ptz_optics_decrease, #ptz_optics_stop, #ptz_optics_increase').hide();
            $('#ptz_optics_zone_stop, #ptz_optics_zone_play').show();
            break;

        default:
            break;
    }
}

// ===== chg_ptz_speed =====
function chg_ptz_speed() {

    if (!flag)
        return false;
    else
        flag = false;

    //	$('#ptz_speed_select').attr( 'disabled', true );

    var PTZ_Speed = $('#ptz_speed_select').val();

    var Get_url = '../cgi-bin/viewer/viewer.cgi?action=ptz.speed' +
				  '&ptz_setting_speed=' + encodeURIComponent(PTZ_Speed) +
				  '&timeStamp=' + new Date().getTime();

    createXHR();

    xmlHttp.onreadystatechange = catchResult_chg_ptz_speed;
    xmlHttp_process_GET(Get_url);
}

function catchResult_chg_ptz_speed() {

    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
            $('#ptz_speed_select').attr('disabled', false);
            flag = true;
        }
    }
}

// ===== Save Cookie =====
function Save_Cookie() {

    SetCookie('VideoSource', $('#Video_Source').val());		//  ----- Video Source ----- 
    SetCookie('Rotation', $('#image_rotation').val());		// ----- Rotation -----
    SetCookie('Real_Size', $('#display_real_size').val());	// ----- Real Size -----
    SetCookie('record_path', $('#record_path').val());		// ----- Path -----
}



// ===== Change html widht, height =====
function Compliance_WH_QT(A_width, A_height) {

    // wrapper
    $('#wrapper').width(1000);

    // header
    $('#header').width(925);

    $('#header_right_top, #header_right_bottom').css('left', '911px');

    $('#header_top_line, #header_bottom_line').width(897);
    $('#header_right_line').css('left', '923px');

    $('#text_position').css('left', '690px');

    // primary
    $('#primary_live').width(680);

    $('#primary_top_line, #primary_bottom_line').width(652);
    $('#primary_bottom_line').css('top', '513px');
    $('#primary_left_line').height(487);
    $('#primary_right_line').css('left', '678px');
    $('#primary_right_line').height(487);

    $('#primary_left_bottom').css('top', '501px');
    $('#primary_right_top, #primary_right_bottom').css('left', '666px');
    $('#primary_right_bottom').css('top', '501px');

    if (A_width > 640) {
        $('#wrapper').width(A_width + 360);

        // header
        $('#header').width(A_width + 285);
        $('#header_right_top, #header_right_bottom').css('left', (A_width + 271) + 'px');

        $('#header_top_line, #header_bottom_line').width(A_width + 257);
        $('#header_right_line').css('left', (A_width + 283) + 'px');

        $('#text_position').css('left', (A_width + 50) + 'px');

        // primary
        $('#primary_live').width(A_width + 40);
        $('#primary_top_line, #primary_bottom_line').width(A_width + 12);
        $('#primary_right_line').css('left', (A_width + 38) + 'px');

        $('#primary_right_top, #primary_right_bottom').css('left', (A_width + 26) + 'px');
    }

    if (A_height > 480) {
        // primary
        $('#primary_live').height(A_height + 28);
        $('#primary_bottom_line').css('top', (A_height + 33) + 'px');
        $('#primary_left_line, #primary_right_line').height(A_height + 7);

        $('#primary_left_bottom, #primary_right_bottom').css('top', (A_height + 21) + 'px');
    }
}


function Compliance_WH(A_width, A_height) {

    // wrapper
    document.getElementById('wrapper').style.width = 1000;

    // header
    document.getElementById('header').style.width = 925;

    document.getElementById('header_right_top').style.left = 911;
    document.getElementById('header_right_bottom').style.left = 911;

    document.getElementById('header_top_line').style.width = 897;
    document.getElementById('header_bottom_line').style.width = 897;
    document.getElementById('header_right_line').style.left = 923;

    //	document.getElementById('text_position').style.left 	  = 690;
    document.getElementById('Liveview_Setup').style.left = 690;

    // primary
    document.getElementById('primary_live').style.width = 680;

    document.getElementById('primary_top_line').style.width = 652;
    document.getElementById('primary_bottom_line').style.width = 652;
    document.getElementById('primary_bottom_line').style.top = 513;
    document.getElementById('primary_left_line').style.height = 487;
    document.getElementById('primary_right_line').style.left = 678;
    document.getElementById('primary_right_line').style.height = 487;

    document.getElementById('primary_left_bottom').style.top = 501;
    document.getElementById('primary_right_top').style.left = 666;
    document.getElementById('primary_right_bottom').style.left = 666;
    document.getElementById('primary_right_bottom').style.top = 501;

    var A_top = (515 - A_height) / 2;
    var A_left = (680 - A_width) / 2;

    if (A_width > 640) {
        document.getElementById('wrapper').style.width = A_width + 360;

        // header
        document.getElementById('header').style.width = A_width + 285;
        document.getElementById('header_right_top').style.left = A_width + 271;
        document.getElementById('header_right_bottom').style.left = A_width + 271;

        document.getElementById('header_top_line').style.width = A_width + 257;
        document.getElementById('header_bottom_line').style.width = A_width + 257;
        document.getElementById('header_right_line').style.left = A_width + 283;

        //document.getElementById('text_position').style.left = A_width + 50;
        document.getElementById('Liveview_Setup').style.left = A_width + 50;

        // primary
        document.getElementById('primary_live').style.width = A_width + 40;
        document.getElementById('primary_top_line').style.width = A_width + 12;
        document.getElementById('primary_bottom_line').style.width = A_width + 12;
        document.getElementById('primary_right_line').style.left = A_width + 38;

        document.getElementById('primary_right_top').style.left = A_width + 26;
        document.getElementById('primary_right_bottom').style.left = A_width + 26;

        A_left = 20;
    }

    if (A_height > 480) {
        // primary
        document.getElementById('primary_bottom_line').style.top = A_height + 33;
        document.getElementById('primary_left_line').style.height = A_height + 7;
        document.getElementById('primary_right_line').style.height = A_height + 7;

        document.getElementById('primary_left_bottom').style.top = A_height + 21;
        document.getElementById('primary_right_bottom').style.top = A_height + 21;

        A_top = 17;
    }


    document.getElementById('RTSPCtl').style.width = A_width;
    document.getElementById('RTSPCtl').style.height = A_height;

    document.getElementById('RTSPCtl').style.position = 'absolute';
    document.getElementById('RTSPCtl').style.left = A_left;
    document.getElementById('RTSPCtl').style.top = A_top;
}


// ===== Quick Time =====
function Give_Stream(ax_width, ax_height, URL, rtsp_port) {

    var remote_address = give_remote_addr();
    var HPort = Get_Reomote_AddressPort();

    if (HPort != 0)
        Hremote_address = remote_address + ':' + HPort;
    else
        Hremote_address = remote_address + ':80';

    //	var ActiveX_str  = '<object ID="RTSPCtl" width="'+ ax_width +'" height="'+ ax_height +'" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab">';
    //
    var ActiveX_str = '<object ID="RTSPCtl" width="' + ax_width + '" height="' + ax_height + '" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" >';
    ActiveX_str += '<param name="src" value="http://' + Hremote_address + '/viewer/underwater/quicktime/qt.mov">';
    ActiveX_str += '<param name="qtsrc" value="rtsp://' + remote_address + ':' + rtsp_port + '/' + URL + '>';
    ActiveX_str += '<param name="controller" value="true">';
    ActiveX_str += '<param name="scale" value="tofit">';
    ActiveX_str += '<param name="autoplay" value="true">';
    ActiveX_str += '<param name="volume" value="55">';
    ActiveX_str += '<param name="showlogo" value="true">';
    ActiveX_str += '<param name="moviename" value="Camera">';
    ActiveX_str += '<param name="cache" value="false">';
    ActiveX_str += '<param name ="qtsrcdontusebrowser" value="TRUE">';
    ActiveX_str += '<embed';
    ActiveX_str += ' src="http://' + Hremote_address + '/viewer/underwater/quicktime/qt.mov" name="RTSPCtl"';
    ActiveX_str += ' width="' + ax_width + '" height="' + ax_height + '"';
    ActiveX_str += ' controller="true"';
    ActiveX_str += ' scale="tofit"';
    ActiveX_str += ' autoplay="true"';
    ActiveX_str += ' volume="55"';
    ActiveX_str += ' showlogo="false"';
    ActiveX_str += ' moviename="Camera"';
    ActiveX_str += ' cache="false"';
    ActiveX_str += ' qtsrc="rtsp://' + remote_address + ':' + rtsp_port + '/' + URL + '"';
    ActiveX_str += ' qtsrcdontusebrowser="TRUE"';
    ActiveX_str += ' type="video/quicktime"';
    //		ActiveX_str += ' pluginspage="http://www.apple.com/quicktime/download/">';
    ActiveX_str += '</embed>';
    ActiveX_str += '</object>';

    return ActiveX_str;
}

function Stop_QT() {
    document.RTSPCtl.Stop();
}


function ChangeStream() {
    var VideoSource = $('#Video_Source').val();
    SetCookie('VideoSource', VideoSource);
    location.reload();
}


// ===== Give 0 ~ 100 value =====
function One_Hundred(Val, ValID) {

    if (Val < 0) {
        $('#' + ValID).val(0);
        return 0;
    }
    else if (Val > 20) {
        $('#' + ValID).val(20);
        return 20;
    }
    else {
        $('#' + ValID).val(Val);
        return Val;
    }
}

// ===== FCBS4300 Module Zoom Size Mapping Table =====
/*
Because system problem, cause the value D (HEX) can not saving, 
-> change the position value from D to the closer

*/
function getPositionValue(multiple) {

    var ZoomTable = new Object();
    ZoomTable = [
		{ "Mutiple": 1, "Position": 0x0000 },
		{ "Mutiple": 2, "Position": 0x1851 },
		{ "Mutiple": 3, "Position": 0x22BE },
		{ "Mutiple": 4, "Position": 0x28F6 },
		{ "Mutiple": 5, "Position": 0x2C00 },  //0x2D45
		{ "Mutiple": 6, "Position": 0x3086 },
		{ "Mutiple": 7, "Position": 0x3320 },
		{ "Mutiple": 8, "Position": 0x3549 },
		{ "Mutiple": 9, "Position": 0x371E },
		{ "Mutiple": 10, "Position": 0x38B3 },
		{ "Mutiple": 11, "Position": 0x3A12 },
		{ "Mutiple": 12, "Position": 0x3B42 },
		{ "Mutiple": 13, "Position": 0x3C47 },
		{ "Mutiple": 14, "Position": 0x3C00 }, //0x3D25
		{ "Mutiple": 15, "Position": 0x3E00 }, // 0x3DDF
		{ "Mutiple": 16, "Position": 0x3E7B },
		{ "Mutiple": 17, "Position": 0x3EFB },
		{ "Mutiple": 18, "Position": 0x3F64 },
		{ "Mutiple": 19, "Position": 0x3FBA },
		{ "Mutiple": 20, "Position": 0x4000 }
    ];

    for (i = 0; i < ZoomTable.length ; i++)
        if (multiple == ZoomTable[i].Mutiple)
            return ZoomTable[i].Position;
}

function getMultipleValue(position) {

    var ZoomTable = new Object();
    ZoomTable = [
		{ "Mutiple": 1, "Position": 0x0000 },
		{ "Mutiple": 2, "Position": 0x1851 },
		{ "Mutiple": 3, "Position": 0x22BE },
		{ "Mutiple": 4, "Position": 0x28F6 },
		{ "Mutiple": 5, "Position": 0x2C00 },  //0x2D45
		{ "Mutiple": 6, "Position": 0x3086 },
		{ "Mutiple": 7, "Position": 0x3320 },
		{ "Mutiple": 8, "Position": 0x3549 },
		{ "Mutiple": 9, "Position": 0x371E },
		{ "Mutiple": 10, "Position": 0x38B3 },
		{ "Mutiple": 11, "Position": 0x3A12 },
		{ "Mutiple": 12, "Position": 0x3B42 },
		{ "Mutiple": 13, "Position": 0x3C47 },
		{ "Mutiple": 14, "Position": 0x3C00 }, //0x3D25
		{ "Mutiple": 15, "Position": 0x3E00 }, // 0x3DDF
		{ "Mutiple": 16, "Position": 0x3E7B },
		{ "Mutiple": 17, "Position": 0x3EFB },
		{ "Mutiple": 18, "Position": 0x3F64 },
		{ "Mutiple": 19, "Position": 0x3FBA },
		{ "Mutiple": 20, "Position": 0x4000 }
    ];

    for (i = 0; i < ZoomTable.length ; i++)
        if (position == ZoomTable[i].Position)
            return ZoomTable[i].Mutiple;
}


function ZoomMapping(Mutiple, Position) {
    this.Mutiple = enable;
    this.Position = protocol;
}
