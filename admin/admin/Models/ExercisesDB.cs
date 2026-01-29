using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace admin.Models
{

    public class ExercisesDB
    {
        public int id { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public List<MusclesworkedDB> musclesworked { get; set; }

        public ExercisesDB() { }
        public ExercisesDB(int id, string name, string type, List<MusclesworkedDB> musclesworked)
        {
            this.id = id;
            this.name = name;
            this.type = type;
            this.musclesworked = musclesworked;
        }

        public override string ToString()
        {
            return name;
        }
    }

    public class MusclesworkedDB
    {
        public MuscleGroupsDB musclegroup { get; set; }
        public string role { get; set; }

        public MusclesworkedDB() { }
        public MusclesworkedDB(MuscleGroupsDB musclegroup, string role)
        {
            this.musclegroup = musclegroup;
            this.role = role;
        }

        public override string ToString()
        {
            return musclegroup.name;
        }
    }
}
