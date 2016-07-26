using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;


namespace AP.Intercom.License
{
    class Program
    {
        private static byte[] salt = Convert.FromBase64String("BsHtlzB/xVcmoa9OlN8e0zteScckQYYi0gaS1RpD99k=");

        static void Main(string[] args)
        {
            SHA1CryptoServiceProvider sha1 = new SHA1CryptoServiceProvider();
            if (args.Length > 0)
            {
                byte[] sn = Encoding.ASCII.GetBytes(args[0]);
                byte[] saltedPassword = new byte[salt.Length + sn.Length];
                sn.CopyTo(saltedPassword, 0);
                salt.CopyTo(saltedPassword, sn.Length);
                byte[] hash = sha1.ComputeHash(saltedPassword);
                File.WriteAllBytes(args[0] + ".key", hash);
                //Console.WriteLine(Convert.ToBase64String(hash));
                License license = new License();
                license.LicenseList.Add(Convert.ToBase64String(hash));
                JavaScriptSerializer json = new JavaScriptSerializer();
                Console.WriteLine(json.Serialize(license));
            }
            else
            {
                Console.WriteLine("Usage: AP.Intercom.License.exe SERIAL");
            }
            Console.ReadKey();

        }

    }
    class License
    {
        public License()
        {
            this.LicenseList = new List<string>();
        }
        public List<string> LicenseList { get; set; }
    }
}
