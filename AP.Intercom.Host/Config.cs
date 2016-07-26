using System.Collections.Generic;

namespace AP.Intercom.Host
{
    public class Config
    {
        public Config()
        {
            this.LicenseList = new List<string>();
        }
        public string CameraIP { get; set; }
        public int HttpPort { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string RecordPath { get; set; }
        public int OpenDelay { get; set; }
        public int CloseDelay { get; set; }
        public List<string> LicenseList { get; set; }
    }
}
