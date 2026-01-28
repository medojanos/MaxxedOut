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

namespace admin
{
    public static class ApiClient
    {
        public static HttpClient Client { get; private set; }
        private static bool _initialized = false;

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

        public static async Task<T> Get<T>(string url)
        {
            var response = await Client.GetAsync(url);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<T>();
        }
        public static async Task<T> SafeGet<T>(string url)
        {
            try
            {
                return await Get<T>(url);
            }
            catch (HttpRequestException ex)
            {
                MessageBox.Show($"Error with request: {ex.ToString()}");
                return default;
            }
            catch (JsonException ex)
            {
                MessageBox.Show($"Data error: {ex.ToString()}");
                return default;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.ToString()}");
                return default;
            }
        }

        public static async Task<TResponse> Post<TRequest, TResponse>(string url, TRequest data)
        {
            var response = await Client.PostAsJsonAsync(url, data);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<TResponse>();
        }
        public static async Task<TResponse> SafePost<TRequest, TResponse>(string url, TRequest data)
        {
            try
            {
                return await Post<TRequest, TResponse>(url, data);
            }
            catch (HttpRequestException ex)
            {
                MessageBox.Show($"Error with request: {ex.ToString()}");
                return default;
            }
            catch (JsonException ex)
            {
                MessageBox.Show($"Data error: {ex.ToString()}");
                return default;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.ToString()}");
                return default;
            }
        }

        public static async Task<TResponse> Put<TRequest, TResponse>(string url, TRequest data)
        {
            var response = await Client.PutAsJsonAsync(url, data);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<TResponse>();
        }

        public static async Task<TResponse> SafePut<TRequest, TResponse>(string url, TRequest data)
        {
            try
            {
                return await Put<TRequest, TResponse>(url, data);
            }
            catch (HttpRequestException ex)
            {
                MessageBox.Show($"Error with request: {ex.ToString()}");
                return default;
            }
            catch (JsonException ex)
            {
                MessageBox.Show($"Data error: {ex.ToString()}");
                return default;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.ToString()}");
                return default;
            }
        }

        public static async Task<TResponse> Delete<TRequest, TResponse>(string url, TRequest data)
        {
            var request = new HttpRequestMessage(HttpMethod.Delete, url) 
            { 
                Content = JsonContent.Create(data) 
            };

            var response = await Client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<TResponse>();
        }
        public static async Task<TResponse> SafeDelete<TRequest, TResponse>(string url, TRequest data)
        {
            try
            {
                return await Delete<TRequest, TResponse>(url, data);
            }
            catch (HttpRequestException ex)
            {
                MessageBox.Show($"Error with request: {ex.ToString()}");
                return default;
            }
            catch (JsonException ex)
            {
                MessageBox.Show($"Data error: {ex.ToString()}");
                return default;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.ToString()}");
                return default;
            }
        }
    }
}
