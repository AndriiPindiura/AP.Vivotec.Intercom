using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Windows.Forms;

namespace AP.Interсom
{
    static class Program
    {
        internal static string APfolder;
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            var versionInfo = FileVersionInfo.GetVersionInfo(Assembly.GetEntryAssembly().Location);
            APfolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), versionInfo.CompanyName, versionInfo.ProductName);
            if (!Directory.Exists(APfolder))
            {
                Directory.CreateDirectory(APfolder);
            }
            
            AP.Intercom.Properties.Settings.Default.Upgrade();
            Application.ApplicationExit += Application_ApplicationExit;
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Intercom());
        }

        private static void Application_ApplicationExit(object sender, EventArgs e)
        {
            AP.Intercom.Properties.Settings.Default.Save();
        }
    }
}
