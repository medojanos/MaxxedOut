using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace admin
{
    public static class AppData
    {
        public static Database db = new Database(@"Data source=C:\Users\tekeresdenes\repos\MaxxedOut\api\db\maxxedout.db");

        static AppData()
        {
            var musclegroups = db.Query("SELECT * FROM muscle_groups;");

            foreach (DataRow mg in musclegroups.Rows)
            {
                MuscleGroupsDB MGObj = new MuscleGroupsDB(int.Parse(mg["id"].ToString()), mg["name"].ToString());
                MuscleGroupsList.MuscleGroups.Add(MGObj);
            }

        }
    }
}
