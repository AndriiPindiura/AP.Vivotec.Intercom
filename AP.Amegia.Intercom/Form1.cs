using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace AP.Amegia.Intercom
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            string curDir = Directory.GetCurrentDirectory();
            //InternetExplorer ie = new 
            try
            {
                //this.webBrowser1.Url = new Uri(String.Format("file:///{0}/amegia.html", curDir));

                //this.webBrowser1.Url = new Uri("http://192.168.10.122/");
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            string curDir = Directory.GetCurrentDirectory();

            //this.webBrowser1.Url = new Uri("http://192.168.10.122/");
            try
            {
                webBrowser1.Url = new Uri(String.Format("file:///{0}/amegia.html", curDir));
                //webBrowser1.Url = new Uri("http://192.168.10.122/");
            }
            catch (COMException ex)
            {
                MessageBox.Show(ex.Message);
            }

        }



        //[DllImport("user32.dll", SetLastError = true)]
        //private static extern uint SetParent(IntPtr hWndChild, IntPtr hWndNewParent);
        //[DllImport("user32.dll", SetLastError = true)]
        //private static extern uint SendMessage(IntPtr hWnd, int msg, int wParam, int lParam);

        //private void button1_Click(object sender, EventArgs e)
        //{
        //    System.Diagnostics.Process p = System.Diagnostics.Process.Start(@"C:\\Program Files\\Internet Explorer\\iexplore.exe", "-embedding");
        //    //System.Diagnostics.Process p = System.Diagnostics.Process.Start(@"C:\\Program Files\\Windows Media Player\\wmplayer.exe");
        //    //System.Diagnostics.Process p = System.Diagnostics.Process.Start("notepad.exe");
        //    p.WaitForInputIdle();
        //    SetParent(p.MainWindowHandle, this.Handle);
        //    SendMessage(p.MainWindowHandle, 274, 61488, 0);
        //}




    }
}
