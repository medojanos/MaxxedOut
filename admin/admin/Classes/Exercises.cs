using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace admin.Classes
{
    internal class Exercises
    {
        internal int ID { get; set; }
        internal string Name { get; set; }
        internal Exercises(int id, string name) 
        {
            ID = id;
            Name = name;
        }
    }
}
