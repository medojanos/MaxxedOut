using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace admin
{
    public static class AppData
    {
        private static string dbPath;
        public static Database db;

        static AppData()
        {
            string solutionRoot = Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.Parent.Parent.Parent.FullName;
            string dbPath = Path.Combine(solutionRoot, "api", "db", "maxxedout.db");

            db = new Database($@"Data Source={dbPath}");

            var musclegroups = db.Query("SELECT * FROM muscle_groups;");

            foreach (DataRow mg in musclegroups.Rows)
            {
                MuscleGroupsDB MGObj = new MuscleGroupsDB(int.Parse(mg["id"].ToString()), mg["name"].ToString());
                MuscleGroupsList.MuscleGroups.Add(MGObj);
            }
        }
    }
}
