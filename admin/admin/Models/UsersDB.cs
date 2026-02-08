using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace admin.Models
{
    public class UsersDB
    {
        public int Id { get; set; }
        public string Nickname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public UsersDB() { }
        public UsersDB(int id, string nickname, string email, string password)
        {
            Id = id;
            Nickname = nickname;
            Email = email;
            Password = password;
        }
        public UsersDB(int id, string nickname, string email, string password, bool isHashed)
        {
            Id = id;
            Nickname = nickname;
            Email = email;
            Password = isHashed ? password : PwdEncrypt(password);
        }

        public override string ToString()
        {
            return string.IsNullOrEmpty(Nickname) ? Email : Nickname;
        }

        public static string PwdEncrypt(string pwd)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(pwd);

            using (SHA512 sha512 = SHA512.Create())
            {
                byte[] hashBytes = sha512.ComputeHash(bytes);

                StringBuilder sb = new StringBuilder();
                foreach (byte b in hashBytes)
                {
                    sb.Append(b.ToString("x2"));
                }

                return sb.ToString();
            }
        }

        public static bool IsEmailValid(string email)
        {
            try
            {
                MailAddress mailAddress = new MailAddress(email);
                return true;
            }
            catch (FormatException)
            {
                MessageBox.Show("Not valid email!");
                return false;
            }
        }

        public static bool IsPwdValid(string pwd)
        {
            if (pwd.Length >= 8 && pwd.Any(char.IsDigit))
            {
                return true;
            }

            MessageBox.Show("Enter a valid password!");
            return false;
        }
    }
}
