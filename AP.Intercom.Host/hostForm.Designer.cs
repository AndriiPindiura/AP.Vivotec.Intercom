namespace AP.Intercom.Host
{
    partial class hostForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(hostForm));
            this.applicationMenu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.liveToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.configStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.cameraIP = new System.Windows.Forms.ToolStripTextBox();
            this.cameraPort = new System.Windows.Forms.ToolStripTextBox();
            this.cameraUserName = new System.Windows.Forms.ToolStripTextBox();
            this.cameraPassword = new System.Windows.Forms.ToolStripTextBox();
            this.workPath = new System.Windows.Forms.ToolStripTextBox();
            this.SaveConfig = new System.Windows.Forms.ToolStripMenuItem();
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.applicationTray = new System.Windows.Forms.NotifyIcon(this.components);
            this.hostBrowser = new System.Windows.Forms.WebBrowser();
            this.controlPanel = new System.Windows.Forms.Panel();
            this.fullScreenButton = new System.Windows.Forms.CheckBox();
            this.closeButton = new System.Windows.Forms.CheckBox();
            this.openButton = new System.Windows.Forms.CheckBox();
            this.chatButton = new System.Windows.Forms.CheckBox();
            this.applicationMenu.SuspendLayout();
            this.controlPanel.SuspendLayout();
            this.SuspendLayout();
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
            // liveToolStripMenuItem
            // 
            this.liveToolStripMenuItem.Name = "liveToolStripMenuItem";
            this.liveToolStripMenuItem.Size = new System.Drawing.Size(110, 22);
            this.liveToolStripMenuItem.Text = "Live";
            // 
            // configStripMenuItem
            // 
            this.configStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.cameraIP,
            this.cameraPort,
            this.cameraUserName,
            this.cameraPassword,
            this.workPath,
            this.SaveConfig});
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
            // SaveConfig
            // 
            this.SaveConfig.Name = "SaveConfig";
            this.SaveConfig.Size = new System.Drawing.Size(160, 22);
            this.SaveConfig.Text = "Apply";
            this.SaveConfig.Click += new System.EventHandler(this.SaveConfig_Click);
            // 
            // exitToolStripMenuItem
            // 
            this.exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            this.exitToolStripMenuItem.Size = new System.Drawing.Size(110, 22);
            this.exitToolStripMenuItem.Text = "Exit";
            // 
            // applicationTray
            // 
            this.applicationTray.BalloonTipIcon = System.Windows.Forms.ToolTipIcon.Warning;
            this.applicationTray.ContextMenuStrip = this.applicationMenu;
            this.applicationTray.Icon = ((System.Drawing.Icon)(resources.GetObject("applicationTray.Icon")));
            this.applicationTray.Text = "AP Intercom";
            this.applicationTray.Visible = true;
            // 
            // hostBrowser
            // 
            this.hostBrowser.AllowNavigation = false;
            this.hostBrowser.AllowWebBrowserDrop = false;
            this.hostBrowser.Dock = System.Windows.Forms.DockStyle.Fill;
            this.hostBrowser.Location = new System.Drawing.Point(0, 0);
            this.hostBrowser.MinimumSize = new System.Drawing.Size(20, 20);
            this.hostBrowser.Name = "hostBrowser";
            this.hostBrowser.ScriptErrorsSuppressed = true;
            this.hostBrowser.ScrollBarsEnabled = false;
            this.hostBrowser.Size = new System.Drawing.Size(656, 561);
            this.hostBrowser.TabIndex = 1;
            this.hostBrowser.WebBrowserShortcutsEnabled = false;
            // 
            // controlPanel
            // 
            this.controlPanel.BackColor = System.Drawing.Color.White;
            this.controlPanel.Controls.Add(this.fullScreenButton);
            this.controlPanel.Controls.Add(this.closeButton);
            this.controlPanel.Controls.Add(this.openButton);
            this.controlPanel.Controls.Add(this.chatButton);
            this.controlPanel.Dock = System.Windows.Forms.DockStyle.Right;
            this.controlPanel.Location = new System.Drawing.Point(656, 0);
            this.controlPanel.Name = "controlPanel";
            this.controlPanel.Size = new System.Drawing.Size(128, 561);
            this.controlPanel.TabIndex = 2;
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
            // hostForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(784, 561);
            this.Controls.Add(this.hostBrowser);
            this.Controls.Add(this.controlPanel);
            this.Name = "hostForm";
            this.ShowInTaskbar = false;
            this.Text = "AP Intercom";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.hostForm_FormClosing);
            this.Load += new System.EventHandler(this.hostForm_Load);
            this.Shown += new System.EventHandler(this.hostForm_Shown);
            this.ClientSizeChanged += new System.EventHandler(this.hostForm_ClientSizeChanged);
            this.applicationMenu.ResumeLayout(false);
            this.controlPanel.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.ContextMenuStrip applicationMenu;
        private System.Windows.Forms.ToolStripMenuItem liveToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem configStripMenuItem;
        private System.Windows.Forms.ToolStripTextBox cameraIP;
        private System.Windows.Forms.ToolStripTextBox cameraPort;
        private System.Windows.Forms.ToolStripTextBox cameraUserName;
        private System.Windows.Forms.ToolStripTextBox cameraPassword;
        private System.Windows.Forms.ToolStripTextBox workPath;
        private System.Windows.Forms.ToolStripMenuItem SaveConfig;
        private System.Windows.Forms.ToolStripMenuItem exitToolStripMenuItem;
        private System.Windows.Forms.NotifyIcon applicationTray;
        private System.Windows.Forms.WebBrowser hostBrowser;
        private System.Windows.Forms.Panel controlPanel;
        private System.Windows.Forms.CheckBox fullScreenButton;
        private System.Windows.Forms.CheckBox closeButton;
        private System.Windows.Forms.CheckBox openButton;
        private System.Windows.Forms.CheckBox chatButton;
    }
}

