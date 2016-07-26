using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Media;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Windows.Forms;

namespace AP.Interсom
{

    public partial class Intercom : Form
    {
        #region Init
        public Intercom()
        {
            player = new SoundPlayer(String.Format("{0}\\skype_ringtone.wav", Directory.GetCurrentDirectory()));
            InitializeComponent();
            chatImage = new Bitmap(AP.Intercom.Properties.Resources.chatPng);
            chat2Image = new Bitmap(AP.Intercom.Properties.Resources.chat2Png);
            openImage = new Bitmap(AP.Intercom.Properties.Resources.openPng);
            closeImage = new Bitmap(AP.Intercom.Properties.Resources.closePng);
            fullScreenImage = new Bitmap(AP.Intercom.Properties.Resources.livePng);
            reConnectTimer = new System.Timers.Timer(30000);
            reConnectTimer.Elapsed += reConnectTimer_Elapsed;
            reConnectTimer.AutoReset = false;
            disableDOTimer = new System.Timers.Timer();
            disableDOTimer.Elapsed += DisableDOTimer_Elapsed;
            ResizeControl();
            connected = false;
            exitFlag = false;
            baloonActive = false;
            incommingCall = false;
            //licenseError = false;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            applicationTray.BalloonTipClicked += ApplicationTray_BalloonTipClicked;
            applicationTray.BalloonTipShown += ApplicationTray_BalloonTipShown;
            applicationTray.BalloonTipClosed += ApplicationTray_BalloonTipClosed;
            applicationTray.MouseClick += ApplicationTray_MouseClick;
            licenseFileChose.FileOk += LicenseFileChose_FileOk;
            #region VitaminInit
            vitaminControl = new AxVITAMINDECODERLib.AxVitaminCtrl();
            ((ISupportInitialize)(this.vitaminControl)).BeginInit();
            this.Controls.Add(vitaminControl);
            vitaminControl.Parent = this;
            vitaminControl.Location = new Point(0, 0);
            vitaminControl.Size = new Size(320, 240);
            vitaminControl.Dock = DockStyle.Fill;
            vitaminControl.Visible = true;
            vitaminControl.BringToFront();
            ((ISupportInitialize)(this.vitaminControl)).EndInit();
            #region Vivotek
            /*
            vitaminControl.ControlType = VITAMINDECODERLib.EControlType.eCtrlNormal;
            //vitaminControl._cx = 12965;
            //vitaminControl._cy = 7938;
            vitaminControl.ControlButtonOpts = 127;// .ClientOptions = 127;
            vitaminControl.DisplayTimeFormat = 0;
            vitaminControl.PtzURL = "";
            vitaminControl.UserDateFormat = true;
            vitaminControl.ControlID = 0;
            vitaminControl.StreamingBufferTime = 0;
            vitaminControl.AutoStartConnection = true;
            vitaminControl.ControlPort = 554;
            vitaminControl.DarwinConnection = false;
            vitaminControl.HttpPort = 80;
            vitaminControl.RemoteIPAddr = "192.168.10.101";
            vitaminControl.Url = "";
            vitaminControl.ViewStream = 0;
            vitaminControl.UserName = "";
            vitaminControl.Password = "";
            vitaminControl.ViewStream = VITAMINDECODERLib.EDualStreamOption.eStream2; // .ViewChannel = 1;
            vitaminControl.HTTPProxyAddress = "";
            vitaminControl.HTTPProxyPassword = "";
            vitaminControl.HTTPProxyPort = 0;
            vitaminControl.HTTPProxyType = 0;
            vitaminControl.HTTPProxyUserName = "";
            vitaminControl.Deblocking = false;
            vitaminControl.Deinterlace = false;
            vitaminControl.IgnoreBorder = false;
            vitaminControl.IgnoreCaption = false;
            vitaminControl.Stretch = true;
            //vitaminControl.VideoSolutionWidth = 1920;
            //vitaminControl.VideoSolutionHeight = 1080;
            //vitaminControl.BeAspectRatio = 0;
            //vitaminControl.AspectRatioSection = 0;
            vitaminControl.StretchFullScreen = false;
            //vitaminControl.ShowStatistics = 0;
            vitaminControl.DisplayMotionFrame = true; // .EnableMotionAlert = -1;
            vitaminControl.PlayMute = false;
            vitaminControl.PlayVolume = 50;
            vitaminControl.EnableMuteWhenTalk = false;
            vitaminControl.MicMute = false;
            vitaminControl.MicVolume = 50;
            //vitaminControl.TalkWithVideoServerMap = 0;
            vitaminControl.DisplayErrorMsg = false;
            //vitaminControl.NoMemoryMsg = Out of memory;
            //vitaminControl.MJpegMsg = Not support MJPEG;
            vitaminControl.DigitalZoomEnabled = false;
            //vitaminControl.DigitalZoomDisplayPlugin = 264175688;
            //vitaminControl.DigitalZoomWidth = 160;
            //vitaminControl.DigitalZoomHeight = 120;
            vitaminControl.ClickEventHandler = VITAMINDECODERLib.EClickEventHandler.clickHandleSendEvent;
            vitaminControl.WheelEventHandler = true;
            //vitaminControl.CurrentJoystickIndex = 0;
            vitaminControl.EnableJoystick = true;
            //vitaminControl.JoystickBtnTriggerStyle = 0;
            vitaminControl.JoystickSpeedLvs = 5;
            //vitaminControl.JoystickUpdateInterval = 100;
            vitaminControl.JoystickPanSpeedLvs = 5;
            vitaminControl.JoystickTiltSpeedLvs = 5;
            vitaminControl.JoystickZoomSpeedLvs = 5;
            vitaminControl.JoystickSpeedPercentage = 100;
            //vitaminControl.EnableZoomEnhancement = 0;
            //vitaminControl.SnapshotQuality = 0;
            //vitaminControl.AutoReStartMP4Recording = 0;
            //vitaminControl.BePlaybackChannel = 0;
            //vitaminControl.VNDPWrapperUrlPath = ;
            //vitaminControl.VNDPWrapperVersion = ;
            vitaminControl.MediaType = 0;
            vitaminControl.ConnectionProtocol = 0;
            vitaminControl.ReadSettingByParam = true;
            //vitaminControl.EnableMetadata = 0;
            vitaminControl.BitmapFile = "";
            //vitaminControl.UseBitmap = 0;
            //vitaminControl.MDTuningFreq = 0;
            //vitaminControl.EnableROI = 0;
            //vitaminControl.ShowShrunkImgOnly = 0;
            //vitaminControl.ShrunkBrightness = 0;
            vitaminControl.AntiTearing = false; // .EnableAntiTearing = 0;
            vitaminControl.RegkeyRoot = VITAMINDECODERLib.ERegistryRoot.eRegCurrentUser; // .RegistryKeyRoot = 1;
            vitaminControl.RegSubKey = "Vivotek"; // .RegistryUniqID = 0;
            vitaminControl.EnableFishEye = false;
            vitaminControl.ChangePresentMode = 0;
            vitaminControl.FishEyeMountType = 0;
            vitaminControl.FishEyeAspectRatioWidth = 1;
            vitaminControl.FishEyeAspectRatioHeight = 1;
            vitaminControl.FishEyeInitLocationInfo = "";
            //vitaminControl.FishEyeShowZoomRatio = 0;
            //vitaminControl.FishEyeClippedPanorama = 0;
            //vitaminControl.ViewCellFocused = -1;
            //vitaminControl.EnableFishEyeSW = 0;
            vitaminControl.SVCTFrameLevel = 9;
            vitaminControl.SVCTDecodeLevel = 8;
            vitaminControl.SVCTFrameInterval = 0;
            */
            #endregion
            vitaminControl.MP4Prefix = "ap.intercom";
            vitaminControl.PlayMute = true;
            vitaminControl.DisplayErrorMsg = false;
            vitaminControl.MicVolume = 100;
            vitaminControl.OnConnectionOK += VitaminControl_OnConnectionOK;
            vitaminControl.OnConnectionBroken += VitaminControl_OnConnectionBroken;
            vitaminControl.OnDIDOAlert += VitaminControl_OnDIDOAlert;
            vitaminControl.AutoReconnect = false;
            vitaminControl.StretchFullScreen = true;
            LoadConfig();
            vitaminControl.ControlType = VITAMINDECODERLib.EControlType.eCtrlNoCtrlBar;
            //vitaminControl.HideConnectIP = true;
            //vitaminControl.DisplayErrorMsg = true;
            licensed = VerifyLicense();
            //licensed = true;
            if (licensed)
            {
                vitaminControl.Connect();
            }
#if (DEBUG)
            {
                vitaminControl.ControlType = VITAMINDECODERLib.EControlType.eCtrlNormal;
            }
#endif
            #endregion
            //RNGCryptoServiceProvider random = new RNGCryptoServiceProvider();
            //byte[] salt = new byte[32];
            //random.GetNonZeroBytes(salt);
            //Clipboard.SetText(Convert.ToBase64String(salt));
            //vitaminControl.RemoteIPAddr = Properties.Settings.Default.ServerIP;
            //vitaminControl.HttpPort = Properties.Settings.Default.HttpPort;
            //vitaminControl.UserName = Properties.Settings.Default.Login;
            //byte[] passwordBytes = Encoding.ASCII.GetBytes("1q2w3e4r");
            //byte[] protectedBytes = ProtectedData.Protect(passwordBytes, null, DataProtectionScope.CurrentUser);
            //MessageBox.Show(Convert.ToBase64String(protectedBytes));
            //Clipboard.Clear();
            //Clipboard.SetText(Convert.ToBase64String(protectedBytes));
            //vitaminControl.Password = Encoding.ASCII.GetString(ProtectedData.Unprotect(Convert.FromBase64String(Properties.Settings.Default.Password), null, DataProtectionScope.CurrentUser));
            //vitaminControl.PlayMute = true;
            //vitaminControl.MP4Path = Properties.Settings.Default.WorkDir;
            //vitaminControl.MP4Prefix = "ap.intercom";
            //vitaminControl.Connect();
            //JavaScriptSerializer json = new JavaScriptSerializer();
            //Config config = new Config();
            //config.CameraIP = Properties.Settings.Default.ServerIP;
            //config.HttpPort = Properties.Settings.Default.HttpPort;
            //config.UserName = Properties.Settings.Default.Login;
            //config.Password = Properties.Settings.Default.Password;
            //config.RecordPath = Properties.Settings.Default.WorkDir;
            //Clipboard.Clear();
            //Clipboard.SetText(json.Serialize(config));
            //vitaminControl.Password = ProtectedData.Unprotect(Properties.Settings.Default.Password);
            if (this.cameraPassword.Control is TextBox)
            {
                TextBox tb = this.cameraPassword.Control as TextBox;
                tb.PasswordChar = '*';
            }

        }

