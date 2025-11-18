using admin.Classes;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlTypes;
using System.Drawing;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Security.Cryptography;

namespace admin
{
    public partial class Users : Form
    {
        private Database db;
        private List<UsersDB> UsersList = new List<UsersDB>();
        public Users()
        {
            InitializeComponent();

            db = new Database(@"Data source=C:\Users\tekeresdenes\repos\MaxxedOut\api\db\maxxedout.db");
            var users = db.Query("SELECT * FROM users;");

            foreach (DataRow user in users.Rows)
            {
                UsersDB UserObj = new UsersDB(int.Parse(user["id"].ToString()), user["nickname"].ToString(), user["email"].ToString(), user["password"].ToString());
                UsersList.Add(UserObj);
                Rows.Items.Add(UserObj);
            }

        }

        // Navigation handling

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void exercisesToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Exercises ExercisesForm = new Exercises();
            ExercisesForm.ShowDialog();
        }

        private void muscleGroupsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Muscle_groups MusclegroupsForm = new Muscle_groups();
            MusclegroupsForm.ShowDialog();
        }

        // Data handling

        private void searchButton_Click(object sender, EventArgs e)
        {
            Rows.Items.Clear();
            nickname.Clear();
            email.Clear();
            password.Clear();

            if (string.IsNullOrWhiteSpace(search.Text))
            {
                foreach (var user in UsersList)
                {
                    Rows.Items.Add(user);
                }
            }
            else
            {
                foreach(var user in UsersList.Where(user => user.Nickname.Contains(search.Text) || user.Email.Contains(search.Text)))
                {
                    Rows.Items.Add(user);
                }
            }
        }

        public void Rows_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (Rows.SelectedItem == null) return;

            UsersDB user = Rows.SelectedItem as UsersDB;

            if (user == null) return;

            nickname.Text = user.Nickname;
            email.Text = user.Email;
            password.Clear();
        }

        private void addButton_Click(object sender, EventArgs e)
        {
            if(string.IsNullOrWhiteSpace(nickname.Text) || string.IsNullOrWhiteSpace(email.Text) || string.IsNullOrWhiteSpace(password.Text))
            {
                MessageBox.Show("Nickname, email nor password can be blank!");
                return;
            }

            if (UsersList.Any(user => user.Nickname == nickname.Text))
            {
                MessageBox.Show("Nickname already in database!");
                return;
            }

            if (UsersList.Any(user => user.Email == email.Text))
            {
                MessageBox.Show("Email already in database!");
                return;
            }

            if (!IsPwdValid(password.Text))
            {
                return;
            }

            UsersDB userObj = new UsersDB(nickname.Text, email.Text, password.Text);

            UsersList.Add(userObj);
            Rows.Items.Add(userObj);

            db.Execute($"INSERT INTO users (nickname, email, password) VALUES ('{userObj.Nickname}', '{userObj.Email}', '{userObj.Password}')");
        }

        private void saveButton_Click(object sender, EventArgs e)
        {
            if (Rows.SelectedIndex < 0)
            {
                MessageBox.Show("Need to select an item first to save it!");
                return;
            }

            UsersDB userObj = Rows.SelectedItem as UsersDB;

            if(userObj == null)
            {
                MessageBox.Show("Invalid item!");
                return;
            }

            if (string.IsNullOrWhiteSpace(nickname.Text) || string.IsNullOrWhiteSpace(email.Text))
            {
                MessageBox.Show("Nickname and email can't be blank!");
                return;
            }

            userObj.Email = email.Text;
            userObj.Nickname = nickname.Text;
            if(!string.IsNullOrWhiteSpace(password.Text) && IsPwdValid(password.Text)) userObj.Password = userObj.PwdEncrypt(password.Text);

            Rows.Items[Rows.SelectedIndex] = userObj;

            db.Execute($"UPDATE users SET nickname='{userObj.Nickname}', email='{userObj.Email}', password='{userObj.Password}' WHERE id='{userObj.ID}'");
        }

        private void deleteButton_Click(object sender, EventArgs e)
        {
            if (Rows.SelectedIndex < 0)
            {
                MessageBox.Show("Need to select an item first to delete it!");
                return;
            }

            UsersDB userObj = Rows.SelectedItem as UsersDB;

            UsersList.Remove(userObj);
            Rows.Items.Remove(userObj);

            nickname.Clear();
            email.Clear();
            password.Clear();

            db.Execute($"DELETE FROM users WHERE id='{userObj.ID}'");
        }

        public bool IsPwdValid(string pwd)
        {
            if(pwd.Length >= 8 && pwd.Any(char.IsDigit))
            {
                return true;
            }

            MessageBox.Show("Enter a valid password!");
            return false;
        }

        private void savetableButton_Click(object sender, EventArgs e)
        {

        }
    }

    public class UsersDB
    {
        public int ID { get; set; }
        public string Nickname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public UsersDB(string nickname, string email, string password)
        {
            Nickname = nickname;
            Email = email;
            Password = PwdEncrypt(password);
        }


        public UsersDB(int id, string nickname, string email, string password)
        {
            ID = id;
            Nickname = nickname;
            Email = email;
            Password = PwdEncrypt(password);
        }

        public override string ToString()
        {
            return Nickname;
        }

        public string PwdEncrypt(string pwd)
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
    }
}
