using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace admin
{
    public static class ApiClient
    {
        public static HttpClient Client { get; private set; }

        public static void Initialize(string apiUrl)
        {
            Client = new HttpClient { BaseAddress = new Uri(apiUrl) };

            Client.DefaultRequestHeaders.Clear();
            Client.DefaultRequestHeaders.Add("Accept", "application/json");
        }
    }
}