        private void LicenseFileChose_FileOk(object sender, CancelEventArgs e)
        {
            //MessageBox.Show("sss");
            //File.Copy(licenseFileChose.FileName, Path.Combine(Program.APfolder, Path.GetFileName(licenseFileChose.FileName)), true);
            foreach (string licenseFile in licenseFileChose.FileNames)
            {
                //MessageBox.Show(licenseFile + "\r\n" + Path.Combine(Program.APfolder, Path.GetFileName(licenseFile)));

                File.Copy(licenseFile, Path.Combine(Program.APfolder, Path.GetFileName(licenseFile)), true);
            }
        }

        private void LoadConfig()
        {
            vitaminControl.RemoteIPAddr = AP.Intercom.Properties.Settings.Default.CameraIP;
            vitaminControl.HttpPort = AP.Intercom.Properties.Settings.Default.HttpPort;
            vitaminControl.UserName = AP.Intercom.Properties.Settings.Default.UserName;
            vitaminControl.MP4Path = AP.Intercom.Properties.Settings.Default.RecordPath;
            if (!String.IsNullOrEmpty(AP.Intercom.Properties.Settings.Default.Password) && !String.IsNullOrWhiteSpace(AP.Intercom.Properties.Settings.Default.Password))
            {
                try
                {
                    password = Encoding.ASCII.GetString(ProtectedData.Unprotect(Convert.FromBase64String(AP.Intercom.Properties.Settings.Default.Password), null, DataProtectionScope.LocalMachine));
                }
                catch
                {
                    applicationTray.ShowBalloonTip(1000, "AP Intercom", "Wrong password hash!", ToolTipIcon.Error);
                    password = "";
                }
            }
            vitaminControl.Password = password;
            cameraIP.Text = vitaminControl.RemoteIPAddr;
            cameraPort.Text = vitaminControl.HttpPort.ToString();
            cameraUserName.Text = vitaminControl.UserName;
            cameraPassword.Text = vitaminControl.Password;
            workPath.Text = vitaminControl.MP4Path;
            this.TopMost = AP.Intercom.Properties.Settings.Default.TopMost;
        }
        #region Init Designer
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Intercom));
            this.controlPanel = new System.Windows.Forms.Panel();
            this.fullScreenButton = new System.Windows.Forms.CheckBox();
            this.closeButton = new System.Windows.Forms.CheckBox();
            this.openButton = new System.Windows.Forms.CheckBox();
            this.chatButton = new System.Windows.Forms.CheckBox();
            this.applicationTray = new System.Windows.Forms.NotifyIcon(this.components);
            this.applicationMenu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.licenseFileChose = new System.Windows.Forms.OpenFileDialog();
            this.liveToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.configStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.cameraIP = new System.Windows.Forms.ToolStripTextBox();
            this.cameraPort = new System.Windows.Forms.ToolStripTextBox();
            this.cameraUserName = new System.Windows.Forms.ToolStripTextBox();
            this.cameraPassword = new System.Windows.Forms.ToolStripTextBox();
            this.workPath = new System.Windows.Forms.ToolStripTextBox();
            this.licenseMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripSeparator1 = new System.Windows.Forms.ToolStripSeparator();
            this.SaveConfig = new System.Windows.Forms.ToolStripMenuItem();
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.controlPanel.SuspendLayout();
            this.applicationMenu.SuspendLayout();
            this.SuspendLayout();
            // 
            // controlPanel
            // 
            this.controlPanel.Controls.Add(this.fullScreenButton);
            this.controlPanel.Controls.Add(this.closeButton);
            this.controlPanel.Controls.Add(this.openButton);
            this.controlPanel.Controls.Add(this.chatButton);
            this.controlPanel.Dock = System.Windows.Forms.DockStyle.Right;
            this.controlPanel.Location = new System.Drawing.Point(691, 0);
            this.controlPanel.Name = "controlPanel";
            this.controlPanel.Size = new System.Drawing.Size(128, 561);
            this.controlPanel.TabIndex = 0;
            // 
            // fullScreenButton
            // 
            this.fullScreenButton.Appearance = System.Windows.Forms.Appearance.Button;
            this.fullScreenButton.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.fullScreenButton.Location = new System.Drawing.Point(18, 137);
            this.fullScreenButton.Name = "fullScreenButton";
            this.fullScreenButton.Size = new System.Drawing.Size(71, 23);
            this.fullScreenButton.TabIndex = 3;
            this.fullScreenButton.UseVisualStyleBackColor = true;
            this.fullScreenButton.CheckedChanged += new System.EventHandler(this.fullScreenButton_CheckedChanged);
            // 
            // closeButton
            // 
            this.closeButton.Appearance = System.Windows.Forms.Appearance.Button;
            this.closeButton.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.closeButton.Location = new System.Drawing.Point(18, 108);
            this.closeButton.Name = "closeButton";
            this.closeButton.Size = new System.Drawing.Size(71, 23);
            this.closeButton.TabIndex = 2;
            this.closeButton.UseVisualStyleBackColor = true;
            this.closeButton.CheckedChanged += new System.EventHandler(this.closeButton_CheckedChanged);
            // 
            // openButton
            // 
            this.openButton.Appearance = System.Windows.Forms.Appearance.Button;
            this.openButton.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.openButton.Location = new System.Drawing.Point(18, 79);
            this.openButton.Name = "openButton";
            this.openButton.Size = new System.Drawing.Size(71, 23);
            this.openButton.TabIndex = 1;
            this.openButton.UseVisualStyleBackColor = true;
            this.openButton.CheckedChanged += new System.EventHandler(this.openButton_CheckedChanged);
            // 
            // chatButton
            // 
            this.chatButton.Appearance = System.Windows.Forms.Appearance.Button;
            this.chatButton.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.chatButton.Location = new System.Drawing.Point(18, 35);
            this.chatButton.Name = "chatButton";
            this.chatButton.Size = new System.Drawing.Size(71, 23);
            this.chatButton.TabIndex = 0;
            this.chatButton.UseVisualStyleBackColor = true;
            this.chatButton.CheckedChanged += new System.EventHandler(this.chatButton_CheckedChanged);
            // 
            // applicationTray
            // 
            this.applicationTray.BalloonTipIcon = System.Windows.Forms.ToolTipIcon.Warning;
            this.applicationTray.ContextMenuStrip = this.applicationMenu;
            this.applicationTray.Icon = ((System.Drawing.Icon)(resources.GetObject("applicationTray.Icon")));
            this.applicationTray.Text = "AP Intercom";
            this.applicationTray.Visible = true;
            // 
            // applicationMenu
            // 
            this.applicationMenu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.liveToolStripMenuItem,
            this.configStripMenuItem,
            this.exitToolStripMenuItem});
            this.applicationMenu.Name = "applicationMenu";
            this.applicationMenu.Size = new System.Drawing.Size(111, 70);
            // 
            // licenseFileChose
            // 
            this.licenseFileChose.Filter = "AP License|*.key|All files|*.*";
            this.licenseFileChose.Multiselect = true;
            // 
            // liveToolStripMenuItem
            // 
            this.liveToolStripMenuItem.Image = global::AP.Intercom.Properties.Resources.livePng;
            this.liveToolStripMenuItem.Name = "liveToolStripMenuItem";
            this.liveToolStripMenuItem.Size = new System.Drawing.Size(110, 22);
            this.liveToolStripMenuItem.Text = "Live";
            this.liveToolStripMenuItem.Click += new System.EventHandler(this.liveToolStripMenuItem_Click);
            // 
            // configStripMenuItem
            // 
            this.configStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.cameraIP,
            this.cameraPort,
            this.cameraUserName,
            this.cameraPassword,
            this.workPath,
            this.licenseMenuItem,
            this.toolStripSeparator1,
            this.SaveConfig});
            this.configStripMenuItem.Image = global::AP.Intercom.Properties.Resources.settingsPng;
            this.configStripMenuItem.Name = "configStripMenuItem";
            this.configStripMenuItem.Size = new System.Drawing.Size(110, 22);
            this.configStripMenuItem.Text = "Config";
            // 
            // cameraIP
            // 
            this.cameraIP.Name = "cameraIP";
            this.cameraIP.Size = new System.Drawing.Size(100, 23);
            // 
            // cameraPort
            // 
            this.cameraPort.Name = "cameraPort";
            this.cameraPort.Size = new System.Drawing.Size(100, 23);
            // 
            // cameraUserName
            // 
            this.cameraUserName.Name = "cameraUserName";
            this.cameraUserName.Size = new System.Drawing.Size(100, 23);
            // 
            // cameraPassword
            // 
            this.cameraPassword.Name = "cameraPassword";
            this.cameraPassword.Size = new System.Drawing.Size(100, 23);
            // 
            // workPath
            // 
            this.workPath.Name = "workPath";
            this.workPath.Size = new System.Drawing.Size(100, 23);
            // 
            // licenseMenuItem
            // 
            this.licenseMenuItem.Image = global::AP.Intercom.Properties.Resources.camPng;
            this.licenseMenuItem.Name = "licenseMenuItem";
            this.licenseMenuItem.Size = new System.Drawing.Size(160, 22);
            this.licenseMenuItem.Text = "Attach License";
            this.licenseMenuItem.Click += new System.EventHandler(this.licenseMenuItem_Click);
            // 
            // toolStripSeparator1
            // 
            this.toolStripSeparator1.Name = "toolStripSeparator1";
            this.toolStripSeparator1.Size = new System.Drawing.Size(157, 6);
            // 
            // SaveConfig
            // 
            this.SaveConfig.Image = global::AP.Intercom.Properties.Resources.applyPng;
            this.SaveConfig.Name = "SaveConfig";
            this.SaveConfig.Size = new System.Drawing.Size(160, 22);
            this.SaveConfig.Text = "Apply";
            this.SaveConfig.Click += new System.EventHandler(this.SaveConfig_Click);
            // 
            // exitToolStripMenuItem
            // 
            this.exitToolStripMenuItem.Image = global::AP.Intercom.Properties.Resources.exitPng;
            this.exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            this.exitToolStripMenuItem.Size = new System.Drawing.Size(110, 22);
            this.exitToolStripMenuItem.Text = "Exit";
            this.exitToolStripMenuItem.Click += new System.EventHandler(this.exitToolStripMenuItem_Click);
            // 
            // Intercom
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(819, 561);
            this.Controls.Add(this.controlPanel);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MinimumSize = new System.Drawing.Size(800, 600);
            this.Name = "Intercom";
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "AP Intercom";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Intercom_FormClosing);
            this.VisibleChanged += new System.EventHandler(this.Intercom_VisibleChanged);
            this.Resize += new System.EventHandler(this.Intercom_ClientSizeChanged);
            this.controlPanel.ResumeLayout(false);
            this.applicationMenu.ResumeLayout(false);
            this.ResumeLayout(false);

        }
        #endregion
        #endregion

        #region Variables
        private Panel controlPanel;
        private NotifyIcon applicationTray;
        private ContextMenuStrip applicationMenu;
        private ToolStripMenuItem liveToolStripMenuItem;
        private ToolStripMenuItem exitToolStripMenuItem;
        private CheckBox chatButton;
        private CheckBox openButton;
        private CheckBox closeButton;
        private CheckBox fullScreenButton;
        private ToolStripMenuItem configStripMenuItem;
        private ToolStripTextBox cameraIP;
        private ToolStripTextBox cameraPort;
        private ToolStripTextBox cameraUserName;
        private ToolStripTextBox cameraPassword;
        private ToolStripTextBox workPath;
        private ToolStripMenuItem SaveConfig;
        private IContainer components;
        private bool connected;
        private bool exitFlag;
        private bool baloonActive;
        private bool incommingCall;
        private bool licensed;
        private Image chatImage;
        private Image chat2Image;
        private Image openImage;
        private Image closeImage;
        private Image fullScreenImage;
        private SoundPlayer player;
        private string serialNumber;
        private System.Timers.Timer reConnectTimer;
        private System.Timers.Timer disableDOTimer;
        private byte[] salt = Convert.FromBase64String("BsHtlzB/xVcmoa9OlN8e0zteScckQYYi0gaS1RpD99k=");
        private ToolStripMenuItem licenseMenuItem;
        private ToolStripSeparator toolStripSeparator1;
        private OpenFileDialog licenseFileChose;
        private AxVITAMINDECODERLib.AxVitaminCtrl vitaminControl;
        private string password;
        #endregion

        #region Balloon
        private void ApplicationTray_BalloonTipClicked(object sender, EventArgs e)
        {
            //this.Show();
            //this.WindowState = FormWindowState.Maximized;
            player.Stop();
            if (incommingCall)
            {
                this.Show();
                this.Activate();
                this.WindowState = FormWindowState.Normal;
            }
        }

        private void ApplicationTray_BalloonTipClosed(object sender, EventArgs e)
        {
            baloonActive = false;
            incommingCall = false;
            player.Stop();
        }

        private void ApplicationTray_BalloonTipShown(object sender, EventArgs e)
        {
            if (incommingCall)
            {
                baloonActive = true;
            }
        }

        private void ApplicationTray_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                if (this.Visible)
                {
                    this.Hide();
                    this.WindowState = FormWindowState.Minimized;
                }
                else
                {
                    //Mute(true);
                    this.Show();
                    this.Activate();
                    this.WindowState = FormWindowState.Normal;
                }
            }
        }
        #endregion

        #region Timers
        private void DisableDOTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            vitaminControl.SendDigitalOut(1, 0);
        }

        private void reConnectTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (licensed)
            {
                vitaminControl.Connect();
            }
        }
        #endregion

        #region Vitamin
        private bool VerifyLicense()
        {
            using (WebClient webClient = new WebClient())
            {
                NetworkCredential credential = new NetworkCredential();
                webClient.Credentials = CredentialCache.DefaultCredentials;
                UriBuilder uri = new UriBuilder();
                uri.Host = AP.Intercom.Properties.Settings.Default.CameraIP;
                uri.Port = AP.Intercom.Properties.Settings.Default.HttpPort;
                uri.Path = "cgi-bin/viewer/getparam.cgi";
                uri.Query = "system_info_serialnumber";
                uri.Scheme = "http";
                credential.UserName = AP.Intercom.Properties.Settings.Default.UserName;
                credential.Password = password;
                webClient.Credentials = credential;
                try
                {
                    Stream data = webClient.OpenRead(uri.Uri.OriginalString);
                    StreamReader reader = new StreamReader(data);
                    string serialNumberRaw = reader.ReadToEnd();
                    serialNumber = serialNumberRaw.Replace("system_info_serialnumber", "").Replace("=", "").Replace("'", "").Trim();
                }
                catch (Exception ex)
                {
                    applicationTray.ShowBalloonTip(0, "AP Intercom", "Connection error!\r\n" + ex.Message, ToolTipIcon.Error);
                    return false;
                }
            }
            SHA1CryptoServiceProvider sha1 = new SHA1CryptoServiceProvider();
            byte[] sn = Encoding.ASCII.GetBytes(serialNumber);
            byte[] saltedSerial = new byte[salt.Length + sn.Length];
            sn.CopyTo(saltedSerial, 0);
            salt.CopyTo(saltedSerial, sn.Length);
            byte[] hash = sha1.ComputeHash(saltedSerial);
            string licenseFile = Path.Combine(Program.APfolder, Path.GetFileName(serialNumber + ".key"));
            //MessageBox.Show(Path.Combine(Program.APfolder, Path.GetFileName(serialNumber + ".key")));
            if (File.Exists(licenseFile))
            {
                byte[] licenseByte = File.ReadAllBytes(licenseFile);
                return hash.SequenceEqual(licenseByte);
            }
            applicationTray.ShowBalloonTip(100, "AP Intercom", "License missmatch for " + serialNumber + "!\r\n+380 67 565 50 84", ToolTipIcon.Error);
            return false;
        }

        private void VitaminControl_OnDIDOAlert(object sender, AxVITAMINDECODERLib._IVitaminCtrlEvents_OnDIDOAlertEvent e)
        {
            double di = Math.Log(e.lChangeFlag, 2);
            if (di % 1 == 0)
            {
                if (e.lValue == Math.Pow(2, di) && di == 0)
                {
                    if (!this.Visible)
                    {
                        this.Show();
                        this.Activate();
                        Mute(false);
                        this.WindowState = FormWindowState.Normal;
                    }
                    //if (!baloonActive & !this.Visible)
                    //{
                    //    incommingCall = true;
                    //    applicationTray.ShowBalloonTip(5000, "AP Intercom", "Incomming call!", ToolTipIcon.Info);
                    //    player.Play();
                    //}
                }
            }
        }

        private void Mute(bool mute)
        {
            if (connected)
            {
                vitaminControl.PlayMute = mute;
                vitaminControl.PlayVolume = 100;
            }
        }

        private void RecordChat(bool record)
        {
            if (connected)
            {
                try
                {
                    int result;
                    if (record)
                    {
                        result = vitaminControl.StartMP4Conversion();
                        vitaminControl.MicVolume = 100;
                        vitaminControl.StartMicTalk();
                    }
                    else
                    {
                        vitaminControl.StopMicTalk();
                        result = vitaminControl.StopMP4Conversion();
                    }
                    if (result != 0)
                    {
                        chatButton.Checked = false;
                        applicationTray.ShowBalloonTip(1000, "AP Intercom", "Vivotek Error Code: " + result, ToolTipIcon.Error);
                    }
                }
                catch
                {
                }
            }

        }

        private void VitaminControl_OnConnectionOK(object sender, AxVITAMINDECODERLib._IVitaminCtrlEvents_OnConnectionOKEvent e)
        {
            connected = true;
            if (!licensed)
            {
                licensed = VerifyLicense();
            }
            this.FormBorderStyle = FormBorderStyle.Sizable;
            this.Hide();
            this.WindowState = FormWindowState.Minimized;
            if (licensed)
            {
                if (!baloonActive)
                {
                    applicationTray.ShowBalloonTip(0, "AP Intercom", "Connected to " + vitaminControl.RemoteIPAddr, ToolTipIcon.Info);
                }
                return;
            }
            //licenseError = true;
            //applicationTray.ShowBalloonTip(100, "AP Intercom", "License missmatch!\r\n+380 67 565 50 84", ToolTipIcon.Error);
            liveToolStripMenuItem.Enabled = licensed;
            vitaminControl.Disconnect();
            //MessageBox.Show(vitaminControl.RefreshServerConfig().ToString());
        }

        private void VitaminControl_OnConnectionBroken(object sender, AxVITAMINDECODERLib._IVitaminCtrlEvents_OnConnectionBrokenEvent e)
        {
            connected = false;
            if (licensed)
            {
                applicationTray.ShowBalloonTip(100, "AP Intercom", "Connection closed!", ToolTipIcon.Warning);
                reConnectTimer.Start();
            }
            licensed = false;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
        }
        #endregion

        #region Form
        private void Intercom_VisibleChanged(object sender, EventArgs e)
        {
            incommingCall = false;
            baloonActive = false;
            Mute(!this.Visible);
            if (!this.Visible)
            {
                RecordChat(false);

            }
            else
            {
                if (!connected && licensed)
                {
                    vitaminControl.Connect();
                }
            }
        }

        private void Intercom_ClientSizeChanged(object sender, EventArgs e)
        {
            //player.Stop();
            if (this.WindowState == FormWindowState.Minimized)
            {
                RecordChat(false);
                this.Hide();
            }
            ResizeControl();
            base.OnClientSizeChanged(e);
        }

        private void ResizeControl()
        {
            this.controlPanel.Width = 70;
            chatButton.Top = 10;
            chatButton.Width = 50;
            chatButton.Height = chatButton.Width;
            chatButton.Left = (controlPanel.Width - chatButton.Width) / 2;
            chatButton.BackgroundImage = chatImage;
            chatButton.BackgroundImageLayout = ImageLayout.Stretch;


            openButton.Width = 50;
            openButton.Height = openButton.Width;
            openButton.Left = (controlPanel.Width - openButton.Width) / 2;
            openButton.Top = chatButton.Top + chatButton.Height + 10;
            openButton.BackgroundImage = openImage;
            openButton.BackgroundImageLayout = ImageLayout.Stretch;

            closeButton.Width = 50;
            closeButton.Height = closeButton.Width;
            closeButton.Left = (controlPanel.Width - closeButton.Width) / 2;
            closeButton.Top = openButton.Top + openButton.Height + 10;
            closeButton.BackgroundImage = closeImage;
            closeButton.BackgroundImageLayout = ImageLayout.Stretch;

            fullScreenButton.Width = 50;
            fullScreenButton.Height = fullScreenButton.Width;
            fullScreenButton.Left = (controlPanel.Width - fullScreenButton.Width) / 2;
            fullScreenButton.Top = closeButton.Top + closeButton.Height + 10;
            fullScreenButton.BackgroundImage = fullScreenImage;
            fullScreenButton.BackgroundImageLayout = ImageLayout.Stretch;

        }

        private void Intercom_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (!connected || exitFlag)
            {
                e.Cancel = false;
                //RecordChat(false);
                if (connected)
                {
                    vitaminControl.Disconnect();
                }
                disableDOTimer.Stop();
                disableDOTimer.Dispose();
                vitaminControl.Dispose();
                Application.Exit();
            }
            else
            {
                this.WindowState = FormWindowState.Minimized;
                this.Hide();
                e.Cancel = true;
            }

        }
        #endregion

        #region Buttons
        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            exitFlag = true;
            Application.Exit();
        }

        private void liveToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (this.WindowState == FormWindowState.Minimized)
            {
                this.Show();
                this.Activate();
                this.WindowState = FormWindowState.Normal;
                if (!connected && licensed)
                {
                    vitaminControl.Connect();
                }
            }
            else
            {
                Mute(true);
                this.Hide();
                this.WindowState = FormWindowState.Minimized;
            }
        }

        private void chatButton_CheckedChanged(object sender, EventArgs e)
        {
            chatButton.BackgroundImage = chatButton.Checked ? chat2Image : chatImage;

            //chatButton.Image = null;
            //chatImage = chatButton.Checked ? new Bitmap(AP.Intercom.Properties.Resources.chatPng) : new Bitmap(AP.Intercom.Properties.Resources.chat2Png);
            RecordChat(((CheckBox)sender).Checked);
            //chatButton.BackgroundImage = chatImage;

        }

        private void openButton_CheckedChanged(object sender, EventArgs e)
        {
            vitaminControl.SendDigitalOut(1, 1);
            disableDOTimer.Interval = 500;
            disableDOTimer.Start();
            openButton.Checked = false;
        }

        private void closeButton_CheckedChanged(object sender, EventArgs e)
        {
            vitaminControl.SendDigitalOut(1, 1);
            disableDOTimer.Interval = 1000;
            disableDOTimer.Start();
            closeButton.Checked = false;
        }

        private void fullScreenButton_CheckedChanged(object sender, EventArgs e)
        {
            int result = vitaminControl.SetFullScreen(true);
            fullScreenButton.Checked = false;
            if (result != 0)
            {
                applicationTray.ShowBalloonTip(1000, "AP Intercom", "Vivotek Error Code: " + result, ToolTipIcon.Error);
            }
        }

        private void SaveConfig_Click(object sender, EventArgs e)
        {
            int port = 0;
            if (String.IsNullOrEmpty(cameraIP.Text) || String.IsNullOrWhiteSpace(cameraIP.Text))
            {
                applicationTray.ShowBalloonTip(1000, "AP Intercom", "Wrong camera address!", ToolTipIcon.Error);
                return;
            }
            else
            {
                AP.Intercom.Properties.Settings.Default.CameraIP = cameraIP.Text;
            }
            if (!Int32.TryParse(cameraPort.Text, out port))
            {
                applicationTray.ShowBalloonTip(1000, "AP Intercom", "Wrong port number!", ToolTipIcon.Error);
                return;
            }
            if (port < 0 || port > 65534)
            {
                applicationTray.ShowBalloonTip(1000, "AP Intercom", "Wrong port number!", ToolTipIcon.Error);
                return;
            }
            else
            {
                AP.Intercom.Properties.Settings.Default.HttpPort = port;
            }
            if (String.IsNullOrEmpty(cameraPassword.Text) || String.IsNullOrWhiteSpace(cameraPassword.Text))
            {
                DialogResult comfirmEmptyPassword = MessageBox.Show("Use empty password?", "Warning", MessageBoxButtons.OKCancel);
                if (comfirmEmptyPassword != DialogResult.OK)
                {
                    return;
                }
                else
                {
                    AP.Intercom.Properties.Settings.Default.Password = "";
                }
            }
            else
            {
                byte[] passwordBytes = Encoding.ASCII.GetBytes(cameraPassword.Text);
                byte[] protectedBytes = ProtectedData.Protect(passwordBytes, null, DataProtectionScope.LocalMachine);
                AP.Intercom.Properties.Settings.Default.Password = Convert.ToBase64String(protectedBytes);
            }
            AP.Intercom.Properties.Settings.Default.UserName = cameraUserName.Text;
            if (String.IsNullOrEmpty(workPath.Text) || String.IsNullOrWhiteSpace(workPath.Text))
            {
                AP.Intercom.Properties.Settings.Default.RecordPath = Environment.SpecialFolder.MyVideos.ToString();
            }
            else
            {
                AP.Intercom.Properties.Settings.Default.RecordPath = workPath.Text;
            }
            AP.Intercom.Properties.Settings.Default.Save();
            applicationTray.ShowBalloonTip(1000, "AP Intercom", "Config saved!", ToolTipIcon.Info);
            vitaminControl.Disconnect();
            AP.Intercom.Properties.Settings.Default.Reload();
            LoadConfig();
            vitaminControl.Connect();

        }

        private void licenseMenuItem_Click(object sender, EventArgs e)
        {
            licenseFileChose.ShowDialog();
        }
        #endregion

    }

}
