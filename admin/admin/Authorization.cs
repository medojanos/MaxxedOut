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

namespace admin
{
    public partial class Authorization : Form
    {
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

                ApiClient.Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Authorization", token);

                HttpResponseMessage response = await ApiClient.Client.GetAsync("/auth/admin");

                if(response.IsSuccessStatusCode)
                {
                    
                }
                else
                {
                    MessageBox.Show("Bad token!");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba: " + ex.Message);
            }
        }
    }
}
