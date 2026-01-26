using DotNetEnv;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace admin
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            Env.Load();

            string apiUrl = Environment.GetEnvironmentVariable("API_URL");

            HttpClient client = new HttpClient();

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new admin.Utils.FormManager());
        }
    }
}
