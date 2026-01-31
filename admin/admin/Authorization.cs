using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net.Http.Headers;
using static admin.ApiClient;
using System.Net.Http;
using System.Net.Http.Json;

namespace admin
{
    public partial class Authorization : Form
    {
        public event Action LoginSucceeded;

        public Authorization()
        {
            InitializeComponent();
        }

        private async void validateButton_Click(object sender, EventArgs e)
        {
            try
            {
                string token = AdminToken.Text.Trim();

                if (string.IsNullOrWhiteSpace(token))
                {
                    MessageBox.Show("Token is needed!");
                    return;
                }

                ApiClient.Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(token);

                var httpResponse = await ApiClient.Client.GetAsync("auth/admin");

                if (httpResponse.IsSuccessStatusCode)
                {
                    LoginSucceeded.Invoke();
                    this.Close();
                }
                else
                {
                    ApiResult content = await httpResponse.Content.ReadFromJsonAsync<ApiResult>();
                    MessageBox.Show($"Bad token! \nStatus: {httpResponse.StatusCode.GetHashCode()} {httpResponse.StatusCode} \nSuccess: {content.success} \nMessage: {content.message}");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Unexpected error: " + ex.Message);
            }
        }
    }
}
