using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace admin
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            SQLitePCL.Batteries_V2.Init();
            var _ = AppData.db;

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new admin.Utils.FormManager());
        }
    }
}
