using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace admin
{
    public static class ApiClient
    {
        public static HttpClient Client { get; private set; }
        private static bool _initialized = false;
        private static JsonSerializerOptions options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        public static void Initialize(string apiUrl)
        {
            if (_initialized) return;

            Client = new HttpClient 
            { 
                BaseAddress = new Uri(apiUrl) 
            };

            Client.DefaultRequestHeaders.Clear();
            Client.DefaultRequestHeaders.Add("Accept", "application/json");

            _initialized = true;
        }

        // Get

        public static async Task<T> Get<T> (string url)
        {
            return SafeExecute(async () =>
            {
                var response = await Client.GetAsync(url);
                return await HandleResponse<T>(response);
            });
        }

        // Post

        public static Task<TResponse> Post<TRequest, TResponse>(string url, TRequest data)
        {
            return SafeExecute(async () =>
            {
                var response = await Client.PostAsJsonAsync(url, data, options);
                return await HandleResponse<TResponse>(response);
            });
        }

        // Put

        public static Task<TResponse> Put<TRequest, TResponse>(string url, TRequest data)
        {
            return SafeExecute(async () =>
            {
                var response = await Client.PutAsJsonAsync(url, data, options);
                return await HandleResponse<TResponse>(response);
            });
        }

        // Delete

        public static Task<T> Delete<T>(string url)
        {
            return SafeExecute(async () =>
            {
                var response = await Client.DeleteAsync(url);
                return await HandleResponse<T>(response);
            });
        }

        // Utiliy 

        private static async Task<T> SafeExecute<T>(Func<Task<T>> action)
        {
            try
            {
                return await action();
            }
            catch (HttpRequestException ex)
            {
                MessageBox.Show($"Request error: {ex.Message}");
            }
            catch (JsonException ex)
            {
                MessageBox.Show($"JSON error: {ex.Message}");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Unexpected error: {ex.Message}");
            }

            return default;
        }

        private static async Task<T> HandleResponse<T> (HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                MessageBox.Show($"API error: {response.StatusCode} - {errorContent}");
                return default;
            }

            if (response.Content == null || response.Content.Headers.ContentLength == 0) return default;

            return await response.Content.ReadFromJsonAsync<T>(options);
        }
    }
}
