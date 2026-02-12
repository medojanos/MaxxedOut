using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace admin.Models
{

    public class ExercisesDB
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public List<MusclesworkedDB> Musclesworked { get; set; }

        public ExercisesDB() { }
        public ExercisesDB(int id, string name, string type, List<MusclesworkedDB> musclesworked)
        {
            Id = id;
            Name = name;
            Type = type;
            Musclesworked = musclesworked;
        }

        public override string ToString()
        {
            return Name;
        }
    }

    public class MusclesworkedDB
    {
        public MuscleGroupsDB Musclegroup { get; set; }
        public string Role { get; set; }

        public MusclesworkedDB() { }
        public MusclesworkedDB(MuscleGroupsDB musclegroup, string role)
        {
            Musclegroup = musclegroup;
            Role = role;
        }

        public override string ToString()
        {
            return Musclegroup.Name;
        }
    }
}
