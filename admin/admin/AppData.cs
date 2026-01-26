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
        static AppData()
        {
            
            var musclegroups = "dataofmusclegroups";

            foreach ()
            {
                MuscleGroupsDB  = new MuscleGroupsDB();
                MuscleGroupsList.MuscleGroups.Add(MGObj);
            }
        }
    }
}
