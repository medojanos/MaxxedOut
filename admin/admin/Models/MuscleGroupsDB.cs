using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace admin.Models
{
    public class MuscleGroupsDB
    {
        public int id { get; set; }
        public string name { get; set; }

        public MuscleGroupsDB() { }

        public MuscleGroupsDB(int id, string name)
        {
            this.id = id;
            this.name = name;
        }

        public override string ToString()
        {
            return name;
        }
    }
}
