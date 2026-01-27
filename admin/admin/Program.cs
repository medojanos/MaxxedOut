using DotNetEnv;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows.Forms;
using static admin.ApiClient;

namespace admin
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            Env.TraversePath().Load();

            string apiUrl = Environment.GetEnvironmentVariable("API_URL");

            if (string.IsNullOrWhiteSpace(apiUrl))
            {
                MessageBox.Show("Failed to get API Url");
                return;
            }

            ApiClient.Initialize(apiUrl);

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Authorization());
        }
    }
}
