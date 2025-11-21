using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;

namespace admin
{
    public static class MuscleGroupsList
    {
        public static BindingList<MuscleGroupsDB> MuscleGroups { get; set; } = new BindingList<MuscleGroupsDB>();
    }
}
