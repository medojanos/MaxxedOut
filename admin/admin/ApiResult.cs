using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace admin
{
    public class ApiResult
    {
        public bool success { get; set; }
        public string message { get; set; }
        public JsonElement data { get; set; }

        public ApiResult() { }

        public static bool ensureSuccess(ApiResult result)
        {
            if (result == null)
            {
                MessageBox.Show("No response from server.");
                return false;
            }

            if (!result.success)
            {
                MessageBox.Show(result.message ?? "API call failed.");
                return false;
            }

            if(result.success) return true;
            else
            {
                MessageBox.Show(result.message);
                return false;
            }
        }
    }
}
