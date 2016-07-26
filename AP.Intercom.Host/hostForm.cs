using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.Windows.Forms;

namespace AP.Intercom.Host
{
    [ComVisibleAttribute(true)]
    public partial class hostForm : Form
    {
        private byte[] salt = Convert.FromBase64String("BsHtlzB/xVcmoa9OlN8e0zteScckQYYi0gaS1RpD99k=");
        private Config config;
        private bool baloonActive;
        private bool incommingCall;
        private bool licensed;
        private string serialNumber;
        private Image chatImage;
        private Image openImage;
        private Image closeImage;
        private Image fullScreenImage;
        private string clearPassword;
        private int di0;
        private bool IncommingCall
        {
            get { return incommingCall; }
            set
            {
                if (incommingCall != value)
                {
                    if (value && !baloonActive && !this.Visible)
                    {
                        applicationTray.ShowBalloonTip(0, "AP Intercom", "Incomming Call!", ToolTipIcon.Info);
                    }
                    incommingCall = value;

                }
            }
        }
        private System.Timers.Timer diTimer;
        private System.Timers.Timer doTimer;

        public hostForm()
        {
            InitializeComponent();
            config = new Config();
            diTimer = new System.Timers.Timer(10);
            diTimer.Elapsed += DiTimer_Elapsed;
            diTimer.AutoReset = true;
            doTimer = new System.Timers.Timer();
            doTimer.Elapsed += DoTimer_Elapsed;
            doTimer.AutoReset = false;
            JavaScriptSerializer json = new JavaScriptSerializer();
            config = json.Deserialize<Config>(File.ReadAllText("ap.intercom.json"));
            try
            {
                clearPassword = Encoding.ASCII.GetString(ProtectedData.Unprotect(Convert.FromBase64String(config.Password), null, DataProtectionScope.CurrentUser));
            }
            catch
            {
                applicationTray.ShowBalloonTip(1000, "AP Intercom", "Wrong password hash!", ToolTipIcon.Error);
            }
            cameraIP.Text = config.CameraIP;
            cameraPort.Text = config.HttpPort.ToString();
            cameraUserName.Text = config.UserName;
            workPath.Text = config.RecordPath;
            applicationTray.BalloonTipClicked += ApplicationTray_BalloonTipClicked;
            applicationTray.BalloonTipShown += ApplicationTray_BalloonTipShown;
            applicationTray.BalloonTipClosed += ApplicationTray_BalloonTipClosed;
            applicationTray.MouseClick += ApplicationTray_MouseClick;
            hostBrowser.ScriptErrorsSuppressed = true;
            // WORK
            string curDir = Directory.GetCurrentDirectory();
            this.hostBrowser.Url = new Uri(String.Format("file:///{0}/vivotek.html", curDir));
            //this.hostBrowser.Url = new Uri(String.Format("file:///{0}/amegia.html", curDir));
            //Stream docStream = Assembly.GetExecutingAssembly().GetManifestResourceStream("Vivotek.html.txt");
            //hostBrowser.DocumentStream = docStream;
            //hostBrowser.DocumentText = Properties.Resources.Vivotek;
            hostBrowser.DocumentCompleted += HostBrowser_DocumentCompleted;
            chatImage = new Bitmap(Properties.Resources.chatPng);
            openImage = new Bitmap(Properties.Resources.openPng);
            closeImage = new Bitmap(Properties.Resources.closePng);
            fullScreenImage = new Bitmap(Properties.Resources.fullscreenPng);

            licensed = VerifyLicense();
            if (licensed)
            {
                applicationTray.ShowBalloonTip(0, "AP Intercom", "Success!", ToolTipIcon.Info);
            }
        }

