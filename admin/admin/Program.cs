using DotNetEnv;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Windows.Forms;
using static admin.ApiClient;

namespace admin
{
    internal class Program
    {
        [STAThread]
        static async Task Main()
        {
            Env.TraversePath().Load();

            string apiUrl = Environment.GetEnvironmentVariable("API_URL");

            if (string.IsNullOrWhiteSpace(apiUrl))
            {
                MessageBox.Show("Failed to get API Url!");
                return;
            }

            ApiClient.Initialize($"{apiUrl}/");


            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);  

            if (await IsApiKeyValid())
            {
                Application.Run(new Home());
            }
        }


        private static async Task<Boolean> IsApiKeyValid()
        {
            string apiKey = Environment.GetEnvironmentVariable("API_KEY");

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                MessageBox.Show("Key is needed!");
                return false;
            }

            if (ApiClient.Client.DefaultRequestHeaders.Authorization != null) ApiClient.Client.DefaultRequestHeaders.Authorization = null;

            ApiClient.Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(apiKey);

            var Response = await ApiClient.Client.GetAsync("auth/admin"); 

            if (Response.IsSuccessStatusCode)
            {
                return true;
            }
            else
            { 
                ApiResult content = await Response.Content.ReadFromJsonAsync<ApiResult>();
                MessageBox.Show($"Bad token! \nStatus: {Response.StatusCode.GetHashCode()} {Response.StatusCode} \nSuccess: {content.success} \nMessage: {content.message}");
                return false;
            }
        }
    }
}
