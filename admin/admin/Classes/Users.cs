using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace admin.Classes
{
    internal class Users
    {
        internal int ID { get; set; }
        internal string Email { get; set; }
        internal string Password { get; set; }
        internal string Nickname { get; set; }
        public Users(int id, string email, string password, string nickname) 
        {
            ID = id;
            Email = email;
            Password = password;
            Nickname = nickname;
        }
    }
}
