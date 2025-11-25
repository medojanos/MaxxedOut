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
            db = new Database($@"Data Source=D:\Projektek\MaxxedOut\MaxxedOut\api\db\maxxedout.db");

            var musclegroups = db.Query("SELECT * FROM muscle_groups;");

            foreach (DataRow mg in musclegroups.Rows)
            {
                MuscleGroupsDB MGObj = new MuscleGroupsDB(int.Parse(mg["id"].ToString()), mg["name"].ToString());
                MuscleGroupsList.MuscleGroups.Add(MGObj);
            }
        }
    }
}
