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
        public JsonElement data { get; set; }

        public ApiResult() { }
    }
}