        #region Timers
        private async void DiTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            using (HttpClient webClient = new HttpClient())
            {
                UriBuilder uri = new UriBuilder();
                uri.Host = config.CameraIP;
                uri.Port = config.HttpPort;
                uri.Path = "cgi-bin/dido/getdi.cgi";
                uri.Query = "di0";
                uri.Scheme = "http";
                var authHeader = Encoding.ASCII.GetBytes(config.UserName +":" + clearPassword);
                webClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(authHeader));
                string diStatus = "";
                try
                {
                    HttpResponseMessage response = await webClient.GetAsync(uri.Uri.OriginalString);
                    HttpContent content = response.Content;
                    diStatus = await content.ReadAsStringAsync();
                    di0 = Int32.Parse(diStatus.Replace("di0=", "").Trim());
                    //applicationTray.ShowBalloonTip(0, "DI Listner", diStatus, ToolTipIcon.Info);
                }
                catch (Exception ex)
                {
                    applicationTray.ShowBalloonTip(0, "DI Listner", ex.Message, ToolTipIcon.Error);
                    //MessageBox.Show(ex.Message + Environment.NewLine + uri.Uri.OriginalString);
                }
                IncommingCall = (di0 == 1);

            }
        }

        private void DoTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            //object[] javascript = { "vivotek.SendDigitalOut(0, 1);" };
            //hostBrowser.Document.InvokeScript("eval", javascript);
            using (WebClient webClient = new WebClient())
            {
                NetworkCredential credential = new NetworkCredential();
                webClient.Credentials = CredentialCache.DefaultCredentials;
                UriBuilder uri = new UriBuilder();
                uri.Host = config.CameraIP;
                uri.Port = config.HttpPort;
                uri.Path = "cgi-bin/dido/setdo.cgi";
                uri.Query = "do0=0";
                uri.Scheme = "http";
                credential.UserName = config.UserName;
                credential.Password = clearPassword;
                webClient.Credentials = credential;
                webClient.OpenReadAsync(uri.Uri);
            }

        }
        #endregion

        #region WebBrowser
        private void HostBrowser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            hostBrowser.Document.ContextMenuShowing += Document_ContextMenuShowing;
            hostBrowser.ObjectForScripting = this;
            hostBrowser.Document.GetElementById("vivotek").SetAttribute("RemoteIPAddr", config.CameraIP);
            hostBrowser.Document.GetElementById("vivotek").SetAttribute("HttpPort", config.HttpPort.ToString());
            hostBrowser.Document.GetElementById("vivotek").SetAttribute("UserName", config.UserName);
            hostBrowser.Document.GetElementById("vivotek").SetAttribute("Password", clearPassword);
            hostBrowser.Document.GetElementById("vivotek").SetAttribute("StretchFullScreen", "0");
            hostBrowser.Document.GetElementById("vivotek").SetAttribute("AutoStartConnection", "true");

            //hostBrowser.Document.GetElementById("vivotek").SetAttribute("StretchFullScreen", "0");
            diTimer.Start();
        }

        private void Document_ContextMenuShowing(object sender, HtmlElementEventArgs e)
        {
#if (!DEBUG)
            {
            //e.ReturnValue = false;
            }
#endif
            //object[] codeString = { "vivotek.StartMP4Conversion(); vivotek.StartMicTalk();" };
            //object[] codeString = { "vivotek.SetFullScreen(true);" };
            //object[] codeString = { "vivotek.SendDigitalOut(1, 1); alert(vivotek.Password);" };
            object[] javascript = { "alert(vivotek.GetSettings(4));" };
            hostBrowser.Document.InvokeScript("eval", javascript);
            e.ReturnValue = false;
            diTimer.Start();
            //hostBrowser.Document.InvokeScript("test");
            //MessageBox.Show(hostBrowser.Document.GetElementById("vivotek").GetAttribute("HttpPort"));
            //hostBrowser.ContextMenu = null;
            //MessageBox.Show("left");
        }

        private void Mute(bool mute)
        {
            //object[] codeString = { String.Format("vivotek.PlayMute = {0}; vivotek.PlayVolume = 100; alert('{0}');", mute.ToString().ToLower()) };
            if (mute)
            {
                object[] javascript = { "vivotek.RtspPause();" };
                hostBrowser.Document.InvokeScript("eval", javascript);

            }
            else
            {
                object[] javascript = { "vivotek.RtspPlay();" };
                hostBrowser.Document.InvokeScript("eval", javascript);
            }
            //MessageBox.Show(codeString[0].ToString());
            //object[] codeString = { "alert('123');"};
            //hostBrowser.Document.InvokeScript("eval", codeString);
        }
        #endregion

        #region Balloon
        private void ApplicationTray_BalloonTipClicked(object sender, EventArgs e)
        {
            //this.Show();
            //this.WindowState = FormWindowState.Maximized;
            //player.Stop();
            if (baloonActive)
            {
                this.Show();
                this.WindowState = FormWindowState.Normal;
            }
            baloonActive = false;
        }

        private void ApplicationTray_BalloonTipClosed(object sender, EventArgs e)
        {
            //MessageBox.Show("Closed");
            //MessageBox.Show(e.GetHashCode().ToString());
            baloonActive = false;
            IncommingCall = false;
        }

        private void ApplicationTray_BalloonTipShown(object sender, EventArgs e)
        {
            if (IncommingCall)
            {
                baloonActive = true;
                //this.Show();
                //this.WindowState = FormWindowState.Normal;
            }
        }

        private void ApplicationTray_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                //MessageBox.Show(this.Visible.ToString());
                if (this.Visible)
                {
                    this.Hide();
                    this.WindowState = FormWindowState.Minimized;
                }
                else
                {
                    //Mute(true);
                    this.Show();
                    this.WindowState = FormWindowState.Normal;

                }

            }
        }
        #endregion

        #region Form
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

        private void hostForm_Load(object sender, EventArgs e)
        {
            ResizeControl();
            //diTimer.Start();
            //this.Hide();
        }

        private void hostForm_ClientSizeChanged(object sender, EventArgs e)
        {
            if (this.WindowState == FormWindowState.Minimized)
            {
                this.Hide();
                //MessageBox.Show("Minimized");
            }
            ResizeControl();
            //MessageBox.Show(this.Visible.ToString());
            Mute(!this.Visible);
        }

        private void hostForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            diTimer.Stop();
            //if (!connected || exitFlag)
            //{
            //    e.Cancel = false;
            //    RecordChat(false);
            //    Application.Exit();
            //}
            //else
            //{
            //    this.WindowState = FormWindowState.Minimized;
            //    this.Hide();
            //    e.Cancel = true;
            //}

        }
        #endregion

        private bool VerifyLicense()
        {
            using (WebClient webClient = new WebClient())
            {
                NetworkCredential credential = new NetworkCredential();
                webClient.Credentials = CredentialCache.DefaultCredentials;
                UriBuilder uri = new UriBuilder();
                uri.Host = config.CameraIP;
                uri.Port = config.HttpPort;
                uri.Path = "cgi-bin/viewer/getparam.cgi";
                uri.Query = "system_info_serialnumber";
                uri.Scheme = "http";
                credential.UserName = config.UserName;
                credential.Password = clearPassword;
                //if (!String.IsNullOrEmpty(config.Password) && !String.IsNullOrWhiteSpace(config.Password))
                //{
                //    try
                //    {
                //        credential.Password = Encoding.ASCII.GetString(ProtectedData.Unprotect(Convert.FromBase64String(config.Password), null, DataProtectionScope.CurrentUser));
                //    }
                //    catch
                //    {
                //        applicationTray.ShowBalloonTip(1000, "AP Intercom", "Wrong password hash!", ToolTipIcon.Error);
                //    }
                //}
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
                    applicationTray.ShowBalloonTip(0, "AP Intercom", ex.Message, ToolTipIcon.Error);
                }
            }
            SHA1CryptoServiceProvider sha1 = new SHA1CryptoServiceProvider();
            if (!string.IsNullOrEmpty(serialNumber))
            {
                byte[] sn = Encoding.ASCII.GetBytes(serialNumber);
                byte[] saltedPassword = new byte[salt.Length + sn.Length];
                sn.CopyTo(saltedPassword, 0);
                salt.CopyTo(saltedPassword, sn.Length);
                byte[] hash = sha1.ComputeHash(saltedPassword);

                foreach (string license in config.LicenseList)
                {
                    try
                    {
                        byte[] licenseByte = Convert.FromBase64String(license);
                        if (hash.SequenceEqual(licenseByte))
                        {
                            return true;
                        }

                    }
                    catch
                    {

                    }
                }
            }
            return false;

        }

        #region Buttons

        private void fullScreenButton_CheckedChanged(object sender, EventArgs e)
        {
            object[] codeString = { "vivotek.SetFullScreen(true);" };
            //object[] codeString = { "vivotek.SetFullScreen(true);" };
            //object[] codeString = { "vivotek.SendDigitalOut(1, 1); alert(vivotek.Password);" };
            hostBrowser.Document.InvokeScript("eval", codeString);

        }

        private void chatButton_CheckedChanged(object sender, EventArgs e)
        {
            if (chatButton.Checked)
            {
                object[] javascript = { "vivotek.StartMP4Conversion(); vivotek.StartMicTalk();" };
                hostBrowser.Document.InvokeScript("eval", javascript);

            }
            else
            {
                object[] javascript = { "vivotek.StopMicTalk(); vivotek.StopMP4Conversion();" };
                hostBrowser.Document.InvokeScript("eval", javascript);

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
                config.CameraIP = cameraIP.Text;
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
                config.HttpPort = port;
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
                    config.Password = "";
                }
            }
            else
            {
                byte[] passwordBytes = Encoding.ASCII.GetBytes(cameraPassword.Text);
                byte[] protectedBytes = ProtectedData.Protect(passwordBytes, null, DataProtectionScope.CurrentUser);
                config.Password = Convert.ToBase64String(protectedBytes);
            }
            if (String.IsNullOrEmpty(cameraUserName.Text) || String.IsNullOrWhiteSpace(cameraUserName.Text))
            {
                config.UserName = "root";
            }
            else
            {
                config.UserName = cameraUserName.Text;
            }
            if (String.IsNullOrEmpty(workPath.Text) || String.IsNullOrWhiteSpace(workPath.Text))
            {
                config.RecordPath = Environment.SpecialFolder.MyVideos.ToString();
            }
            else
            {
                config.RecordPath = workPath.Text;
            }
            JavaScriptSerializer json = new JavaScriptSerializer();
            try
            {
                File.WriteAllText("ap.intercom.json", json.Serialize(config));
                applicationTray.ShowBalloonTip(1000, "AP Intercom", "Config saved!", ToolTipIcon.Info);
            }
            catch (Exception ex)
            {
                applicationTray.ShowBalloonTip(1000, "AP Intercom", ex.Message, ToolTipIcon.Error);
            }
            //licensed = false;
            //authError = false;
            //incommingCall = false;
            cameraPassword.Text = "";

        }

        private void setDOOn()
        {
            using (WebClient webClient = new WebClient())
            {
                NetworkCredential credential = new NetworkCredential();
                webClient.Credentials = CredentialCache.DefaultCredentials;
                UriBuilder uri = new UriBuilder();
                uri.Host = config.CameraIP;
                uri.Port = config.HttpPort;
                uri.Path = "cgi-bin/dido/setdo.cgi";
                uri.Query = "do0=1";
                uri.Scheme = "http";
                credential.UserName = config.UserName;
                credential.Password = clearPassword;
                webClient.Credentials = credential;
                webClient.OpenReadAsync(uri.Uri);
                webClient.OpenReadCompleted += WebClient_OpenReadCompleted;
                //webClient.OpenRead(uri.Uri.OriginalString);
            }

        }

        private void openButton_CheckedChanged(object sender, EventArgs e)
        {
            if (openButton.Checked)
            {
                doTimer.Interval = 500;
                openButton.Checked = false;
                Thread openDO = new Thread(setDOOn);
                openDO.Start();
                //doTimer.Start();
            }
        }

        private void WebClient_OpenReadCompleted(object sender, OpenReadCompletedEventArgs e)
        {
            bool ready = false;
            int count = 0;
            while (!ready)
            {
                Thread.Sleep(10);
                using (WebClient webClient = new WebClient())
                {
                    NetworkCredential credential = new NetworkCredential();
                    webClient.Credentials = CredentialCache.DefaultCredentials;
                    UriBuilder uri = new UriBuilder();
                    uri.Host = config.CameraIP;
                    uri.Port = config.HttpPort;
                    uri.Path = "cgi-bin/dido/getdo.cgi";
                    uri.Query = "do0";
                    uri.Scheme = "http";
                    credential.UserName = config.UserName;
                    credential.Password = clearPassword;
                    webClient.Credentials = credential;
                    string doStatus = "";
                    int do0 = -1;
                    try
                    {
                        Stream data = webClient.OpenRead(uri.Uri.OriginalString);
                        StreamReader reader = new StreamReader(data);
                        doStatus = reader.ReadToEnd();
                        do0 = Int32.Parse(doStatus.Replace("do0=", "").Trim());
                    }
                    catch (Exception ex)
                    {
                        applicationTray.ShowBalloonTip(0, "DO Status", ex.Message, ToolTipIcon.Error);
                        return;
                        //MessageBox.Show(ex.Message + Environment.NewLine + uri.Uri.OriginalString);
                    }
                    ready = (do0 == 1);
                    if (count >= 1000)
                    {
                        return;
                    }
                    count++;
                }
                Thread.Sleep(500);
                using (WebClient webClient = new WebClient())
                {
                    NetworkCredential credential = new NetworkCredential();
                    webClient.Credentials = CredentialCache.DefaultCredentials;
                    UriBuilder uri = new UriBuilder();
                    uri.Host = config.CameraIP;
                    uri.Port = config.HttpPort;
                    uri.Path = "cgi-bin/dido/setdo.cgi";
                    uri.Query = "do0=0";
                    uri.Scheme = "http";
                    credential.UserName = config.UserName;
                    credential.Password = clearPassword;
                    webClient.Credentials = credential;
                    webClient.OpenReadAsync(uri.Uri);
                }

            }
        }

        private void closeButton_CheckedChanged(object sender, EventArgs e)
        {
            if (closeButton.Checked)
            {
                object[] javascript = { "vivotek.SendDigitalOut(0, 0);" };
                hostBrowser.Document.InvokeScript("eval", javascript);


                //doTimer.Interval = 1000;
                //using (WebClient webClient = new WebClient())
                //{
                //    NetworkCredential credential = new NetworkCredential();
                //    webClient.Credentials = CredentialCache.DefaultCredentials;
                //    UriBuilder uri = new UriBuilder();
                //    uri.Host = config.CameraIP;
                //    uri.Port = config.HttpPort;
                //    uri.Path = "cgi-bin/dido/setdo.cgi";
                //    uri.Query = "do0=1";
                //    uri.Scheme = "http";
                //    credential.UserName = config.UserName;
                //    credential.Password = clearPassword;
                //    webClient.Credentials = credential;
                //    webClient.OpenRead(uri.Uri.OriginalString);

                //}
                closeButton.Checked = false;
            }

        }
        #endregion

        private void hostForm_Shown(object sender, EventArgs e)
        {
            //diTimer.Start();

        }
    }

}
